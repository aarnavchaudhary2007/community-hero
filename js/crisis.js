/**
 * ============================================================================
 *  Community Hero — Crisis Mode System
 * ============================================================================
 *
 *  Provides real-time crisis detection, emergency alerting, geofence
 *  visualization, and formal complaint generation for the Community Hero
 *  civic-engagement platform.
 *
 *  Features:
 *    1. Auto-Detection   — Scans issues for severity >= 4; activates full
 *                          crisis mode when a severity-5 emergency is found.
 *    2. Crisis Banner     — Shows / hides a pulsing red banner at page top.
 *    3. Geofence Zones    — Adds red pulsing Leaflet circles for danger areas.
 *    4. Emergency Alerts  — Simulates push notifications to nearby citizens.
 *    5. Complaint Gen     — Builds a plain-text formal municipal complaint.
 *    6. Dashboard Stats   — Returns crisis-specific statistics for the UI.
 *
 *  Usage:
 *    <script src="js/crisis.js"></script>
 *    CommunityHero.crisis.scan();          // run the scanner
 *    CommunityHero.crisis.getStats();      // read current stats
 *
 *  Dependencies (soft — degrades gracefully if absent):
 *    - CommunityHero.data       (issue store)
 *    - CommunityHero.map        (Leaflet map wrapper)
 *    - CommunityHero.agents     (agent escalation bus)
 *    - L (Leaflet global)
 *
 * ============================================================================
 */

window.CommunityHero = window.CommunityHero || {};

CommunityHero.crisis = (function () {
  'use strict';

  // ── Private state ────────────────────────────────────────────────────────
  var _active          = false;
  var _crisisIssues    = [];
  var _geofenceCircles = [];

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Safely read `CommunityHero.data.issues`, returning an empty array when
   * the data module hasn't loaded yet.
   */
  function _getIssues() {
    return (CommunityHero.data && Array.isArray(CommunityHero.data.issues))
      ? CommunityHero.data.issues
      : [];
  }

  /**
   * Sum the `aiAnalysis.impactedPeople` field across a list of issues.
   */
  function _sumImpacted(issues) {
    return issues.reduce(function (sum, i) {
      return sum + (i.aiAnalysis ? (i.aiAnalysis.impactedPeople || 0) : 0);
    }, 0);
  }

  // ── Public API ───────────────────────────────────────────────────────────

  return {
    /* ------------------------------------------------------------------ *
     *  Reactive state — exposed for quick reads by other modules
     * ------------------------------------------------------------------ */
    get _active()          { return _active; },
    get _crisisIssues()    { return _crisisIssues; },
    get _geofenceCircles() { return _geofenceCircles; },

    // ====================================================================
    //  1. AUTO-DETECTION — scan()
    // ====================================================================

    /**
     * Walk every issue in the data store, collect those with severity >= 4
     * that are not yet resolved, and decide whether to flip crisis mode
     * on or off.
     *
     * @returns {Array} The list of crisis-level issues.
     */
    scan: function () {
      var issues = _getIssues();

      // Filter to active, high-severity issues
      _crisisIssues = issues.filter(function (i) {
        return i.severity >= 4 && i.status !== 'resolved';
      });

      var hasSev5 = _crisisIssues.some(function (i) {
        return i.severity === 5;
      });

      // Activate / deactivate based on severity-5 presence
      if (hasSev5 && !_active) {
        this.activate();
      } else if (!hasSev5 && _active) {
        this.deactivate();
      }

      // Always refresh the banner text
      this.updateBanner();

      return _crisisIssues;
    },

    // ====================================================================
    //  Activate / Deactivate
    // ====================================================================

    /**
     * Enter full crisis mode — adds a body class for CSS-level theming and
     * pushes a high-priority escalation through the agent bus.
     */
    activate: function () {
      _active = true;
      document.body.classList.add('ch-crisis-active');

      // Notify the agent escalation system (if loaded)
      if (
        CommunityHero.agents &&
        CommunityHero.agents.registry &&
        CommunityHero.agents.registry.escalation
      ) {
        CommunityHero.agents.registry.escalation.escalate(
          'SYSTEM',
          'CRISIS MODE ACTIVATED — Severity 5 emergency detected. All nearby citizens alerted.'
        );
      }

      console.warn('[CommunityHero:Crisis] 🚨 CRISIS MODE ACTIVATED');
    },

    /**
     * Leave crisis mode — removes the body class and clears visual cues.
     */
    deactivate: function () {
      _active = false;
      document.body.classList.remove('ch-crisis-active');

      console.info('[CommunityHero:Crisis] ✅ Crisis mode deactivated');
    },

    // ====================================================================
    //  2. CRISIS BANNER
    // ====================================================================

    /**
     * Update the crisis banner element (#crisis-banner) to reflect the
     * current set of crisis issues.  Hides the banner when there are none.
     */
    updateBanner: function () {
      var banner = document.getElementById('crisis-banner');
      if (!banner) return;               // element not in the DOM yet

      // Nothing to show → hide
      if (_crisisIssues.length === 0) {
        banner.classList.add('ch-hidden');
        return;
      }

      banner.classList.remove('ch-hidden');

      var sev5 = _crisisIssues.filter(function (i) { return i.severity === 5; });
      var sev4 = _crisisIssues.filter(function (i) { return i.severity === 4; });

      var totalPeople = _sumImpacted(_crisisIssues);

      // Build human-readable summary
      var text = '\uD83D\uDEA8 CRISIS ALERT: ';           // 🚨

      if (sev5.length > 0) {
        text += sev5.length + ' EMERGENCY';
      }
      if (sev4.length > 0) {
        text += (sev5.length > 0 ? ' + ' : '') + sev4.length + ' Critical';
      }

      text += ' issue' + (_crisisIssues.length > 1 ? 's' : '') + ' detected';
      text += ' — ' + totalPeople.toLocaleString() + ' citizens at risk';

      var textEl = banner.querySelector('.crisis-banner-text');
      if (textEl) {
        textEl.textContent = text;
      }
    },

    // ====================================================================
    //  3. GEOFENCE ZONES — Leaflet danger circles
    // ====================================================================

    /**
     * Draw translucent, dashed circles on the Leaflet map for every crisis
     * issue.  Severity-5 issues get a larger, redder circle.
     *
     * Requires `CommunityHero.map.map` (the raw Leaflet instance) and the
     * Leaflet global `L`.
     */
    addGeofenceZones: function () {
      // Guard: bail if the map module isn't ready
      if (!CommunityHero.map || !CommunityHero.map.map) return;
      if (typeof L === 'undefined') return;

      var self = this;

      // Tear down previous circles so we don't stack duplicates
      _geofenceCircles.forEach(function (c) {
        CommunityHero.map.map.removeLayer(c);
      });
      _geofenceCircles = [];

      // One circle per crisis issue
      _crisisIssues.forEach(function (issue) {
        var color  = issue.severity === 5 ? '#dc2626' : '#ef476f';
        var radius = issue.severity === 5 ? 500 : 300;

        var circle = L.circle(
          [issue.location.lat, issue.location.lng],
          {
            radius:      radius,
            color:       color,
            fillColor:   color,
            fillOpacity: 0.15,
            weight:      2,
            opacity:     0.6,
            dashArray:   '8 4',
            className:   'ch-crisis-geofence'       // for CSS pulse animation
          }
        ).addTo(CommunityHero.map.map);

        // Rich popup with a deep-link into the issue detail view
        circle.bindPopup(
          '<div class="ch-map-popup">' +
            '<strong style="color:' + color + '">\u26A0\uFE0F DANGER ZONE</strong>' +
            '<p>' + issue.title + '</p>' +
            '<p>Severity: ' + issue.severity + '/5 — ' +
              (issue.aiAnalysis ? issue.aiAnalysis.impactedPeople : 'Unknown') +
              ' people at risk</p>' +
            '<button onclick="CommunityHero.app.showIssueDetail(\'' + issue.id + '\')" ' +
              'style="background:linear-gradient(135deg,' + color + ',#ef476f)">' +
              'View Emergency Details \u2192</button>' +
          '</div>'
        );

        _geofenceCircles.push(circle);
      });
    },

    // ====================================================================
    //  4. EMERGENCY ALERTS — simulated push notifications
    // ====================================================================

    /**
     * Simulate sending emergency notifications to citizens within the
     * geofence of each crisis issue.  Returns a summary array describing
     * what was "sent".
     *
     * In a production build this would hit a push-notification service;
     * here it generates realistic log entries for the agent dashboard.
     *
     * @returns {Array<Object>} One entry per crisis issue with details.
     */
    sendEmergencyAlerts: function () {
      var alerts = [];

      _crisisIssues.forEach(function (issue) {
        var impacted = (issue.aiAnalysis && issue.aiAnalysis.impactedPeople)
          ? issue.aiAnalysis.impactedPeople
          : 0;

        // Simulated notification payload
        var alert = {
          issueId:      issue.id,
          title:        issue.title,
          severity:     issue.severity,
          sentAt:       new Date().toISOString(),
          recipientEst: Math.max(1, Math.round(impacted * 0.8)),  // ~80 % reachable
          radius:       issue.severity === 5 ? 500 : 300,
          message:      '\uD83D\uDEA8 EMERGENCY: ' + issue.title +
                        ' — Stay away from ' + issue.location.address +
                        '. Authorities have been notified.'
        };

        alerts.push(alert);

        console.warn(
          '[CommunityHero:Crisis] \uD83D\uDCE2 Alert sent for "' +
          issue.title + '" — est. ' + alert.recipientEst + ' recipients'
        );
      });

      return alerts;
    },

    // ====================================================================
    //  5. FORMAL COMPLAINT GENERATOR
    // ====================================================================

    /**
     * Build a plain-text formal municipal complaint for the given issue.
     * The output is clipboard-ready and suitable for e-filing with local
     * government portals.
     *
     * @param {string} issueId — The unique ID of the issue.
     * @returns {string} The formatted complaint text, or an error string.
     */
    generateComplaint: function (issueId) {
      // Resolve the issue from the data store
      if (!CommunityHero.data || !CommunityHero.data.getIssueById) {
        return 'Error: Data module not loaded.';
      }

      var issue = CommunityHero.data.getIssueById(issueId);
      if (!issue) return 'Issue not found.';

      var cats = CommunityHero.data.categories || {};
      var cat  = cats[issue.category] || cats['other'] || { emoji: '📋', label: issue.category };
      var ai   = issue.aiAnalysis || {};
      var now  = new Date();

      var divider = '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550' +
                    '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550' +
                    '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550' +
                    '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550' +
                    '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550' +
                    '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550' +
                    '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550' +
                    '\u2550\u2550';    // ══════…

      var complaint = [
        divider,
        '    FORMAL MUNICIPAL COMPLAINT \u2014 AUTO-GENERATED',
        '    Community Hero Platform \u2014 AI-Assisted Filing',
        divider,
        '',
        'Date              : ' + now.toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric'
        }),
        'Reference No.     : ' + issue.id + '-COMPLAINT',
        'Priority          : ' + (issue.severity >= 4 ? '*** URGENT ***' : 'Standard'),
        '',
        '--- ISSUE DETAILS ---',
        'Category          : ' + cat.emoji + ' ' + cat.label,
        'Severity Level    : ' + issue.severity + '/5',
        'Risk Score        : ' + (ai.riskScore || 'N/A') + '/10',
        'Location          : ' + issue.location.address,
        'Ward              : ' + (issue.location.ward || 'N/A'),
        'GPS Coordinates   : ' + issue.location.lat.toFixed(6) + ', ' + issue.location.lng.toFixed(6),
        '',
        '--- DESCRIPTION ---',
        issue.description || issue.title,
        '',
        '--- AI ANALYSIS ---',
        'Estimated Size    : ' + (ai.estimatedSize || 'N/A'),
        'Impacted Citizens : ' + (ai.impactedPeople ? ai.impactedPeople.toLocaleString() : 'N/A'),
        'Decay Forecast    : ' + (ai.decayPrediction || 'N/A'),
        'Suggested Dept    : ' + (ai.suggestedDept || 'N/A'),
        '',
        '--- COMMUNITY EVIDENCE ---',
        'Reported By       : ' + issue.reportedBy.name +
          ' (Trust Score: ' + issue.reportedBy.trustScore + ')',
        'Verifications     : ' + issue.verifications.length + ' community members',
        'Community Upvotes : ' + issue.upvotes,
        'Report Date       : ' + new Date(issue.reportedAt).toLocaleString('en-IN'),
        '',
        '--- REQUEST ---',
        'The undersigned citizen requests immediate attention to the above-described',
        'civic infrastructure issue. Community data indicates ' +
          (ai.impactedPeople || 'significant') + ' citizens',
        'are affected. AI analysis predicts the issue will worsen if unaddressed.',
        '',
        'Respectfully submitted via Community Hero AI Platform.',
        divider
      ].join('\n');

      return complaint;
    },

    // ====================================================================
    //  6. CRISIS DASHBOARD STATS
    // ====================================================================

    /**
     * Return a snapshot of the current crisis state for dashboard widgets
     * and status indicators.
     *
     * @returns {Object} Stats object with counts and totals.
     */
    getStats: function () {
      var sev5Count = _crisisIssues.filter(function (i) {
        return i.severity === 5;
      }).length;

      var sev4Count = _crisisIssues.filter(function (i) {
        return i.severity === 4;
      }).length;

      var totalPeople = _sumImpacted(_crisisIssues);

      return {
        isActive:      _active,
        totalCrises:   _crisisIssues.length,
        emergencies:   sev5Count,
        critical:      sev4Count,
        citizensAtRisk: totalPeople
      };
    }
  };
})();
