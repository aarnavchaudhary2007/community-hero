// ============================================================
// Community Hero — Main Application Orchestrator
// ============================================================
window.CommunityHero = window.CommunityHero || {};

CommunityHero.app = {

  _previousScreen: 'screen-home',
  _charts: {},
  _aiResult: null,

  // ==================== INIT ====================
  init: function () {
    this.setupNavigation();
    this.setupReportForm();
    this.setupFilters();
    this.setupDetailBack();
    this.renderHome();
    this.renderLeaderboard();
    this.renderBadgeGrid();
    this.renderPredictions();
    this.animateStats();
    this.setupBounties();
    this.setupAPIKeyConfig();

    // Init map (delayed to ensure DOM ready)
    var self = this;
    setTimeout(function () {
      if (CommunityHero.map && typeof CommunityHero.map.init === 'function') {
        CommunityHero.map.init();
      }
    }, 300);

    // Init charts (delayed to ensure Chart.js loaded)
    setTimeout(function () { self.initDashboardCharts(); }, 500);

    // Setup insights ward listener and populate initial dashboard stats
    setTimeout(function () {
      self.setupDashboardListener();
      self.updateDashboard('');
    }, 600);

    // Animate XP bar on profile
    setTimeout(function () {
      var xpBar = document.getElementById('user-xp-bar');
      if (xpBar) {
        var progress = CommunityHero.gamification.getLevelProgress(2450);
        xpBar.style.width = (progress.progress * 100).toFixed(0) + '%';
      }
    }, 800);

    // ====== NEW: Boot Agent System ======
    if (CommunityHero.agents && typeof CommunityHero.agents.boot === 'function') {
      setTimeout(function () {
        CommunityHero.agents.boot();
        self.renderAgentHub();
        self.renderActivityFeed();
      }, 400);
    }

    // Listen for agent activity updates
    document.addEventListener('agents:activity', function () {
      self.renderActivityFeed();
    });

    // ====== NEW: Crisis Mode Scan ======
    if (CommunityHero.crisis && typeof CommunityHero.crisis.scan === 'function') {
      setTimeout(function () {
        CommunityHero.crisis.scan();
        self.updateCrisisWidget();
        // Add geofence zones after map is ready
        setTimeout(function () {
          CommunityHero.crisis.addGeofenceZones();
        }, 800);
      }, 600);
    }
  },

  // ==================== NAVIGATION ====================
  setupNavigation: function () {
    var self = this;
    document.querySelectorAll('.ch-nav-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var screen = this.getAttribute('data-screen');
        if (screen) self.switchScreen(screen);
      });
    });
  },

  switchScreen: function (screenId) {
    // Track previous screen for back button
    var current = document.querySelector('.ch-screen.active');
    if (current) this._previousScreen = current.id;

    // Hide all screens
    document.querySelectorAll('.ch-screen').forEach(function (s) {
      s.classList.remove('active');
    });
    // Show target
    var target = document.getElementById(screenId);
    if (target) target.classList.add('active');

    // Update nav
    document.querySelectorAll('.ch-nav-item').forEach(function (item) {
      item.classList.remove('active');
      if (item.getAttribute('data-screen') === screenId) {
        item.classList.add('active');
      }
    });

    // Special handling
    if (screenId === 'screen-map' && CommunityHero.map) {
      CommunityHero.map.invalidateSize();
    }
  },

  // ==================== HOME RENDERING ====================
  renderHome: function () {
    var recent = CommunityHero.data.getRecentIssues(8);
    var container = document.getElementById('recent-issues-container');
    var trending = document.getElementById('trending-container');
    if (!container) return;

    // Recent issues (first 5)
    container.innerHTML = recent.slice(0, 5).map(function (issue, i) {
      return CommunityHero.app._renderIssueCard(issue, i);
    }).join('');

    // Trending (top upvoted)
    if (trending) {
      var topIssues = CommunityHero.data.issues.slice().sort(function (a, b) {
        return b.upvotes - a.upvotes;
      }).slice(0, 3);
      trending.innerHTML = topIssues.map(function (issue, i) {
        return CommunityHero.app._renderIssueCard(issue, i);
      }).join('');
    }
  },

  _renderIssueCard: function (issue, index) {
    var cats = CommunityHero.data.categories;
    var sevs = CommunityHero.data.severityLevels;
    var cat = cats[issue.category] || cats['other'];
    var sev = sevs[issue.severity] || sevs[3];
    var delay = (index || 0) * 0.08;
    return '<div class="ch-issue-card ch-slide-up" style="animation-delay:' + delay + 's" data-id="' + issue.id + '" onclick="CommunityHero.app.showIssueDetail(\'' + issue.id + '\')">' +
      '<div class="ch-issue-card-strip" style="background:' + cat.color + '"></div>' +
      '<div class="ch-issue-card-body">' +
        '<div class="ch-issue-card-header">' +
          '<span class="ch-issue-card-category">' + cat.emoji + ' ' + cat.label + '</span>' +
          '<span class="ch-severity-badge ch-severity-' + issue.severity + '">' + sev.label + '</span>' +
        '</div>' +
        '<h3 class="ch-issue-card-title">' + issue.title + '</h3>' +
        '<p class="ch-issue-card-location">📍 ' + issue.location.address + '</p>' +
        '<div class="ch-issue-card-footer">' +
          '<span class="ch-status-badge ch-status-' + issue.status + '">' + issue.status.replace('-', ' ') + '</span>' +
          '<span class="ch-issue-card-meta">👍 ' + issue.upvotes + ' · 💬 ' + issue.comments + ' · ' + CommunityHero.app.timeAgo(issue.reportedAt) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  },

  // ==================== ISSUE DETAIL ====================
  showIssueDetail: function (issueId) {
    var issue = CommunityHero.data.getIssueById(issueId);
    if (!issue) return;

    var cats = CommunityHero.data.categories;
    var sevs = CommunityHero.data.severityLevels;
    var cat = cats[issue.category] || cats['other'];
    var sev = sevs[issue.severity] || sevs[3];

    var html = '';

    // Header
    html += '<div class="ch-detail-header ch-fade-in">';
    html += '<div class="ch-flex-between ch-mb-sm">';
    html += '<span class="ch-severity-badge ch-severity-' + issue.severity + '">' + sev.label + ' — Severity ' + issue.severity + '/5</span>';
    html += '<span class="ch-status-badge ch-status-' + issue.status + '">' + issue.status.replace('-', ' ') + '</span>';
    html += '</div>';
    html += '<h2 class="ch-detail-title">' + cat.emoji + ' ' + issue.title + '</h2>';
    html += '<p class="ch-detail-desc">' + issue.description + '</p>';
    html += '<p class="ch-text-sm ch-text-muted" style="margin-top:8px">📍 ' + issue.location.address + ' · Reported by ' + issue.reportedBy.avatar + ' ' + issue.reportedBy.name + ' · ' + CommunityHero.app.timeAgo(issue.reportedAt) + '</p>';
    html += '</div>';

    // AI Analysis Card
    html += '<div class="ch-card ch-slide-up" style="animation-delay:0.1s">';
    html += '<div class="ch-ai-title">🤖 AI Analysis</div>';
    html += '<div class="ch-ai-result-grid">';
    html += '<div class="ch-ai-result-item"><div class="ch-ai-result-label">Category</div><div class="ch-ai-result-value">' + cat.emoji + ' ' + cat.label + '</div></div>';
    html += '<div class="ch-ai-result-item"><div class="ch-ai-result-label">Confidence</div><div class="ch-ai-result-value" style="color:var(--accent-emerald)">' + (issue.aiAnalysis.confidence * 100).toFixed(0) + '%</div></div>';
    html += '<div class="ch-ai-result-item"><div class="ch-ai-result-label">Risk Score</div><div class="ch-ai-result-value" style="color:' + sev.color + '">' + issue.aiAnalysis.riskScore + '/10</div></div>';
    html += '<div class="ch-ai-result-item"><div class="ch-ai-result-label">Estimated Size</div><div class="ch-ai-result-value">' + issue.aiAnalysis.estimatedSize + '</div></div>';
    html += '<div class="ch-ai-result-item"><div class="ch-ai-result-label">Impacted People</div><div class="ch-ai-result-value">' + issue.aiAnalysis.impactedPeople.toLocaleString() + '</div></div>';
    html += '<div class="ch-ai-result-item"><div class="ch-ai-result-label">Suggested Dept</div><div class="ch-ai-result-value ch-text-sm">' + issue.aiAnalysis.suggestedDept + '</div></div>';
    html += '</div>';
    html += '<div style="margin-top:12px;padding:10px;background:var(--glass-bg);border-radius:var(--radius-sm);border-left:3px solid var(--accent-purple)">';
    html += '<div class="ch-ai-result-label">Decay Prediction</div>';
    html += '<div class="ch-text-sm" style="color:var(--accent-amber)">' + issue.aiAnalysis.decayPrediction + '</div>';
    html += '</div>';
    html += '</div>';

    // Severity Meter
    html += '<div class="ch-card ch-slide-up" style="animation-delay:0.15s">';
    html += '<div class="ch-flex-between ch-mb-sm"><span class="ch-text-sm">Severity Level</span><span class="ch-severity-badge ch-severity-' + issue.severity + '">' + issue.severity + '/5</span></div>';
    html += '<div class="ch-severity-meter"><div class="ch-severity-meter-fill" style="width:' + (issue.severity * 20) + '%;background:' + sev.color + '"></div></div>';
    html += '</div>';

    // Verifications
    if (issue.verifications.length > 0) {
      html += '<div class="ch-card ch-slide-up" style="animation-delay:0.2s">';
      html += '<div class="ch-section-title" style="margin-top:0;font-size:0.95rem">🛡️ Community Verifications (' + issue.verifications.length + ')</div>';
      issue.verifications.forEach(function (v) {
        html += '<div class="ch-flex-between" style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05)">';
        html += '<span class="ch-text-sm">' + v.name + '</span>';
        html += '<span class="ch-text-sm" style="color:var(--accent-teal)">Staked ' + v.stake + ' pts ✓</span>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Issue DNA card
    if (CommunityHero.issueDNA) {
      var dna = CommunityHero.issueDNA.generate(issue);
      html += '<div class="ch-card ch-slide-up" style="animation-delay:0.22s; border-left: 3px solid var(--accent-teal)">';
      html += '<div class="ch-ai-title" style="color:var(--accent-teal)">🧬 Issue DNA Fingerprint</div>';
      html += '<div class="ch-text-sm" style="font-family:monospace;color:var(--accent-cyan);margin-top:4px">' + dna + '</div>';
      html += '<p class="ch-text-xs ch-text-secondary" style="margin-top:6px">This unique fingerprint is used by the Verification Agent to detect duplicates across the platform.</p>';
      html += '</div>';
    }

    // Action Buttons
    html += '<div class="ch-detail-actions ch-slide-up" style="animation-delay:0.25s">';
    html += '<button class="ch-btn ch-btn-outline ch-btn-sm" onclick="CommunityHero.app._verifyIssue(\'' + issue.id + '\')">🛡️ Verify (Stake 15 pts)</button>';
    html += '<button class="ch-btn ch-btn-outline ch-btn-sm" onclick="CommunityHero.app._upvoteIssue(\'' + issue.id + '\')">👍 Upvote (' + issue.upvotes + ')</button>';
    
    if (issue.bounty) {
      html += '<button class="ch-btn ch-btn-primary ch-btn-sm" onclick="CommunityHero.app.switchScreen(\'screen-bounties\')">💰 View Bounty Marketplace</button>';
    }
    
    // Escalation button for severe issues
    if (issue.severity >= 4 && CommunityHero.crisis) {
      html += '<button class="ch-btn ch-btn-danger ch-btn-sm" onclick="CommunityHero.app._generateComplaint(\'' + issue.id + '\')">🚨 Generate Formal Complaint</button>';
    }
    
    html += '<button class="ch-btn ch-btn-icon" title="Share">📤</button>';
    html += '<button class="ch-btn ch-btn-icon" title="Flag">🚩</button>';
    html += '</div>';

    // Timeline
    html += '<div class="ch-card ch-slide-up" style="animation-delay:0.3s">';
    html += '<div class="ch-section-title" style="margin-top:0;font-size:0.95rem">📋 Issue Timeline</div>';
    html += '<div class="ch-timeline">';
    issue.timeline.forEach(function (t) {
      var dotClass = 'ch-dot-' + t.event.replace(/[^a-z-]/g, '');
      html += '<div class="ch-timeline-item">';
      html += '<div class="ch-timeline-dot ' + dotClass + '"></div>';
      html += '<div class="ch-timeline-content">';
      html += '<span class="ch-timeline-time">' + CommunityHero.app._formatDate(t.timestamp) + '</span>';
      html += '<strong>' + t.actor + '</strong>';
      html += '<p>' + t.detail + '</p>';
      html += '</div></div>';
    });
    html += '</div></div>';

    document.getElementById('detail-container').innerHTML = html;
    this.switchScreen('screen-detail');
  },

  _verifyIssue: function (issueId) {
    this.showToast('🛡️ +30 XP! Issue verified. 15 trust points staked.', 'success');
    var result = CommunityHero.gamification.addXP('USR-001', 'verify-issue');
    if (result && result.leveledUp) {
      setTimeout(function () {
        CommunityHero.app.showToast('🎉 LEVEL UP! You reached Level ' + result.newLevel + '!', 'info');
      }, 1500);
    }
  },

  _upvoteIssue: function (issueId) {
    var issue = CommunityHero.data.getIssueById(issueId);
    if (issue) issue.upvotes++;
    this.showToast('👍 +5 XP! Upvote recorded.', 'success');
    CommunityHero.gamification.addXP('USR-001', 'community-upvote');
  },

  // ==================== REPORT FORM ====================
  setupReportForm: function () {
    var self = this;
    var uploadZone = document.getElementById('report-image-upload');
    var fileInput = document.getElementById('report-file-input');
    var submitBtn = document.getElementById('report-submit-btn');

    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', function () { fileInput.click(); });
    uploadZone.addEventListener('dragover', function (e) { e.preventDefault(); this.classList.add('active'); });
    uploadZone.addEventListener('dragleave', function () { this.classList.remove('active'); });
    uploadZone.addEventListener('drop', function (e) {
      e.preventDefault(); this.classList.remove('active');
      if (e.dataTransfer.files.length) { fileInput.files = e.dataTransfer.files; fileInput.dispatchEvent(new Event('change')); }
    });

    fileInput.addEventListener('change', function () {
      if (!this.files || !this.files[0]) return;
      var file = this.files[0];

      // Show preview
      var preview = document.getElementById('report-image-preview');
      preview.classList.remove('ch-hidden');
      var reader = new FileReader();
      reader.onload = function (e) {
        preview.innerHTML = '<img src="' + e.target.result + '" alt="Issue photo">';
      };
      reader.readAsDataURL(file);

      // Hide upload zone
      uploadZone.classList.add('ch-hidden');

      // Start AI analysis
      self._runAIAnalysis(file);
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', function () { self._submitReport(); });
    }

    // Copy button for the auto-generated formal municipal application
    var copyBtn = document.getElementById('copy-report-letter-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var preview = document.getElementById('report-formal-letter-preview');
        if (preview && preview.textContent) {
          navigator.clipboard.writeText(preview.textContent).then(function () {
            self.showToast('📋 Formal application copied to clipboard!', 'success');
          });
        }
      });
    }

    // Listen for AI events
    document.addEventListener('ai:started', function (e) {
      document.getElementById('ai-status-text').textContent = e.detail.message;
      document.getElementById('ai-progress-bar').style.width = '0%';
    });
    document.addEventListener('ai:scanning', function (e) {
      document.getElementById('ai-status-text').textContent = e.detail.message;
      document.getElementById('ai-progress-bar').style.width = '25%';
    });
    document.addEventListener('ai:detecting', function (e) {
      document.getElementById('ai-status-text').textContent = e.detail.message;
      document.getElementById('ai-progress-bar').style.width = '50%';
    });
    document.addEventListener('ai:classifying', function (e) {
      document.getElementById('ai-status-text').textContent = e.detail.message;
      document.getElementById('ai-progress-bar').style.width = '75%';
    });
    document.addEventListener('ai:complete', function (e) {
      document.getElementById('ai-status-text').textContent = e.detail.message;
      document.getElementById('ai-progress-bar').style.width = '100%';
    });
  },

  _runAIAnalysis: function (file) {
    var overlay = document.getElementById('ai-analysis-overlay');
    var results = document.getElementById('ai-results');
    overlay.classList.remove('ch-hidden');
    results.style.display = 'none';

    var self = this;
    CommunityHero.ai.analyzeImage(file).then(function (analysis) {
      self._aiResult = analysis;
      var sevs = CommunityHero.data.severityLevels;
      var sev = sevs[analysis.severity];

      // Show results
      results.style.display = 'grid';
      document.getElementById('ai-category-result').textContent = analysis.categoryEmoji + ' ' + analysis.categoryLabel;
      document.getElementById('ai-confidence-result').textContent = (analysis.confidence * 100).toFixed(0) + '%';
      document.getElementById('ai-confidence-result').style.color = 'var(--accent-emerald)';
      document.getElementById('ai-severity-result').textContent = analysis.severity + '/5 — ' + sev.label;
      document.getElementById('ai-severity-result').style.color = sev.color;
      document.getElementById('ai-severity-bar').style.width = (analysis.severity * 20) + '%';
      document.getElementById('ai-severity-bar').style.background = sev.color;
      document.getElementById('ai-risk-result').textContent = analysis.riskScore + '/10';
      document.getElementById('ai-risk-result').style.color = parseFloat(analysis.riskScore) > 7 ? 'var(--accent-coral)' : 'var(--accent-amber)';
      document.getElementById('ai-impact-result').textContent = analysis.impactedPeople.toLocaleString() + ' people';
      document.getElementById('ai-dept-result').textContent = analysis.suggestedDept;

      // Agentic Automation: Auto-generate description in textarea
      var desc = document.getElementById('report-description');
      var loc = document.getElementById('report-location').value || 'Connaught Place, New Delhi';
      
      var autoDesc = analysis.categoryLabel + ' detected near ' + loc.split(',')[0] + '. ' +
        'Triage Agent assessed severity at ' + analysis.severity + '/5 (' + sev.label + ') with ' + (analysis.confidence * 100).toFixed(0) + '% confidence. ' +
        'Impacted population estimated at ' + analysis.impactedPeople.toLocaleString('en-IN') + ' citizens. ' +
        'Decay Forecast: ' + analysis.decayPrediction;
      
      if (desc) {
        desc.value = autoDesc;
      }

      // Agentic Automation: Suggest Delhi authorities to tag
      var tagsContainer = document.getElementById('report-suggested-tags');
      if (tagsContainer) {
        tagsContainer.innerHTML = '<span class="ch-tag ch-tag-authority">🏢 ' + analysis.suggestedDept + '</span>' +
          '<span class="ch-tag ch-tag-authority">🚨 Delhi Civic Command Center</span>' +
          (analysis.severity >= 4 ? '<span class="ch-tag ch-tag-authority" style="color:var(--accent-coral);background:rgba(220,38,38,0.1);border-color:rgba(220,38,38,0.2)">🚨 Zonal Commissioner</span>' : '');
      }

      // Agentic Automation: Draft formal municipal complaint letter via Escalation Agent
      var letterDraft = '';
      if (CommunityHero.crisis && typeof CommunityHero.crisis.generateComplaintDraft === 'function') {
        letterDraft = CommunityHero.crisis.generateComplaintDraft(analysis, loc, autoDesc);
      } else {
        letterDraft = 'Failed to generate Delhi municipal application draft.';
      }

      var letterPreview = document.getElementById('report-formal-letter-preview');
      if (letterPreview) {
        letterPreview.textContent = letterDraft;
      }

      // Show the Automation Card
      var automationCard = document.getElementById('report-ai-automation-card');
      if (automationCard) {
        automationCard.classList.remove('ch-hidden');
      }

    }).catch(function (error) {
      console.error("Live AI Analysis failed:", error);
      
      // Hide loader overlay, show error, then fall back
      overlay.classList.add('ch-hidden');
      
      self.showToast('⚠️ Live Gemini API call failed. Check your API key or connection.', 'warning');
      self.showToast('🤖 Falling back to local Simulation Mode...', 'info');
      
      // Run fallback
      self._runAIAnalysisFallback(file);
    });
  },

  _runAIAnalysisFallback: function (file) {
    var overlay = document.getElementById('ai-analysis-overlay');
    var results = document.getElementById('ai-results');
    overlay.classList.remove('ch-hidden');
    results.style.display = 'none';

    var statusText = document.getElementById('ai-status-text');
    if (statusText) statusText.textContent = 'Simulation Mode: Analyzing local report assets...';

    var self = this;
    CommunityHero.ai.analyzeImage(file, true).then(function (analysis) {
      self._aiResult = analysis;
      var sevs = CommunityHero.data.severityLevels;
      var sev = sevs[analysis.severity];

      // Show results
      results.style.display = 'grid';
      document.getElementById('ai-category-result').textContent = analysis.categoryEmoji + ' ' + analysis.categoryLabel;
      document.getElementById('ai-confidence-result').textContent = (analysis.confidence * 100).toFixed(0) + '%';
      document.getElementById('ai-confidence-result').style.color = 'var(--accent-emerald)';
      document.getElementById('ai-severity-result').textContent = analysis.severity + '/5 — ' + sev.label;
      document.getElementById('ai-severity-result').style.color = sev.color;
      document.getElementById('ai-severity-bar').style.width = (analysis.severity * 20) + '%';
      document.getElementById('ai-severity-bar').style.background = sev.color;
      document.getElementById('ai-risk-result').textContent = analysis.riskScore + '/10';
      document.getElementById('ai-risk-result').style.color = parseFloat(analysis.riskScore) > 7 ? 'var(--accent-coral)' : 'var(--accent-amber)';
      document.getElementById('ai-impact-result').textContent = analysis.impactedPeople.toLocaleString() + ' people';
      document.getElementById('ai-dept-result').textContent = analysis.suggestedDept;

      // Agentic Automation: Auto-generate description in textarea
      var desc = document.getElementById('report-description');
      var loc = document.getElementById('report-location').value || 'Connaught Place, New Delhi';
      
      var autoDesc = analysis.categoryLabel + ' detected near ' + loc.split(',')[0] + '. ' +
        'Triage Agent assessed severity at ' + analysis.severity + '/5 (' + sev.label + ') with ' + (analysis.confidence * 100).toFixed(0) + '% confidence. ' +
        'Impacted population estimated at ' + analysis.impactedPeople.toLocaleString('en-IN') + ' citizens. ' +
        'Decay Forecast: ' + analysis.decayPrediction;
      
      if (desc) {
        desc.value = autoDesc;
      }

      // Agentic Automation: Suggest Delhi authorities to tag
      var tagsContainer = document.getElementById('report-suggested-tags');
      if (tagsContainer) {
        tagsContainer.innerHTML = '<span class="ch-tag ch-tag-authority">🏢 ' + analysis.suggestedDept + '</span>' +
          '<span class="ch-tag ch-tag-authority">🚨 Delhi Civic Command Center</span>' +
          (analysis.severity >= 4 ? '<span class="ch-tag ch-tag-authority" style="color:var(--accent-coral);background:rgba(220,38,38,0.1);border-color:rgba(220,38,38,0.2)">🚨 Zonal Commissioner</span>' : '');
      }

      // Agentic Automation: Draft formal municipal complaint letter via Escalation Agent
      var letterDraft = '';
      if (CommunityHero.crisis && typeof CommunityHero.crisis.generateComplaintDraft === 'function') {
        letterDraft = CommunityHero.crisis.generateComplaintDraft(analysis, loc, autoDesc);
      } else {
        letterDraft = 'Failed to generate Delhi municipal application draft.';
      }

      var letterPreview = document.getElementById('report-formal-letter-preview');
      if (letterPreview) {
        letterPreview.textContent = letterDraft;
      }

      // Show the Automation Card
      var automationCard = document.getElementById('report-ai-automation-card');
      if (automationCard) {
        automationCard.classList.remove('ch-hidden');
      }

    }).catch(function (err) {
      console.error("Simulation fallback failed:", err);
      overlay.classList.add('ch-hidden');
      self.showToast('❌ Critical Error: Could not run AI simulation.', 'danger');
    });
  },

  _submitReport: function () {
    if (!this._aiResult) {
      this.showToast('📷 Please upload an image first!', 'warning');
      return;
    }

    var analysis = this._aiResult;
    var location = document.getElementById('report-location').value || 'Connaught Place, New Delhi';
    var description = document.getElementById('report-description').value;

    // Dynamically map location to nearest Delhi ward
    var wardId = 'connaught-place'; // default
    var locLower = location.toLowerCase();
    CommunityHero.data.wards.forEach(function (w) {
      if (locLower.indexOf(w.name.toLowerCase()) !== -1) {
        wardId = w.id;
      }
    });

    var ward = CommunityHero.data.wards.find(function (w) { return w.id === wardId; });
    var lat = ward ? ward.lat + (Math.random() - 0.5) * 0.015 : 28.6139 + (Math.random() - 0.5) * 0.03;
    var lng = ward ? ward.lng + (Math.random() - 0.5) * 0.015 : 77.2090 + (Math.random() - 0.5) * 0.03;

    // Create new issue
    var newIssue = {
      id: 'ISS-' + (CommunityHero.data.issues.length + 1).toString().padStart(3, '0'),
      title: CommunityHero.ai.generateReportTitle(analysis.category, location),
      description: description,
      category: analysis.category,
      severity: analysis.severity,
      status: 'open',
      location: { lat: lat, lng: lng, address: location, ward: wardId },
      reportedBy: { id: 'USR-001', name: 'Aarna Sharma', avatar: '👩‍💻', trustScore: 847 },
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiAnalysis: { category: analysis.category, confidence: analysis.confidence, severity: analysis.severity, riskScore: parseFloat(analysis.riskScore), estimatedSize: analysis.estimatedSize, impactedPeople: analysis.impactedPeople, suggestedDept: analysis.suggestedDept, decayPrediction: analysis.decayPrediction },
      bounty: analysis.bounty, // Attach AI estimated micro-bounty!
      verifications: [],
      timeline: [
        { event: 'reported', timestamp: new Date().toISOString(), actor: 'Aarna Sharma', detail: 'Issue reported with photo evidence' },
        { event: 'ai-analyzed', timestamp: new Date().toISOString(), actor: 'AI Engine', detail: 'Classified as ' + analysis.categoryLabel + ' (' + (analysis.confidence * 100).toFixed(0) + '% confidence), Severity ' + analysis.severity + '/5' },
        { event: 'routed', timestamp: new Date().toISOString(), actor: 'AI Engine', detail: 'Auto-routed to ' + analysis.suggestedDept }
      ],
      upvotes: 0, comments: 0
    };

    if (analysis.bounty) {
      newIssue.timeline.push({
        event: 'bounty-created',
        timestamp: new Date().toISOString(),
        actor: 'Bounty Agent',
        detail: 'Autonomously estimated repair materials, labor, and posted a Micro-Bounty for ₹' + analysis.bounty.cost + ' (Reward: ' + analysis.bounty.rewardPoints + ' Hero Points)'
      });
      
      // Print to simulated bounty agent console
      var consoleEl = document.getElementById('bounty-agent-console');
      if (consoleEl) {
        consoleEl.innerHTML = '<span style="color:var(--accent-purple)">[Bounty Agent]</span> New issue ' + newIssue.id + ' (' + analysis.categoryLabel + ') analyzed.<br>' +
          '<span style="color:var(--accent-teal)">[Cost Estimation]</span> Calculated material + labor at ₹' + analysis.bounty.cost + '.<br>' +
          '<span style="color:var(--accent-amber)">[Reward Allocation]</span> Posted active community bounty with ' + analysis.bounty.rewardPoints + ' Hero Points reward!';
      }
    }

    CommunityHero.data.issues.unshift(newIssue);

    // ====== NEW: Issue DNA Duplicate Check ======
    if (CommunityHero.issueDNA) {
      var duplicates = CommunityHero.issueDNA.findDuplicates(newIssue);
      if (duplicates.length > 0) {
        var overlayContainer = document.getElementById('dna-overlay-container');
        if (overlayContainer) {
          overlayContainer.innerHTML = CommunityHero.issueDNA.buildDuplicateOverlayHTML(newIssue, duplicates);
          overlayContainer.classList.remove('ch-hidden');
        }
      }
    }

    // ====== NEW: Run Full Agent Pipeline ======
    if (CommunityHero.agents && typeof CommunityHero.agents.runFullPipeline === 'function') {
      CommunityHero.agents.runFullPipeline(newIssue, analysis);
    }

    // ====== NEW: Re-scan Crisis Mode ======
    if (CommunityHero.crisis && typeof CommunityHero.crisis.scan === 'function') {
      var self2 = this;
      setTimeout(function () {
        CommunityHero.crisis.scan();
        self2.updateCrisisWidget();
        CommunityHero.crisis.addGeofenceZones();
      }, 500);
    }

    // ====== NEW: Dynamic Map Integration ======
    if (CommunityHero.map && typeof CommunityHero.map.addNewIssueMarker === 'function') {
      CommunityHero.map.addNewIssueMarker(newIssue);
      
      // Fly to the new issue on the map!
      var selfMap = this;
      this.switchScreen('screen-map');
      setTimeout(function () {
        CommunityHero.map.flyToIssue(newIssue.id);
      }, 300);
    }

    // Reset form
    this._aiResult = null;
    document.getElementById('report-image-upload').classList.remove('ch-hidden');
    document.getElementById('report-image-preview').classList.add('ch-hidden');
    document.getElementById('report-image-preview').innerHTML = '';
    document.getElementById('ai-analysis-overlay').classList.add('ch-hidden');
    document.getElementById('report-description').value = '';
    document.getElementById('report-file-input').value = '';
    
    var automationCard = document.getElementById('report-ai-automation-card');
    if (automationCard) {
      automationCard.classList.add('ch-hidden');
    }

    // XP
    var xpResult = CommunityHero.gamification.addXP('USR-001', 'report-issue');
    this.showToast('🚀 Report submitted! Delhi authorities tagged and formal complaint drafted.', 'success');
    if (xpResult && xpResult.leveledUp) {
      var self = this;
      setTimeout(function () { self.showToast('🎉 LEVEL UP! Level ' + xpResult.newLevel + '!', 'info'); }, 1500);
    }

    // Refresh everything
    this.renderHome();
    this.renderBounties();
    
    // Refresh real-time dashboard instantly
    var selector = document.getElementById('ward-selector');
    var currentWard = selector ? selector.value : '';
    this.updateDashboard(currentWard);
  },

  // ==================== FILTERS ====================
  setupFilters: function () {
    var catFilter = document.getElementById('map-filter-category');
    var sevFilter = document.getElementById('map-filter-severity');
    if (catFilter) {
      catFilter.addEventListener('change', function () {
        CommunityHero.map.filterByCategory(this.value);
      });
    }
    if (sevFilter) {
      sevFilter.addEventListener('change', function () {
        CommunityHero.map.filterBySeverity(this.value);
      });
    }
  },

  // ==================== DETAIL BACK ====================
  setupDetailBack: function () {
    var self = this;
    var btn = document.getElementById('detail-back-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        self.switchScreen(self._previousScreen);
      });
    }
  },

  // ==================== CHARTS ====================
  initDashboardCharts: function () {
    if (typeof Chart === 'undefined') { setTimeout(this.initDashboardCharts.bind(this), 500); return; }

    var data = CommunityHero.data.analytics;
    var cats = CommunityHero.data.categories;

    // Global defaults
    Chart.defaults.color = '#9ca3af';
    Chart.defaults.font.family = 'Inter';

    // 1. Resolution Trend (line)
    var ctx1 = document.getElementById('chart-resolution');
    if (ctx1) {
      var gradient = ctx1.getContext('2d').createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, 'rgba(6,214,160,0.3)');
      gradient.addColorStop(1, 'rgba(6,214,160,0)');
      this._charts.resolution = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: data.monthLabels,
          datasets: [{ label: 'Resolution %', data: data.resolutionRates, borderColor: '#06d6a0', backgroundColor: gradient, fill: true, tension: 0.4, pointBackgroundColor: '#06d6a0', pointRadius: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, min: 50, max: 100 }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }
      });
    }

    // 2. Categories (doughnut)
    var ctx2 = document.getElementById('chart-categories');
    if (ctx2) {
      var catLabels = Object.keys(data.categoryBreakdown);
      var catValues = Object.values(data.categoryBreakdown);
      var catColors = catLabels.map(function (c) { return (cats[c] || cats['other']).color; });
      this._charts.categories = new Chart(ctx2, {
        type: 'doughnut',
        data: { labels: catLabels.map(function(c){ return (cats[c]||cats['other']).label; }), datasets: [{ data: catValues, backgroundColor: catColors, borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { padding: 8, usePointStyle: true, pointStyleWidth: 8, font: { size: 10 } } } } }
      });
    }

    // 3. Monthly Trend (bar)
    var ctx3 = document.getElementById('chart-trend');
    if (ctx3) {
      this._charts.trend = new Chart(ctx3, {
        type: 'bar',
        data: { labels: data.monthLabels, datasets: [{ label: 'Issues', data: data.monthlyTrend, backgroundColor: 'rgba(17,138,178,0.7)', borderRadius: 6, borderSkipped: false }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }
      });
    }

    // 4. Ward Comparison (horizontal bar)
    var ctx4 = document.getElementById('chart-ward-comparison');
    if (ctx4) {
      var wardLabels = data.wardComparison.map(function (w) { return w.ward; });
      var reported = data.wardComparison.map(function (w) { return w.reported; });
      var resolved = data.wardComparison.map(function (w) { return w.resolved; });
      this._charts.wardComparison = new Chart(ctx4, {
        type: 'bar',
        data: { labels: wardLabels, datasets: [
          { label: 'Reported', data: reported, backgroundColor: 'rgba(239,71,111,0.6)', borderRadius: 4, borderSkipped: false },
          { label: 'Resolved', data: resolved, backgroundColor: 'rgba(6,214,160,0.6)', borderRadius: 4, borderSkipped: false }
        ] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' } }, y: { grid: { display: false } } }, plugins: { legend: { labels: { padding: 12, usePointStyle: true, font: { size: 11 } } } } }
      });
    }
  },

  // ==================== PREDICTIONS ====================
  renderPredictions: function () {
    var container = document.getElementById('predictions-container');
    if (!container) return;
    var predictions = CommunityHero.data.analytics.predictions;
    var cats = CommunityHero.data.categories;

    // Build grid of detailed prediction cards
    container.innerHTML = '<div class="ch-predictions-grid-detailed">' +
      predictions.map(function (p) {
        var cat = cats[p.category] || cats['other'];
        var riskColor = p.severity === 'high' ? 'var(--accent-coral)' : p.severity === 'medium' ? 'var(--accent-amber)' : 'var(--accent-emerald)';
        var riskGlow = p.severity === 'high' ? 'rgba(239, 71, 111, 0.15)' : p.severity === 'medium' ? 'rgba(255, 209, 102, 0.15)' : 'rgba(6, 214, 160, 0.15)';
        
        return '<div class="ch-prediction-card-detailed" style="--risk-color:' + riskColor + '; --risk-glow:' + riskGlow + '">' +
          '<div class="ch-prediction-detailed-header">' +
            '<div class="ch-prediction-detailed-icon">' + cat.emoji + '</div>' +
            '<div class="ch-prediction-detailed-title-wrap">' +
              '<div class="ch-prediction-detailed-area">📍 ' + p.area + '</div>' +
              '<div class="ch-prediction-detailed-text">' + p.prediction + '</div>' +
            '</div>' +
            '<span class="ch-prediction-urgency-badge ch-urgency-' + p.severity + '">' + p.severity + '</span>' +
          '</div>' +
          
          '<div class="ch-prediction-confidence-wrapper">' +
            '<div class="ch-prediction-confidence-text">' +
              '<span>AI Confidence</span>' +
              '<strong>' + p.confidence + '%</strong>' +
            '</div>' +
            '<div class="ch-prediction-confidence-bar">' +
              '<div class="ch-prediction-confidence-fill" style="width:' + p.confidence + '%"></div>' +
            '</div>' +
          '</div>' +

          '<div class="ch-prediction-meta-row">' +
            '<span class="ch-prediction-timeframe">⏱️ ' + p.timeframe + '</span>' +
          '</div>' +

          '<div class="ch-prediction-mitigation">' +
            '<strong>⚡ Recommended Mitigation Plan:</strong>' +
            p.mitigation +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  },

  // ==================== REAL-TIME INSIGHTS ORCHESTRATION ====================
  setupDashboardListener: function () {
    var self = this;
    var selector = document.getElementById('ward-selector');
    if (selector) {
      selector.addEventListener('change', function () {
        self.updateDashboard(this.value);
      });
    }
  },

  updateDashboard: function (wardId) {
    var self = this;
    var issues = CommunityHero.data.issues;
    
    // Find ward name
    var wardName = "All Wards";
    if (wardId) {
      var wardObj = CommunityHero.data.wards.find(function(w){ return w.id === wardId; });
      if (wardObj) wardName = wardObj.name;
    }

    // 1. Calculate Real-Time Stats (proportional scaling of historical bases + user reports)
    var wardBases = {
      'connaught-place': { total: 47, resolved: 34, avgTime: 3.8 },
      'karol-bagh':      { total: 38, resolved: 30, avgTime: 4.1 },
      'saket':           { total: 52, resolved: 35, avgTime: 4.3 },
      'dwarka':          { total: 55, resolved: 38, avgTime: 4.5 },
      'vasant-kunj':     { total: 41, resolved: 28, avgTime: 4.2 },
      'chandni-chowk':   { total: 29, resolved: 21, avgTime: 4.6 },
      'rajouri-garden':  { total: 33, resolved: 23, avgTime: 4.4 },
      'greater-kailash': { total: 44, resolved: 32, avgTime: 3.9 },
      'lajpat-nagar':    { total: 36, resolved: 25, avgTime: 4.2 },
      'mayur-vihar':     { total: 22, resolved: 15, avgTime: 4.8 }
    };

    var baseTotal = 0;
    var baseResolved = 0;
    var avgTimeSum = 0;
    var wardsCounted = 0;

    if (wardId) {
      var base = wardBases[wardId] || { total: 15, resolved: 10, avgTime: 4.5 };
      var activeInWard = issues.filter(function(i) { return i.location.ward === wardId; });
      
      // Count newly reported and resolved issues that aren't in the preset base (e.g. submitted during session)
      var newReported = activeInWard.filter(function(i) { return parseInt(i.id.split('-')[1]) > 20; }).length;
      var newResolved = activeInWard.filter(function(i) { return i.status === 'resolved' && parseInt(i.id.split('-')[1]) > 20; }).length;

      baseTotal = base.total + newReported;
      baseResolved = base.resolved + newResolved;
      avgTimeSum = base.avgTime;
      wardsCounted = 1;
    } else {
      // Sum all bases
      for (var k in wardBases) {
        baseTotal += wardBases[k].total;
        baseResolved += wardBases[k].resolved;
        avgTimeSum += wardBases[k].avgTime;
        wardsCounted++;
      }
      var newReported = issues.filter(function(i) { return parseInt(i.id.split('-')[1]) > 20; }).length;
      var newResolved = issues.filter(function(i) { return i.status === 'resolved' && parseInt(i.id.split('-')[1]) > 20; }).length;

      baseTotal += newReported;
      baseResolved += newResolved;
    }

    var resolutionRate = baseTotal > 0 ? Math.round((baseResolved / baseTotal) * 100) : 0;
    var avgTime = wardsCounted > 0 ? (avgTimeSum / wardsCounted) : 4.2;
    
    // Adjust average resolution time based on newly resolved issues (real-time feedback!)
    var activeIssues = wardId ? issues.filter(function(i){ return i.location.ward === wardId; }) : issues;
    var sessionResolved = activeIssues.filter(function(i){ return i.status === 'resolved' && parseInt(i.id.split('-')[1]) > 20; });
    if (sessionResolved.length > 0) {
      // Shave off some days to show positive impact of user self-repair!
      avgTime = Math.max(1.5, avgTime - (sessionResolved.length * 0.4));
    }
    
    // Predicted count: count high/medium risk predictions for this ward
    var predictions = CommunityHero.data.analytics.predictions;
    var predictedCount = predictions.filter(function(p) {
      return (!wardId || p.area.toLowerCase() === wardName.toLowerCase()) && p.severity !== 'low';
    }).length * 3 + 2;

    // 2. Animate Stat Cards in Real-time using existing Count-up helper
    var elTotal = document.getElementById('dash-stat-total');
    var elRate = document.getElementById('dash-stat-rate');
    var elTime = document.getElementById('dash-stat-time');
    var elPredicted = document.getElementById('dash-stat-predicted');

    if (elTotal) {
      var startTotal = parseInt(elTotal.textContent) || 0;
      this._countUp('dash-stat-total', startTotal, baseTotal, 800);
    }
    if (elRate) {
      var startRate = parseInt(elRate.textContent) || 0;
      this._countUpWithSuffix('dash-stat-rate', startRate, resolutionRate, '%', 800);
    }
    if (elTime) {
      var startTime = parseFloat(elTime.textContent) || 0;
      this._countUpFloatWithSuffix('dash-stat-time', startTime, avgTime, 'd', 800);
    }
    if (elPredicted) {
      var startPredicted = parseInt(elPredicted.textContent) || 0;
      this._countUp('dash-stat-predicted', startPredicted, predictedCount, 800);
    }

    // 3. Update Chart.js Instances in Real-time
    // Resolution Trend (Line)
    if (this._charts.resolution) {
      var resChart = this._charts.resolution;
      var trend = [
        Math.max(50, resolutionRate - 10),
        Math.max(50, resolutionRate - 7),
        Math.max(50, resolutionRate - 3),
        Math.max(50, resolutionRate - 5),
        Math.max(50, resolutionRate - 1),
        resolutionRate
      ];
      resChart.data.datasets[0].data = trend;
      resChart.update();
    }

    // Issues by Category (Doughnut)
    if (this._charts.categories) {
      var catChart = this._charts.categories;
      var catCounts = { pothole: 0, 'water-leak': 0, streetlight: 0, waste: 0, 'road-damage': 0, drainage: 0, other: 0 };
      
      activeIssues.forEach(function (i) {
        if (catCounts[i.category] !== undefined) catCounts[i.category]++;
        else catCounts['other']++;
      });

      // Add proportional baseline noise to make charts rich
      var noiseMultiplier = wardId ? 1.2 : 4.5;
      for (var cat in catCounts) {
        catCounts[cat] += Math.round((Math.random() * 3 + 1) * noiseMultiplier);
      }

      catChart.data.datasets[0].data = Object.values(catCounts);
      catChart.update();
    }

    // Monthly Reports (Bar)
    if (this._charts.trend) {
      var trendChart = this._charts.trend;
      var scale = baseTotal / 120; // scale relative to all-ward baseline
      trendChart.data.datasets[0].data = [
        Math.round(42 * scale) + 2,
        Math.round(38 * scale) + 1,
        Math.round(55 * scale) + 3,
        Math.round(61 * scale) + 4,
        Math.round(48 * scale) + 2,
        baseTotal
      ];
      trendChart.update();
    }

    // Ward Comparison (Horizontal Bar with Highlight!)
    if (this._charts.wardComparison) {
      var compChart = this._charts.wardComparison;
      var compLabels = compChart.data.labels;
      var bgReported = [];
      var bgResolved = [];

      compLabels.forEach(function (label) {
        // Match label (e.g., "Connaught Place") with selected wardName
        var isSelected = wardId && (label.toLowerCase() === wardName.toLowerCase());
        if (isSelected) {
          bgReported.push('rgba(239, 71, 111, 1.0)'); // Glowing Solid Coral for reported
          bgResolved.push('rgba(6, 214, 160, 1.0)');  // Glowing Solid Emerald for resolved
        } else {
          bgReported.push(wardId ? 'rgba(239, 71, 111, 0.18)' : 'rgba(239, 71, 111, 0.6)'); // Translucent if other selected
          bgResolved.push(wardId ? 'rgba(6, 214, 160, 0.18)' : 'rgba(6, 214, 160, 0.6)');
        }
      });

      compChart.data.datasets[0].backgroundColor = bgReported;
      compChart.data.datasets[1].backgroundColor = bgResolved;
      compChart.update();
    }

    // 4. Generate AI Ward Health Audit Scorecard
    this.renderWardHealthAudit(wardId, wardName, baseTotal, resolutionRate, activeIssues);
  },

  // Helper for float count ups
  _countUpFloatWithSuffix: function (elementId, start, end, suffix, duration) {
    var el = document.getElementById(elementId);
    if (!el) return;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = (start + (end - start) * eased).toFixed(1);
      el.textContent = value + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  },

  // Helper for suffix count ups
  _countUpWithSuffix: function (elementId, start, end, suffix, duration) {
    var el = document.getElementById(elementId);
    if (!el) return;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(start + (end - start) * eased);
      el.textContent = value + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  },

  // ==================== AI WARD HEALTH AUDIT SCORECARD ====================
  renderWardHealthAudit: function (wardId, wardName, totalIssues, resolutionRate, activeIssues) {
    var container = document.getElementById('dashboard-health-audit');
    if (!container) return;

    // Count emergencies (severity 5) and critical (severity 4) issues that are active
    var activeUnresolved = activeIssues.filter(function(i){ return i.status !== 'resolved'; });
    var emergencies = activeUnresolved.filter(function(i){ return i.severity === 5; }).length;
    var critical = activeUnresolved.filter(function(i){ return i.severity === 4; }).length;

    // Calculate Grade
    var grade = 'F';
    var gradeColor = 'var(--accent-coral)';
    var gradeGradient = 'linear-gradient(135deg, var(--accent-coral), #dc2626)';
    var gradeGlow = 'rgba(239, 71, 111, 0.35)';
    var gradeValText = 'Critical Risk';

    if (resolutionRate >= 85 && emergencies === 0 && critical === 0) {
      grade = 'A';
      gradeColor = 'var(--accent-emerald)';
      gradeGradient = 'linear-gradient(135deg, var(--accent-emerald), #059669)';
      gradeGlow = 'rgba(6, 214, 160, 0.35)';
      gradeValText = 'Excellent Health';
    } else if (resolutionRate >= 72 && emergencies === 0) {
      grade = 'B';
      gradeColor = 'var(--accent-teal)';
      gradeGradient = 'linear-gradient(135deg, var(--accent-teal), #0284c7)';
      gradeGlow = 'rgba(17, 138, 178, 0.3)';
      gradeValText = 'Good Standing';
    } else if (resolutionRate >= 60 && emergencies <= 1) {
      grade = 'C';
      gradeColor = 'var(--accent-amber)';
      gradeGradient = 'linear-gradient(135deg, var(--accent-amber), #d97706)';
      gradeGlow = 'rgba(255, 209, 102, 0.3)';
      gradeValText = 'Moderate Health';
    } else if (resolutionRate >= 45 && emergencies <= 2) {
      grade = 'D';
      gradeColor = 'var(--accent-purple)';
      gradeGradient = 'linear-gradient(135deg, var(--accent-purple), #7c3aed)';
      gradeGlow = 'rgba(139, 92, 246, 0.3)';
      gradeValText = 'Needs Attention';
    }

    // Generate dynamic citizen-friendly bullet summaries
    var bullet1 = '';
    var bullet2 = '';
    var bullet3 = '';

    // Bullet 1: Resolution Rate and fixed issues
    var resolvedCount = activeIssues.filter(function(i){ return i.status === 'resolved'; }).length;
    if (grade === 'A' || grade === 'B') {
      bullet1 = '🟢 <strong>Strong Fix Output</strong>: ' + wardName + ' maintains a high <strong>' + resolutionRate + '% resolution rate</strong>. ' + (resolvedCount > 0 ? resolvedCount + ' key community issues' : 'Civic issues') + ' have been successfully resolved by municipal crews and volunteers this month.';
    } else {
      bullet1 = '⚠️ <strong>Resolution Backlog</strong>: The ward\'s resolution rate is at <strong>' + resolutionRate + '%</strong>. Infrastructure repairs are lagging behind incoming citizen reports, causing a slow buildup of unresolved issues.';
    }

    // Bullet 2: Active Emergencies/Critical issues
    if (emergencies > 0) {
      bullet2 = '🚨 <strong>Emergency Alert</strong>: There ' + (emergencies > 1 ? 'are ' + emergencies + ' active emergencies' : 'is 1 active emergency') + ' in the ward (Severity 5). This includes severe sewer overflows or major water mains bursts causing direct disruption to residents. Immediate action required.';
    } else if (critical > 0) {
      bullet2 = '⚠️ <strong>Safety Hazards Active</strong>: No emergency, but there ' + (critical > 1 ? 'are ' + critical + ' critical safety hazards' : 'is 1 critical safety hazard') + ' active (Severity 4), such as severe potholes or dark stretches opposite malls. Drive carefully.';
    } else {
      bullet2 = '✅ <strong>All Clear</strong>: There are zero active emergency or critical safety hazards reported in the ward at this moment. The local streets are relatively safe and stable.';
    }

    // Bullet 3: AI Predictive Warning
    var predictions = CommunityHero.data.analytics.predictions;
    var wardPrediction = predictions.find(function(p){ 
      return p.area.toLowerCase() === wardName.toLowerCase() || (!wardId && p.severity === 'high'); 
    });

    if (wardPrediction) {
      bullet3 = '🔮 <strong>AI Predictive Alert</strong>: Forensic models predict a <strong>' + (wardPrediction.severity === 'high' ? 'high' : 'medium') + ' risk</strong> of <em>' + wardPrediction.category + '</em> issues (' + wardPrediction.confidence + '% confidence) in the ' + wardPrediction.timeframe + '. <strong>Mitigation</strong>: ' + wardPrediction.mitigation;
    } else {
      bullet3 = '🔮 <strong>AI Predictive Alert</strong>: General forecasting predicts stable air quality and low drainage risks for this ward over the next 5 days. Monitor predictions daily.';
    }

    container.innerHTML = '<div class="ch-health-audit-card ch-fade-in" style="--audit-color:' + gradeColor + '; --audit-gradient:' + gradeGradient + '; --audit-glow:' + gradeGlow + '">' +
      '<div class="ch-health-grade-container">' +
        '<span class="ch-health-grade-label">Ward Grade</span>' +
        '<div class="ch-health-grade-badge">' + grade + '</div>' +
        '<span class="ch-health-grade-val">' + gradeValText + '</span>' +
      '</div>' +
      '<div class="ch-health-audit-content">' +
        '<h3 class="ch-health-audit-title">' +
          '🤖 AI Ward Health Audit &mdash; ' + wardName +
          '<span class="ch-health-audit-title-meta">Real-time Citizen Summary</span>' +
        '</h3>' +
        '<ul class="ch-health-audit-list">' +
          '<li class="ch-health-bullet">' + bullet1 + '</li>' +
          '<li class="ch-health-bullet">' + bullet2 + '</li>' +
          '<li class="ch-health-bullet">' + bullet3 + '</li>' +
        '</ul>' +
      '</div>' +
    '</div>';
  },

  // ==================== LEADERBOARD ====================
  renderLeaderboard: function () {
    var tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;
    tbody.innerHTML = CommunityHero.gamification.renderLeaderboardHTML();
  },

  // ==================== BADGES ====================
  renderBadgeGrid: function () {
    var grid = document.getElementById('badge-grid');
    if (!grid) return;
    var user = CommunityHero.data.getUserById('USR-001');
    if (!user) return;
    grid.innerHTML = user.badges.map(function (badgeId) {
      return CommunityHero.gamification.renderBadgeHTML(badgeId);
    }).join('');
  },

  // ==================== ANIMATE STATS ====================
  animateStats: function () {
    var stats = CommunityHero.data.getStats();
    this._countUp('hero-stat-issues', 0, stats.totalIssues, 2000);
    this._countUp('hero-stat-resolved', 0, stats.resolved, 2000);
    this._countUp('hero-stat-citizens', 0, stats.activeHeroes, 2000);
    this._animateMoneyStat('hero-stat-saved', 12.4, 2000);
  },

  _countUp: function (elementId, start, end, duration) {
    var el = document.getElementById(elementId);
    if (!el) return;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      var value = Math.floor(start + (end - start) * eased);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  },

  _animateMoneyStat: function (elementId, endValue, duration) {
    var el = document.getElementById(elementId);
    if (!el) return;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = (endValue * eased).toFixed(1);
      el.textContent = '₹' + value + 'L';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  },

  // ==================== TOAST ====================
  showToast: function (message, type) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'ch-toast ch-toast-' + (type || 'info');
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('ch-toast-exit');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  },

  // ==================== UTILITIES ====================
  timeAgo: function (dateString) {
    var now = new Date();
    var date = new Date(dateString);
    var seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'just now';
    var minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    var hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    var days = Math.floor(hours / 24);
    if (days < 7) return days + 'd ago';
    var weeks = Math.floor(days / 7);
    return weeks + 'w ago';
  },

  _formatDate: function (dateString) {
    var d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  },

  // ==================== BOUNTY SYSTEM INTERACTION ====================
  _activeBountyStatusFilter: 'all',

  setupBounties: function () {
    var self = this;
    var wardFilter = document.getElementById('bounty-filter-ward');
    var filterButtons = document.querySelectorAll('#bounty-status-filters button');

    if (wardFilter) {
      wardFilter.addEventListener('change', function () {
        self.renderBounties();
      });
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        self._activeBountyStatusFilter = this.getAttribute('data-status');
        self.renderBounties();
      });
    });

    this.renderBounties();
  },

  renderBounties: function () {
    var self = this;
    var bounties = CommunityHero.data.getBounties();
    var container = document.getElementById('bounty-grid-container');
    var wardFilter = document.getElementById('bounty-filter-ward');
    var selectedWard = wardFilter ? wardFilter.value : '';

    if (!container) return;

    // Filter by ward
    if (selectedWard) {
      bounties = bounties.filter(function (b) {
        return b.location.ward === selectedWard;
      });
    }

    // Filter by status
    if (this._activeBountyStatusFilter !== 'all') {
      bounties = bounties.filter(function (b) {
        if (self._activeBountyStatusFilter === 'active') {
          return b.bounty.status === 'active' && b.bounty.fundedAmount < b.bounty.cost;
        } else if (self._activeBountyStatusFilter === 'claimed') {
          return b.bounty.status === 'claimed' || (b.bounty.status === 'active' && b.bounty.fundedAmount >= b.bounty.cost);
        } else {
          return b.bounty.status === self._activeBountyStatusFilter;
        }
      });
    }

    // Update stats
    var activeCount = bounties.filter(function (b) { return b.bounty.status !== 'completed'; }).length;
    var totalFunded = bounties.reduce(function (sum, b) { return sum + b.bounty.fundedAmount; }, 0);

    var statTotal = document.getElementById('bounty-stat-total');
    var statFunded = document.getElementById('bounty-stat-funded');
    if (statTotal) statTotal.textContent = activeCount;
    if (statFunded) statFunded.textContent = '₹' + totalFunded.toLocaleString('en-IN');

    if (bounties.length === 0) {
      container.innerHTML = '<p class="ch-text-muted ch-text-center" style="grid-column: 1/-1; padding:40px 0">No bounties found matching filters.</p>';
      return;
    }

    container.innerHTML = bounties.map(function (item, i) {
      var bounty = item.bounty;
      var pct = Math.min((bounty.fundedAmount / bounty.cost * 100), 100);
      var isFullyFunded = bounty.fundedAmount >= bounty.cost;
      var cats = CommunityHero.data.categories;
      var cat = cats[item.category] || cats['other'];
      var isClaimedByMe = bounty.claimedBy === 'USR-001';

      var statusLabels = {
        'active': isFullyFunded ? 'Fully Funded' : 'Funding',
        'claimed': 'Claimed',
        'completed': 'Completed'
      };
      var statusClass = bounty.status === 'active' && isFullyFunded ? 'funded' : bounty.status;
      
      var delay = i * 0.08;

      var cardHtml = '<div class="ch-bounty-card ch-slide-up" style="animation-delay: ' + delay + 's">';
      
      // Header
      cardHtml += '<div class="ch-bounty-card-header">';
      cardHtml += '<div>';
      cardHtml += '<span class="ch-bounty-status-tag ch-bounty-status-' + statusClass + '">' + statusLabels[bounty.status] + '</span>';
      cardHtml += '<h3 class="ch-bounty-card-title">' + cat.emoji + ' ' + item.title + '</h3>';
      cardHtml += '</div>';
      cardHtml += '<span class="ch-bounty-points-reward">🏆 ' + bounty.rewardPoints + ' pts</span>';
      cardHtml += '</div>';

      // Location
      cardHtml += '<p class="ch-text-xs ch-text-secondary">📍 ' + item.location.address + '</p>';

      // Materials List
      cardHtml += '<div class="ch-bounty-materials-list">';
      cardHtml += '<div style="font-weight: 600; margin-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 2px;">📦 AI-Estimated Materials & Costs:</div>';
      bounty.materials.forEach(function (mat) {
        cardHtml += '<div class="ch-bounty-material-item">';
        cardHtml += '<span>• ' + mat.name + '</span>';
        cardHtml += '<span>₹' + mat.cost + '</span>';
        cardHtml += '</div>';
      });
      cardHtml += '</div>';

      // Funding Progress
      cardHtml += '<div class="ch-bounty-progress-container">';
      cardHtml += '<div class="ch-bounty-progress-text">';
      cardHtml += '<span>Funding Progress</span>';
      cardHtml += '<strong>₹' + bounty.fundedAmount + ' / ₹' + bounty.cost + ' (' + pct.toFixed(0) + '%)</strong>';
      cardHtml += '</div>';
      cardHtml += '<div class="ch-bounty-progress-bar">';
      cardHtml += '<div class="ch-bounty-progress-fill" style="width: ' + pct + '%"></div>';
      cardHtml += '</div>';
      cardHtml += '</div>';

      // Actions
      cardHtml += '<div class="ch-bounty-actions">';
      if (bounty.status === 'active') {
        if (!isFullyFunded) {
          cardHtml += '<button class="ch-btn ch-btn-primary ch-btn-sm" style="flex: 1" onclick="CommunityHero.app.fundBounty(\'' + item.issueId + '\')">💸 Fund ₹50</button>';
          cardHtml += '<button class="ch-btn ch-btn-outline ch-btn-sm" style="flex: 1" disabled title="Bounty must be 100% funded to claim">🔧 Claim</button>';
        } else {
          cardHtml += '<button class="ch-btn ch-btn-primary ch-btn-sm" style="flex: 1" onclick="CommunityHero.app.claimBounty(\'' + item.issueId + '\')">🔧 Claim Bounty</button>';
        }
      } else if (bounty.status === 'claimed') {
        if (isClaimedByMe) {
          cardHtml += '<button class="ch-btn ch-btn-primary ch-btn-sm" style="flex: 1" onclick="CommunityHero.app.completeBounty(\'' + item.issueId + '\')">✅ Submit Proof of Fix</button>';
        } else {
          cardHtml += '<button class="ch-btn ch-btn-outline ch-btn-sm" style="flex: 1" disabled>🔒 Claimed by other</button>';
        }
      } else if (bounty.status === 'completed') {
        cardHtml += '<div class="ch-text-xs" style="color:var(--accent-emerald); font-weight:600; width:100%; text-align:center; padding: 6px 0; background:rgba(6,214,160,0.05); border-radius:var(--radius-sm);">🎉 Resolved by ' + (isClaimedByMe ? 'You' : 'Vikram Reddy') + '</div>';
      }
      cardHtml += '</div>';

      cardHtml += '</div>';
      return cardHtml;
    }).join('');
  },

  fundBounty: function (issueId) {
    var issue = CommunityHero.data.getIssueById(issueId);
    if (!issue || !issue.bounty) return;
    
    var bounty = issue.bounty;
    bounty.fundedAmount = Math.min(bounty.fundedAmount + 50, bounty.cost);
    bounty.backers.push({ name: 'Aarna Sharma', amount: 50 });

    var xpResult = CommunityHero.gamification.addXP('USR-001', 'fund-bounty');
    this.showToast('💸 Contributed ₹50! +15 XP earned!', 'success');
    if (xpResult && xpResult.leveledUp) {
      var self = this;
      setTimeout(function () { self.showToast('🎉 LEVEL UP! Level ' + xpResult.newLevel + '!', 'info'); }, 1500);
    }

    issue.timeline.push({
      event: 'bounty-funded',
      timestamp: new Date().toISOString(),
      actor: 'Aarna Sharma',
      detail: 'Contributed ₹50 to the repair fund'
    });

    var pct = (bounty.fundedAmount / bounty.cost * 100).toFixed(0);

    // Update Agent Console
    var consoleEl = document.getElementById('bounty-agent-console');
    if (consoleEl) {
      consoleEl.innerHTML = '<span style="color:var(--accent-purple)">[Bounty Agent]</span> Received ₹50 community funding for ' + issue.id + '.<br>' +
        '<span style="color:var(--accent-teal)">[Fund Status]</span> Progress now at ' + bounty.fundedAmount + '/' + bounty.cost + ' (' + pct + '%).';
    }

    this.renderBounties();
    this.renderHome();
  },

  claimBounty: function (issueId) {
    var issue = CommunityHero.data.getIssueById(issueId);
    if (!issue || !issue.bounty) return;

    var bounty = issue.bounty;
    bounty.status = 'claimed';
    bounty.claimedBy = 'USR-001';
    bounty.claimedAt = new Date().toISOString();

    var xpResult = CommunityHero.gamification.addXP('USR-001', 'claim-bounty');
    this.showToast('🔧 Bounty claimed! +20 XP! Time to fix!', 'success');
    if (xpResult && xpResult.leveledUp) {
      var self = this;
      setTimeout(function () { self.showToast('🎉 LEVEL UP! Level ' + xpResult.newLevel + '!', 'info'); }, 1500);
    }

    issue.timeline.push({
      event: 'bounty-claimed',
      timestamp: new Date().toISOString(),
      actor: 'Aarna Sharma',
      detail: 'Claimed this bounty for community self-repair'
    });

    // Update Agent Console
    var consoleEl = document.getElementById('bounty-agent-console');
    if (consoleEl) {
      consoleEl.innerHTML = '<span style="color:var(--accent-purple)">[Bounty Agent]</span> Bounty ' + issue.id + ' claimed by volunteer Aarna Sharma.<br>' +
        '<span style="color:var(--accent-amber)">[Task Assigned]</span> Safe-repair protocol active. Awaiting repair completion proof.';
    }

    this.renderBounties();
    this.renderHome();
  },

  completeBounty: function (issueId) {
    var self = this;
    var issue = CommunityHero.data.getIssueById(issueId);
    if (!issue || !issue.bounty) return;

    var bounty = issue.bounty;

    // Simulate the verification workflow
    this.showToast('📤 Uploading repair proof to Verification Agent...', 'info');
    
    // Step 1: Verification scanning
    setTimeout(function () {
      self.showToast('🤖 Verification Agent: Running computer vision comparison (before vs. after)...', 'info');
      var consoleEl = document.getElementById('bounty-agent-console');
      if (consoleEl) {
        consoleEl.innerHTML = '<span style="color:var(--accent-purple)">[Verification Agent]</span> Analyzing uploaded proof of fix for ' + issue.id + '...<br>' +
          '<span style="color:var(--accent-teal)">[Forensics]</span> Comparing before-report pixels with after-fix proof coordinates...';
      }
    }, 1500);

    // Step 2: Complete payout
    setTimeout(function () {
      bounty.status = 'completed';
      bounty.proofPhoto = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="100%" height="100%" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2306d6a0" font-family="sans-serif" font-size="14">Fix Verified: Grade A+</text></svg>';
      issue.status = 'resolved';
      issue.updatedAt = new Date().toISOString();

      // Add to timeline
      issue.timeline.push({
        event: 'resolved',
        timestamp: new Date().toISOString(),
        actor: 'Verification Agent',
        detail: 'Repair verified successfully (Grade: A+). Escrow payout of ₹' + bounty.cost + ' released. Issue resolved.'
      });

      // Payout award to volunteer
      var totalPointsGained = bounty.rewardPoints + 150; // bounty reward + completion bonus
      var user = CommunityHero.data.getUserById('USR-001');
      if (user) {
        user.xp += totalPointsGained;
        user.issuesResolved += 1;
        user.level = CommunityHero.gamification.getLevel(user.xp);
      }

      self.showToast('🎉 Fix verified (Grade: A+)! +' + totalPointsGained + ' XP awarded! Payout released!', 'success');
      
      // Check level up
      var progress = CommunityHero.gamification.getLevelProgress(user.xp);
      var xpBar = document.getElementById('user-xp-bar');
      if (xpBar) xpBar.style.width = (progress.progress * 100).toFixed(0) + '%';
      
      var levelEl = document.getElementById('user-level');
      var xpEl = document.getElementById('user-xp');
      if (levelEl) levelEl.textContent = user.level;
      if (xpEl) xpEl.textContent = user.xp.toLocaleString('en-IN');

      // Update Agent Console
      var consoleEl = document.getElementById('bounty-agent-console');
      if (consoleEl) {
        consoleEl.innerHTML = '<span style="color:var(--accent-emerald)">[Verification Agent]</span> Fix verified successfully! Quality: Grade A+.<br>' +
          '<span style="color:var(--accent-teal)">[Escrow Ledger]</span> Payout of ₹' + bounty.cost + ' released to volunteer Aarna Sharma.<br>' +
          '<span style="color:var(--accent-amber)">[Reward Released]</span> Disbursed ' + bounty.rewardPoints + ' Hero Points to volunteer.';
      }

      self.renderBounties();
      self.renderHome();
      
      // Update stats on Profile page
      var tsEl = document.getElementById('user-trust-score');
      if (tsEl) {
        var score = CommunityHero.gamification.getTrustScore('USR-001');
        user.trustScore = score;
        tsEl.querySelector('.ch-trust-score-value').textContent = score;
        tsEl.style.setProperty('--score', (score / 10).toFixed(1));
      }
    }, 3500);
  },

  // ==================== GOOGLE AI STUDIO API KEY CONFIG ====================
  setupAPIKeyConfig: function () {
    var self = this;
    var input = document.getElementById('gemini-api-key');
    var saveBtn = document.getElementById('save-api-key-btn');
    var status = document.getElementById('api-key-status');

    if (!input || !saveBtn || !status) return;

    var savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      input.value = savedKey;
      status.innerHTML = 'Status: <strong style="color:var(--accent-emerald)">Live Gemini 2.5 Flash API (Active)</strong>';
    }

    saveBtn.addEventListener('click', function () {
      var val = input.value.trim();
      if (val) {
        localStorage.setItem('gemini_api_key', val);
        status.innerHTML = 'Status: <strong style="color:var(--accent-emerald)">Live Gemini 2.5 Flash API (Active)</strong>';
        self.showToast('🤖 Saved API Key! Live Gemini Mode activated.', 'success');
      } else {
        localStorage.removeItem('gemini_api_key');
        status.innerHTML = 'Status: <strong>Simulation Mode (Active)</strong>';
        self.showToast('ℹ️ Cleared API Key. Offline Simulation Mode activated.', 'info');
      }
    });
  },

  // ==================== AGENT HUB RENDERING ====================
  renderAgentHub: function () {
    if (!CommunityHero.agents) return;
    var container = document.getElementById('agent-grid-container');
    if (!container) return;

    var agents = CommunityHero.agents.getAll();
    container.innerHTML = agents.map(function (agent, i) {
      var statKey = Object.keys(agent).find(function (k) { return k.indexOf('total') === 0; });
      var statVal = statKey ? agent[statKey] : 0;
      var statLabel = statKey ? statKey.replace('total', '') : 'Tasks';
      var delay = i * 0.06;
      return '<div class="ch-agent-card ch-slide-up" style="animation-delay:' + delay + 's;--agent-color:' + agent.color + '">' +
        '<div class="ch-agent-card-header">' +
          '<span class="ch-agent-emoji">' + agent.emoji + '</span>' +
          '<div>' +
            '<div class="ch-agent-name">' + agent.name + '</div>' +
            '<div class="ch-agent-status"><span class="ch-agent-status-dot"></span> Active</div>' +
          '</div>' +
        '</div>' +
        '<div class="ch-agent-desc">' + agent.description + '</div>' +
        '<div class="ch-agent-stat" style="color:' + agent.color + '">' + statLabel + ': ' + statVal + '</div>' +
      '</div>';
    }).join('');
  },

  // ==================== ACTIVITY FEED RENDERING ====================
  renderActivityFeed: function () {
    if (!CommunityHero.agents) return;
    var container = document.getElementById('agent-activity-feed');
    if (!container) return;

    var logs = CommunityHero.agents.getRecentActivity(20);
    if (logs.length === 0) {
      container.innerHTML = '<p class="ch-text-muted ch-text-center" style="padding:20px 0">No agent activity yet.</p>';
      return;
    }

    container.innerHTML = logs.map(function (log) {
      var time = new Date(log.timestamp);
      var timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      var bgColor = log.color ? log.color + '22' : 'rgba(255,255,255,0.05)';
      var textColor = log.color || 'var(--text-secondary)';
      return '<div class="ch-agent-feed-item">' +
        '<span class="ch-agent-feed-time">' + timeStr + '</span>' +
        '<span class="ch-agent-feed-badge" style="background:' + bgColor + ';color:' + textColor + '">' + log.agent + '</span>' +
        '<span class="ch-agent-feed-detail">' + '<strong>[' + log.action + ']</strong> ' + log.detail + '</span>' +
      '</div>';
    }).join('');

    // Also update agent hub stats
    this.renderAgentHub();
  },

  // ==================== CRISIS WIDGET ON HOME ====================
  updateCrisisWidget: function () {
    if (!CommunityHero.crisis) return;
    var stats = CommunityHero.crisis.getStats();
    var widget = document.getElementById('home-crisis-widget');
    if (!widget) return;

    if (stats.totalCrises > 0) {
      widget.classList.remove('ch-hidden');
      var emergEl = document.getElementById('crisis-home-emergencies');
      var citizenEl = document.getElementById('crisis-home-citizens');
      if (emergEl) emergEl.textContent = stats.emergencies;
      if (citizenEl) citizenEl.textContent = stats.citizensAtRisk.toLocaleString();
    } else {
      widget.classList.add('ch-hidden');
    }
  },

  // ==================== FORMAL COMPLAINT GENERATION ====================
  _generateComplaint: function (issueId) {
    if (!CommunityHero.crisis) {
      this.showToast('Crisis module not loaded.', 'warning');
      return;
    }
    var complaint = CommunityHero.crisis.generateComplaint(issueId);
    if (!complaint || complaint === 'Issue not found.') {
      this.showToast('Could not generate complaint.', 'warning');
      return;
    }

    // Log agent action
    if (CommunityHero.agents) {
      CommunityHero.agents.registry.escalation.generateComplaint(issueId);
    }

    // Show in a modal-like overlay
    var overlay = document.getElementById('dna-overlay-container');
    if (overlay) {
      overlay.innerHTML = '<div class="ch-dna-overlay" style="max-width:600px;max-height:80vh;overflow-y:auto">' +
        '<div class="ch-dna-header">' +
          '<span class="ch-dna-icon">🚨</span>' +
          '<h3 style="background:linear-gradient(135deg,var(--accent-coral),#dc2626);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Formal Municipal Complaint</h3>' +
          '<p class="ch-text-sm ch-text-secondary">Auto-generated by the Escalation Agent. Ready for submission.</p>' +
        '</div>' +
        '<pre style="background:var(--bg-tertiary);padding:16px;border-radius:var(--radius-md);font-size:0.7rem;color:var(--text-secondary);overflow-x:auto;white-space:pre-wrap;line-height:1.5;margin-bottom:16px;border:1px solid var(--border-color)">' + complaint + '</pre>' +
        '<div class="ch-dna-actions">' +
          '<button class="ch-btn ch-btn-primary ch-btn-sm" onclick="CommunityHero.app._copyComplaint()">' +
            '📋 Copy to Clipboard' +
          '</button>' +
          '<button class="ch-btn ch-btn-outline ch-btn-sm" onclick="document.getElementById(\'dna-overlay-container\').classList.add(\'ch-hidden\')">' +
            'Close' +
          '</button>' +
        '</div>' +
      '</div>';
      overlay.classList.remove('ch-hidden');
      // Store for copy
      this._lastComplaint = complaint;
    }
  },

  _copyComplaint: function () {
    if (this._lastComplaint && navigator.clipboard) {
      navigator.clipboard.writeText(this._lastComplaint).then(function () {
        CommunityHero.app.showToast('📋 Complaint copied to clipboard!', 'success');
      });
    } else {
      this.showToast('Could not copy. Please select and copy manually.', 'warning');
    }
  }

};

// ==================== BOOT ====================
document.addEventListener('DOMContentLoaded', function () {
  CommunityHero.app.init();
});
