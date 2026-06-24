/**
 * ============================================================
 *  Community Hero — Issue DNA & Duplicate Detection
 * ============================================================
 *  Creates a unique "DNA" fingerprint for every issue based on
 *  location hash + category + severity + temporal proximity.
 *
 *  Core capabilities:
 *    • generate()              – deterministic DNA string
 *    • similarity()            – 0-100 similarity score
 *    • findDuplicates()        – scan existing issues for dupes
 *    • buildDuplicateOverlayHTML() – side-by-side comparison UI
 *    • mergeWithExisting()     – merge evidence into existing
 *    • dismissDuplicate()      – file as new despite match
 *
 *  Scoring weights:
 *    Category match ............. 40 pts
 *    Geo proximity (< 200 m) .... up to 35 pts
 *    Temporal proximity (< 7 d) . up to 15 pts
 *    Severity closeness ......... up to 10 pts
 *                                 --------
 *    Maximum .................... 100 pts
 *
 *  Uses classic `window.CommunityHero` namespace — no ES modules.
 * ============================================================
 */

window.CommunityHero = window.CommunityHero || {};

CommunityHero.issueDNA = {

  // ──────────────────────────────────────────────
  //  DNA Generation
  // ──────────────────────────────────────────────

  /**
   * Generate a unique DNA fingerprint for an issue.
   *
   * Format:  DNA-<CAT>-<latHash><lngHash>-S<severity>
   *
   * The lat/lng are rounded to 4 decimal places (~11 m accuracy)
   * and encoded in base-36 for compactness.
   *
   * @param  {Object} issue  Must contain .location.lat, .location.lng,
   *                         .category, and .severity
   * @return {string}        e.g. "DNA-POT-2jk1a5f-S3"
   */
  generate: function (issue) {
    var latHash = Math.round(issue.location.lat * 10000).toString(36);
    var lngHash = Math.round(issue.location.lng * 10000).toString(36);
    var catHash = issue.category.substr(0, 3).toUpperCase();
    var sevHash = issue.severity.toString();
    return 'DNA-' + catHash + '-' + latHash + lngHash + '-S' + sevHash;
  },

  // ──────────────────────────────────────────────
  //  Haversine Distance (private helper)
  // ──────────────────────────────────────────────

  /**
   * Calculate the great-circle distance between two lat/lng
   * points using the Haversine formula.
   *
   * @param  {number} lat1  Latitude of point A  (degrees)
   * @param  {number} lng1  Longitude of point A (degrees)
   * @param  {number} lat2  Latitude of point B  (degrees)
   * @param  {number} lng2  Longitude of point B (degrees)
   * @return {number}       Distance in **meters**
   */
  _distanceMeters: function (lat1, lng1, lat2, lng2) {
    var R    = 6371000; // Earth radius in meters
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // ──────────────────────────────────────────────
  //  Similarity Scoring
  // ──────────────────────────────────────────────

  /**
   * Calculate a 0-100 similarity score between two issues.
   *
   * Breakdown:
   *   Category match      → +40
   *   Geo proximity       → +35 / +30 / +20 / +10
   *   Temporal proximity  → +15 / +10 / +5
   *   Severity closeness  → +10 / +5
   *
   * @param  {Object} issueA
   * @param  {Object} issueB
   * @return {number}         Clamped to [0, 100]
   */
  similarity: function (issueA, issueB) {
    var score = 0;

    // --- Category match: +40 points ---
    if (issueA.category === issueB.category) {
      score += 40;
    }

    // --- Geo proximity: up to +35 points (closer = higher) ---
    var dist = this._distanceMeters(
      issueA.location.lat, issueA.location.lng,
      issueB.location.lat, issueB.location.lng
    );
    if      (dist < 50)  score += 35;
    else if (dist < 100) score += 30;
    else if (dist < 200) score += 20;
    else if (dist < 500) score += 10;

    // --- Temporal proximity: up to +15 points (within 7 days) ---
    var daysDiff = Math.abs(
      new Date(issueA.reportedAt) - new Date(issueB.reportedAt)
    ) / (1000 * 60 * 60 * 24);

    if      (daysDiff < 1) score += 15;
    else if (daysDiff < 3) score += 10;
    else if (daysDiff < 7) score += 5;

    // --- Severity closeness: up to +10 points ---
    var sevDiff = Math.abs(issueA.severity - issueB.severity);
    if      (sevDiff === 0) score += 10;
    else if (sevDiff === 1) score += 5;

    return Math.min(score, 100);
  },

  // ──────────────────────────────────────────────
  //  Duplicate Finder
  // ──────────────────────────────────────────────

  /**
   * Find potential duplicates for a given issue by scanning
   * the existing data store.
   *
   * Only unresolved issues scoring ≥ 50 are returned.
   *
   * @param  {Object} newIssue  The issue being reported
   * @return {Array}            Sorted by similarity DESC.
   *         Each element: { issue, similarity, distance, dna }
   */
  findDuplicates: function (newIssue) {
    var self      = this;
    var threshold = 50;   // Minimum similarity to flag as potential dup
    var existing  = CommunityHero.data.issues;
    var matches   = [];

    existing.forEach(function (existingIssue) {
      // Skip self-comparison
      if (existingIssue.id === newIssue.id) return;
      // Skip already-resolved issues
      if (existingIssue.status === 'resolved') return;

      var sim = self.similarity(newIssue, existingIssue);

      if (sim >= threshold) {
        var dist = self._distanceMeters(
          newIssue.location.lat,      newIssue.location.lng,
          existingIssue.location.lat, existingIssue.location.lng
        );
        matches.push({
          issue:      existingIssue,
          similarity: sim,
          distance:   Math.round(dist),
          dna:        self.generate(existingIssue)
        });
      }
    });

    // Highest similarity first
    matches.sort(function (a, b) { return b.similarity - a.similarity; });
    return matches;
  },

  // ──────────────────────────────────────────────
  //  Duplicate Overlay UI Builder
  // ──────────────────────────────────────────────

  /**
   * Build the HTML for the duplicate-detection overlay that
   * shows a side-by-side comparison between the user's new
   * report and the best existing match.
   *
   * @param  {Object} newIssue    The issue being reported
   * @param  {Array}  duplicates  Output of findDuplicates()
   * @return {string}             HTML string (empty if no dupes)
   */
  buildDuplicateOverlayHTML: function (newIssue, duplicates) {
    if (!duplicates || duplicates.length === 0) return '';

    var cats   = CommunityHero.data.categories;
    var newCat = cats[newIssue.category] || cats['other'];

    // --- Container ---
    var html = '<div class="ch-dna-overlay">';

    // --- Header ---
    html += '<div class="ch-dna-header">';
    html += '  <span class="ch-dna-icon">🧬</span>';
    html += '  <h3>Issue DNA: Potential Duplicates Found</h3>';
    html += '  <p class="ch-text-sm ch-text-secondary">';
    html += '    The Verification Agent detected ' + duplicates.length +
            ' similar report' + (duplicates.length > 1 ? 's' : '') +
            ' in the system.';
    html += '  </p>';
    html += '</div>';

    // --- Side-by-side comparison ---
    html += '<div class="ch-dna-comparison">';

    // Left card: new issue
    html += '<div class="ch-dna-new">';
    html += '  <div class="ch-dna-label">YOUR REPORT (NEW)</div>';
    html += '  <div class="ch-dna-card-mini">';
    html += '    <strong>' + newCat.emoji + ' ' +
            (newIssue.title || newIssue.category) + '</strong>';
    html += '    <p>📍 ' + newIssue.location.address + '</p>';
    html += '    <p>Severity: ' + newIssue.severity + '/5</p>';
    html += '    <p class="ch-text-xs">DNA: ' + this.generate(newIssue) + '</p>';
    html += '  </div>';
    html += '</div>';

    // VS divider
    html += '<div class="ch-dna-vs">VS</div>';

    // Right card: best existing match
    var best    = duplicates[0];
    var bestCat = cats[best.issue.category] || cats['other'];

    html += '<div class="ch-dna-existing">';
    html += '  <div class="ch-dna-label">EXISTING REPORT (' +
            best.similarity + '% MATCH)</div>';
    html += '  <div class="ch-dna-card-mini">';
    html += '    <strong>' + bestCat.emoji + ' ' +
            best.issue.title + '</strong>';
    html += '    <p>📍 ' + best.issue.location.address + '</p>';
    html += '    <p>Severity: ' + best.issue.severity + '/5 · ' +
            best.distance + 'm away</p>';
    html += '    <p>👍 ' + best.issue.upvotes + ' upvotes · 🛡️ ' +
            best.issue.verifications.length + ' verifications</p>';
    html += '    <p class="ch-text-xs">DNA: ' + best.dna + '</p>';
    html += '  </div>';
    html += '</div>';

    html += '</div>'; // end .ch-dna-comparison

    // --- Similarity score bar ---
    html += '<div class="ch-dna-score">';
    html += '  <div class="ch-dna-score-bar">';
    html += '    <div class="ch-dna-score-fill" style="width:' +
            best.similarity + '%"></div>';
    html += '  </div>';
    html += '  <span>' + best.similarity + '% Similar</span>';
    html += '</div>';

    // --- Action buttons ---
    html += '<div class="ch-dna-actions">';
    html += '  <button class="ch-btn ch-btn-primary ch-btn-sm" ' +
            'onclick="CommunityHero.issueDNA.mergeWithExisting(\'' +
            best.issue.id + '\')">';
    html += '    🔗 Merge with Existing (adds your evidence)';
    html += '  </button>';
    html += '  <button class="ch-btn ch-btn-outline ch-btn-sm" ' +
            'onclick="CommunityHero.issueDNA.dismissDuplicate()">';
    html += '    ➕ Report as New Issue';
    html += '  </button>';
    html += '</div>';

    html += '</div>'; // end .ch-dna-overlay
    return html;
  },

  // ──────────────────────────────────────────────
  //  Merge Flow
  // ──────────────────────────────────────────────

  /**
   * Merge the user's new report into an existing issue by
   * adding a verification, a timeline event, and bumping
   * community signals (upvotes).
   *
   * @param {string} existingId  ID of the existing issue
   */
  mergeWithExisting: function (existingId) {
    var issue = CommunityHero.data.getIssueById(existingId);
    if (!issue) return;

    // Add a new verification entry
    issue.verifications.push({
      userId:    'USR-001',
      name:      'Aarna Sharma',
      stake:     20,
      verified:  true,
      timestamp: new Date().toISOString()
    });

    // Append a timeline event describing the merge
    issue.timeline.push({
      event:     'merged',
      timestamp: new Date().toISOString(),
      actor:     'Verification Agent',
      detail:    'Duplicate report merged. Additional evidence from ' +
                 'Aarna Sharma added. Verification staked: 20 pts.'
    });

    // Bump upvotes to reflect extra community interest
    issue.upvotes += 3;

    // Notify the agent system about the merge
    if (CommunityHero.agents) {
      CommunityHero.agents.registry.verification.verify(
        existingId, true, CommunityHero.issueDNA.generate(issue)
      );
      CommunityHero.agents.log(
        'Orchestrator', 'MERGE',
        'Duplicate report merged into ' + existingId +
        '. Community evidence strengthened.',
        '#8b5cf6'
      );
    }

    // Hide the duplicate-detection overlay
    var overlay = document.getElementById('dna-overlay-container');
    if (overlay) overlay.classList.add('ch-hidden');

    // Award XP for verifying
    CommunityHero.gamification.addXP('USR-001', 'verify-issue');

    // UI feedback
    if (CommunityHero.app) {
      CommunityHero.app.showToast(
        '🧬 Report merged! +30 XP. Your evidence strengthened the existing report.',
        'success'
      );
      CommunityHero.app.renderHome();
    }
  },

  // ──────────────────────────────────────────────
  //  Dismiss Duplicate
  // ──────────────────────────────────────────────

  /**
   * User chose to file as a new report despite the duplicate
   * detection match.  Hides the overlay and logs the override.
   */
  dismissDuplicate: function () {
    var overlay = document.getElementById('dna-overlay-container');
    if (overlay) overlay.classList.add('ch-hidden');

    // Log the override decision
    if (CommunityHero.agents) {
      CommunityHero.agents.log(
        'Verification', 'OVERRIDE',
        'User chose to file as new report despite duplicate detection.',
        '#118ab2'
      );
    }

    // UI feedback
    if (CommunityHero.app) {
      CommunityHero.app.showToast(
        '➕ Filed as new report. Duplicate override noted.',
        'info'
      );
    }
  }
};
