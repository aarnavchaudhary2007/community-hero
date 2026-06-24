/**
 * ============================================================================
 *  Community Hero — Agent Hub System (agents.js)
 * ============================================================================
 *
 *  Implements the multi-agent orchestration layer for Community Hero.
 *  Eight specialised agents collaborate to process civic issue reports:
 *
 *    1. 🧠 Orchestrator   — Central brain, routes tasks, resolves conflicts
 *    2. 🔍 Triage          — Multi-modal analysis, severity scoring
 *    3. 🛡️ Verification    — Duplicate / fake detection, community consensus
 *    4. 🎯 Resolution      — Department matching, action-plan generation
 *    5. 💰 Micro-Bounty    — Cost estimation, crowdfunding, payouts
 *    6. 🔮 Prediction      — Historical pattern analysis, forecasting
 *    7. 📣 Engagement      — Nudges, gamification, community challenges
 *    8. 🚨 Escalation      — Urgency detection, formal complaint drafts
 *
 *  Usage:
 *    <script src="js/agents.js"></script>
 *    CommunityHero.agents.boot();                     // seed initial activity
 *    CommunityHero.agents.runFullPipeline(issue, a);  // orchestrate an issue
 *    CommunityHero.agents.getRecentActivity(10);      // last 10 log entries
 *
 *  All activity is stored in `activityLog[]` (capped at 50 entries) and
 *  every new entry dispatches a `agents:activity` CustomEvent on `document`
 *  so UI components can react in real-time.
 *
 *  No ES-module imports — uses the classic `window.CommunityHero` namespace.
 * ============================================================================
 */

window.CommunityHero = window.CommunityHero || {};

CommunityHero.agents = {

  // ---------------------------------------------------------------------------
  //  Activity Log — central, append-only log shared by all agents
  // ---------------------------------------------------------------------------
  activityLog: [],

  /**
   * Log an agent action.
   *
   * @param {string} agentName  — Human-readable agent name (e.g. "Triage")
   * @param {string} action     — Action verb / tag  (e.g. "ANALYZE")
   * @param {string} detail     — Freeform description of what happened
   * @param {string} color      — Hex colour associated with the agent
   */
  log: function (agentName, action, detail, color) {
    var entry = {
      timestamp: new Date().toISOString(),
      agent: agentName,
      action: action,
      detail: detail,
      color: color || '#6b7280'
    };

    this.activityLog.push(entry);

    // Keep the log bounded — oldest entries are discarded first
    if (this.activityLog.length > 50) {
      this.activityLog = this.activityLog.slice(-50);
    }

    // Notify any listening UI components
    if (typeof document !== 'undefined') {
      document.dispatchEvent(
        new CustomEvent('agents:activity', { detail: entry })
      );
    }
  },

  // ---------------------------------------------------------------------------
  //  Agent Registry — all 8 agents live here
  // ---------------------------------------------------------------------------
  registry: {

    // ── 1. Orchestrator Agent ───────────────────────────────────────────────
    orchestrator: {
      name: 'Orchestrator Agent',
      emoji: '🧠',
      status: 'active',
      color: '#8b5cf6',
      description:
        'Central brain — routes tasks, resolves conflicts between agents, maintains context',
      totalTasks: 0,

      /**
       * Route an issue between agents.
       *
       * @param {string} issueId   — e.g. "ISS-042"
       * @param {string} fromAgent — source agent or "User Report"
       * @param {string} toAgent   — destination agent
       */
      route: function (issueId, fromAgent, toAgent) {
        this.totalTasks++;
        CommunityHero.agents.log(
          'Orchestrator',
          'ROUTE',
          'Routing ' + issueId + ' from ' + fromAgent + ' → ' + toAgent,
          this.color
        );
      }
    },

    // ── 2. Triage Agent ─────────────────────────────────────────────────────
    triage: {
      name: 'Triage Agent',
      emoji: '🔍',
      status: 'active',
      color: '#06d6a0',
      description:
        'Multi-modal analysis (image + text + location), severity scoring, auto-categorization',
      totalAnalyzed: 0,

      /**
       * Analyse and classify an issue.
       *
       * @param {string} issueId    — Issue identifier
       * @param {string} category   — Detected category label
       * @param {number} severity   — 1-5 scale
       * @param {number} confidence — 0-100 percentage
       */
      analyze: function (issueId, category, severity, confidence) {
        this.totalAnalyzed++;
        CommunityHero.agents.log(
          'Triage',
          'ANALYZE',
          'Issue ' +
            issueId +
            ': Classified as ' +
            category +
            ' (severity ' +
            severity +
            '/5, confidence ' +
            confidence +
            '%)',
          this.color
        );
      }
    },

    // ── 3. Verification Agent ───────────────────────────────────────────────
    verification: {
      name: 'Verification Agent',
      emoji: '🛡️',
      status: 'active',
      color: '#118ab2',
      description:
        'Cross-references reports, checks for fake/duplicate reports, verifies via community consensus',
      totalVerified: 0,

      /**
       * Verify authenticity and check for duplicates.
       *
       * @param {string}  issueId     — Issue identifier
       * @param {boolean} isDuplicate — Whether a duplicate was detected
       * @param {string}  dnaHash     — Issue-DNA fingerprint hash
       */
      verify: function (issueId, isDuplicate, dnaHash) {
        this.totalVerified++;
        if (isDuplicate) {
          CommunityHero.agents.log(
            'Verification',
            'DUPLICATE',
            'Issue ' +
              issueId +
              ' matches existing report (DNA: ' +
              dnaHash +
              '). Merge recommended.',
            '#f97316'
          );
        } else {
          CommunityHero.agents.log(
            'Verification',
            'VERIFIED',
            'Issue ' +
              issueId +
              ' passed authenticity check. DNA hash: ' +
              dnaHash,
            this.color
          );
        }
      }
    },

    // ── 4. Resolution Agent ─────────────────────────────────────────────────
    resolution: {
      name: 'Resolution Agent',
      emoji: '🎯',
      status: 'active',
      color: '#73d2de',
      description:
        'Matches issues to relevant departments, generates action plans, monitors resolution progress',
      totalRouted: 0,

      /**
       * Route to the responsible municipal department.
       *
       * @param {string} issueId    — Issue identifier
       * @param {string} department — Target department name
       */
      route: function (issueId, department) {
        this.totalRouted++;
        CommunityHero.agents.log(
          'Resolution',
          'ROUTE',
          'Issue ' + issueId + ' auto-routed to ' + department,
          this.color
        );
      },

      /**
       * Generate a step-by-step action plan / playbook.
       *
       * @param {string} issueId — Issue identifier
       */
      generatePlan: function (issueId) {
        CommunityHero.agents.log(
          'Resolution',
          'ACTION_PLAN',
          'Generated resolution playbook for ' +
            issueId +
            ' with estimated timeline',
          this.color
        );
      }
    },

    // ── 5. Micro-Bounty Agent ───────────────────────────────────────────────
    bounty: {
      name: 'Micro-Bounty Agent',
      emoji: '💰',
      status: 'active',
      color: '#ffd166',
      description:
        'Calculates materials/cost/labor, posts bounties, dynamically adjusts rewards, manages crowdfunding pool',
      totalBounties: 0,

      /**
       * Create a new micro-bounty for community repair.
       *
       * @param {string} issueId      — Issue identifier
       * @param {number} cost         — Estimated repair cost in ₹
       * @param {number} rewardPoints — Hero Points reward for the volunteer
       */
      createBounty: function (issueId, cost, rewardPoints) {
        this.totalBounties++;
        CommunityHero.agents.log(
          'Bounty',
          'CREATE',
          'Posted micro-bounty for ' +
            issueId +
            ': ₹' +
            cost +
            ' estimated, ' +
            rewardPoints +
            ' Hero Points reward',
          this.color
        );
      },

      /**
       * Dynamically adjust the reward for an existing bounty.
       *
       * @param {string} issueId   — Issue identifier
       * @param {number} newPoints — Updated Hero Points value
       * @param {string} reason    — Why the adjustment was made
       */
      adjustReward: function (issueId, newPoints, reason) {
        CommunityHero.agents.log(
          'Bounty',
          'ADJUST',
          'Reward for ' +
            issueId +
            ' adjusted to ' +
            newPoints +
            ' pts (' +
            reason +
            ')',
          this.color
        );
      },

      /**
       * Release escrow funds to the volunteer who resolved the issue.
       *
       * @param {string} issueId — Issue identifier
       * @param {number} amount  — Amount released in ₹
       */
      releasePayout: function (issueId, amount) {
        CommunityHero.agents.log(
          'Bounty',
          'PAYOUT',
          'Escrow released: ₹' +
            amount +
            ' for ' +
            issueId +
            '. Funds transferred to volunteer.',
          this.color
        );
      }
    },

    // ── 6. Prediction Agent ─────────────────────────────────────────────────
    prediction: {
      name: 'Prediction Agent',
      emoji: '🔮',
      status: 'active',
      color: '#ec4899',
      description:
        'Analyzes historical patterns to predict where issues will occur BEFORE reported',
      totalPredictions: 0,

      /**
       * Log a predictive forecast.
       *
       * @param {string} area       — Geographic area or address
       * @param {string} prediction — Human-readable prediction text
       * @param {string} severity   — Risk level: "low" | "medium" | "high"
       */
      predict: function (area, prediction, severity) {
        this.totalPredictions++;
        CommunityHero.agents.log(
          'Prediction',
          'FORECAST',
          area + ': ' + prediction + ' [Risk: ' + severity + ']',
          this.color
        );
      }
    },

    // ── 7. Citizen Engagement Agent ─────────────────────────────────────────
    engagement: {
      name: 'Citizen Engagement Agent',
      emoji: '📣',
      status: 'active',
      color: '#f97316',
      description:
        'Personalized nudges, gamification logic, community challenge generation',
      totalNudges: 0,

      /**
       * Send a personalised nudge notification to a user.
       *
       * @param {string} userId  — Target user identifier
       * @param {string} message — Nudge text
       */
      sendNudge: function (userId, message) {
        this.totalNudges++;
        CommunityHero.agents.log('Engagement', 'NUDGE', message, this.color);
      },

      /**
       * Launch a new community challenge.
       *
       * @param {string} title  — Challenge name
       * @param {string} target — Goal description
       */
      createChallenge: function (title, target) {
        CommunityHero.agents.log(
          'Engagement',
          'CHALLENGE',
          'New community challenge: "' + title + '" — Target: ' + target,
          this.color
        );
      }
    },

    // ── 8. Escalation Agent ─────────────────────────────────────────────────
    escalation: {
      name: 'Escalation Agent',
      emoji: '🚨',
      status: 'active',
      color: '#dc2626',
      description:
        'Auto-detects urgency, escalates to authorities, generates formal complaint drafts',
      totalEscalations: 0,

      /**
       * Escalate a critical issue.
       *
       * @param {string} issueId — Issue identifier
       * @param {string} reason  — Justification for the escalation
       */
      escalate: function (issueId, reason) {
        this.totalEscalations++;
        CommunityHero.agents.log(
          'Escalation',
          'ESCALATE',
          '🚨 CRITICAL: ' + issueId + ' escalated — ' + reason,
          this.color
        );
      },

      /**
       * Auto-generate a formal complaint document.
       *
       * @param {string} issueId — Issue identifier
       */
      generateComplaint: function (issueId) {
        CommunityHero.agents.log(
          'Escalation',
          'COMPLAINT',
          'Formal complaint draft generated for ' +
            issueId +
            ' (ready for municipal submission)',
          this.color
        );
      }
    }
  },

  // ---------------------------------------------------------------------------
  //  Utility Methods
  // ---------------------------------------------------------------------------

  /**
   * Return all registered agents as a flat array.
   * Each element has an extra `id` property (the registry key).
   *
   * @returns {Array<Object>}
   */
  getAll: function () {
    var arr = [];
    for (var key in this.registry) {
      if (this.registry.hasOwnProperty(key)) {
        arr.push(Object.assign({ id: key }, this.registry[key]));
      }
    }
    return arr;
  },

  /**
   * Return the most recent activity log entries (newest first).
   *
   * @param {number} [count=15] — How many entries to return
   * @returns {Array<Object>}
   */
  getRecentActivity: function (count) {
    return this.activityLog.slice(-(count || 15)).reverse();
  },

  // ---------------------------------------------------------------------------
  //  Full Orchestrated Pipeline
  // ---------------------------------------------------------------------------

  /**
   * Simulate the complete multi-agent pipeline for a newly reported issue.
   * Each agent fires in sequence with staggered delays so the UI can
   * render each step as it happens (600 ms apart).
   *
   * @param {Object} issue    — The issue object (must have .id, .location.address)
   * @param {Object} analysis — Triage result with:
   *   .categoryLabel, .severity (1-5), .confidence (0-1),
   *   .suggestedDept, .impactedPeople,
   *   .bounty? { cost, rewardPoints }
   */
  runFullPipeline: function (issue, analysis) {
    var self = this;
    var r = this.registry;
    var steps = [];
    var issueId = issue.id;

    // Step 1: Orchestrator receives the report
    steps.push({
      delay: 0,
      fn: function () {
        r.orchestrator.route(issueId, 'User Report', 'Triage Agent');
      }
    });

    // Step 2: Triage analyses category + severity
    steps.push({
      delay: 600,
      fn: function () {
        r.triage.analyze(
          issueId,
          analysis.categoryLabel,
          analysis.severity,
          (analysis.confidence * 100).toFixed(0)
        );
      }
    });

    // Step 3: Orchestrator routes to Verification
    steps.push({
      delay: 1200,
      fn: function () {
        r.orchestrator.route(issueId, 'Triage Agent', 'Verification Agent');
      }
    });

    // Step 4: Verification checks authenticity & duplicates
    steps.push({
      delay: 1800,
      fn: function () {
        var dna = CommunityHero.issueDNA
          ? CommunityHero.issueDNA.generate(issue)
          : 'DNA-' +
            Math.random()
              .toString(36)
              .substr(2, 8)
              .toUpperCase();
        var isDuplicate = CommunityHero.issueDNA
          ? CommunityHero.issueDNA.findDuplicates(issue).length > 0
          : false;
        r.verification.verify(issueId, isDuplicate, dna);
      }
    });

    // Step 5: Resolution Agent routes to department & generates plan
    steps.push({
      delay: 2400,
      fn: function () {
        r.resolution.route(issueId, analysis.suggestedDept);
        r.resolution.generatePlan(issueId);
      }
    });

    // Step 6: Bounty Agent — create or skip
    steps.push({
      delay: 3000,
      fn: function () {
        if (analysis.bounty) {
          r.bounty.createBounty(
            issueId,
            analysis.bounty.cost,
            analysis.bounty.rewardPoints
          );
        } else {
          self.log(
            'Bounty',
            'SKIP',
            issueId +
              ' not suitable for community repair — requires municipal authority',
            '#6b7280'
          );
        }
      }
    });

    // Step 7: Prediction Agent — forecast nearby future issues
    steps.push({
      delay: 3600,
      fn: function () {
        r.prediction.predict(
          issue.location.address,
          'Similar issues may emerge within 500m radius in next 2 weeks',
          'medium'
        );
      }
    });

    // Step 8: Escalation check — severity ≥ 4 triggers alert
    steps.push({
      delay: 4200,
      fn: function () {
        if (analysis.severity >= 4) {
          r.escalation.escalate(
            issueId,
            'Severity ' +
              analysis.severity +
              '/5 detected — safety risk for ' +
              analysis.impactedPeople +
              ' citizens'
          );
          if (analysis.severity === 5) {
            r.escalation.generateComplaint(issueId);
          }
        }
      }
    });

    // Step 9: Engagement Agent — positive reinforcement to reporter
    steps.push({
      delay: 4800,
      fn: function () {
        r.engagement.sendNudge(
          'USR-001',
          'Great report! Your ' +
            analysis.categoryLabel +
            ' report helps ' +
            analysis.impactedPeople +
            ' people. Keep it up!'
        );
      }
    });

    // Step 10: Orchestrator wraps up
    steps.push({
      delay: 5400,
      fn: function () {
        self.log(
          'Orchestrator',
          'COMPLETE',
          'Full pipeline complete for ' +
            issueId +
            '. All 8 agents processed. Issue tracked.',
          r.orchestrator.color
        );
      }
    });

    // Fire each step on its scheduled delay
    steps.forEach(function (step) {
      setTimeout(step.fn, step.delay);
    });
  },

  // ---------------------------------------------------------------------------
  //  Boot Sequence — seed realistic initial activity
  // ---------------------------------------------------------------------------

  /**
   * Initialise the agent system with sample activity so the dashboard
   * has content on first render.  Call once on app startup.
   */
  boot: function () {
    var r = this.registry;

    // System-wide boot message
    this.log(
      'Orchestrator',
      'BOOT',
      'All 8 agents initialized. System ready.',
      r.orchestrator.color
    );

    // Prediction Agent — monsoon forecasts
    r.prediction.predict(
      'HSR Layout',
      'Expect 3× waterlogging reports this week due to monsoon forecast',
      'high'
    );
    r.prediction.predict(
      'Koramangala',
      'Road on 80 Feet Rd deteriorating — predicted new pothole in 2 weeks',
      'medium'
    );

    // Engagement Agent — community challenge + welcome nudge
    r.engagement.createChallenge(
      'Monsoon Ready Challenge',
      'Report 50 drainage issues in your ward before July'
    );
    r.engagement.sendNudge(
      'USR-001',
      'Welcome back, Aarna! Your ward Koramangala has 5 new issues this week.'
    );

    // Bounty Agent — dynamic reward adjustment for aging issue
    r.bounty.adjustReward(
      'ISS-001',
      520,
      'Unfixed for 4 days near school zone — risk multiplier 1.15x applied'
    );

    // Escalation Agent — existing critical issue
    r.escalation.escalate(
      'ISS-002',
      'Severity 5 water main burst — 520 citizens impacted, 10,000 litres/hr loss'
    );
    r.escalation.generateComplaint('ISS-002');
  }
};
