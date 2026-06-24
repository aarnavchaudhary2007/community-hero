// ============================================================
// Community Hero — Gamification System
// ============================================================
window.CommunityHero = window.CommunityHero || {};

CommunityHero.gamification = {

  xpActions: {
    'report-issue':    50,
    'verify-issue':    30,
    'issue-resolved':  100,
    'photo-evidence':  20,
    'community-upvote': 5,
    'first-of-day':    25,
    'streak-bonus':    50,
    'detailed-report': 40,
    'fund-bounty':     15,
    'claim-bounty':    20,
    'complete-bounty': 150
  },

  levelThresholds: [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700, 5700, 7000],

  // ---------- Level from XP ----------
  getLevel: function (xp) {
    var t = this.levelThresholds;
    for (var i = t.length - 1; i >= 0; i--) {
      if (xp >= t[i]) return i + 1;
    }
    return 1;
  },

  // ---------- Level progress ----------
  getLevelProgress: function (xp) {
    var level = this.getLevel(xp);
    var t = this.levelThresholds;
    var currentThreshold = t[level - 1] || 0;
    var nextThreshold = t[level] || t[t.length - 1] + 2000;
    var progress = (xp - currentThreshold) / (nextThreshold - currentThreshold);
    return {
      currentLevel: level,
      nextLevel: level + 1,
      progress: Math.min(Math.max(progress, 0), 1),
      currentXP: xp,
      xpForNext: nextThreshold - xp
    };
  },

  // ---------- Add XP ----------
  addXP: function (userId, action) {
    var user = CommunityHero.data.getUserById(userId);
    if (!user) return null;
    var xpGained = this.xpActions[action] || 0;
    var oldLevel = this.getLevel(user.xp);
    user.xp += xpGained;
    var newLevel = this.getLevel(user.xp);
    user.level = newLevel;
    return {
      xpGained: xpGained,
      newTotal: user.xp,
      leveledUp: newLevel > oldLevel,
      newLevel: newLevel
    };
  },

  // ---------- Badge checking ----------
  checkBadges: function (userId) {
    var user = CommunityHero.data.getUserById(userId);
    if (!user) return [];
    var badges = CommunityHero.data.badges;
    var newBadges = [];
    for (var id in badges) {
      if (user.badges.indexOf(id) === -1 && user.xp >= badges[id].xpRequired) {
        var shouldUnlock = false;
        if (id === 'first-responder' && user.issuesReported >= 1) shouldUnlock = true;
        else if (id === 'eagle-eye' && user.issuesVerified >= 25) shouldUnlock = true;
        else if (id === 'top-contributor' && user.xp >= 2000) shouldUnlock = true;
        else if (id === 'community-leader' && user.trustScore >= 900) shouldUnlock = true;
        else if (id === 'resolver' && user.issuesResolved >= 10) shouldUnlock = true;
        else if (user.xp >= badges[id].xpRequired && badges[id].xpRequired > 0) shouldUnlock = true;

        if (shouldUnlock) {
          user.badges.push(id);
          newBadges.push(id);
        }
      }
    }
    return newBadges;
  },

  // ---------- Trust Score ----------
  getTrustScore: function (userId) {
    var user = CommunityHero.data.getUserById(userId);
    if (!user) return 0;
    // Computed: base 500 + reports*5 + verifications*3 + resolved*10 + level*10 − cap at 1000
    var score = 500 + user.issuesReported * 5 + user.issuesVerified * 3 + user.issuesResolved * 10 + user.level * 10;
    return Math.min(score, 1000);
  },

  // ---------- Leaderboard ----------
  getLeaderboard: function (limit) {
    var users = CommunityHero.data.getLeaderboard();
    return users.slice(0, limit || 10);
  },

  // ---------- Render badge HTML ----------
  renderBadgeHTML: function (badgeId) {
    var b = CommunityHero.data.badges[badgeId];
    if (!b) return '';
    return '<div class="ch-badge-item">' +
      '<span class="ch-badge-emoji">' + b.emoji + '</span>' +
      '<span class="ch-badge-name">' + b.name + '</span>' +
      '<span class="ch-badge-desc">' + b.description + '</span>' +
    '</div>';
  },

  // ---------- Render leaderboard rows ----------
  renderLeaderboardHTML: function (users) {
    if (!users || !users.length) users = this.getLeaderboard(10);
    var html = '';
    users.forEach(function (u, i) {
      var rank = i + 1;
      var rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '#' + rank;
      var isCurrentUser = u.id === 'USR-001';
      html += '<tr class="' + (isCurrentUser ? 'ch-leaderboard-highlight' : '') + '">' +
        '<td class="ch-rank">' + rankEmoji + '</td>' +
        '<td><span class="ch-avatar-sm">' + u.avatar + '</span> ' + u.name + '</td>' +
        '<td>' + u.trustScore + '</td>' +
        '<td>' + u.issuesReported + '</td>' +
        '<td class="ch-xp-cell">' + CommunityHero.gamification.formatXP(u.xp) + '</td>' +
      '</tr>';
    });
    return html;
  },

  // ---------- Impact calculation ----------
  calculateImpact: function (userId) {
    var user = CommunityHero.data.getUserById(userId);
    if (!user) return { vehicleDamageSaved: '₹0', waterSaved: '0 litres', electricitySaved: '0 kWh', totalImpact: '₹0' };
    var potholes = Math.floor(user.issuesReported * 0.3);
    var waterIssues = Math.floor(user.issuesReported * 0.2);
    var lightIssues = Math.floor(user.issuesReported * 0.15);
    return {
      vehicleDamageSaved: '₹' + (potholes * 0.22).toFixed(1) + 'L',
      waterSaved: (waterIssues * 2250).toLocaleString() + ' litres',
      electricitySaved: (lightIssues * 46) + ' kWh',
      totalImpact: '₹' + (potholes * 0.22 + waterIssues * 0.05 + lightIssues * 0.03).toFixed(1) + 'L'
    };
  },

  // ---------- Streak ----------
  getStreakDays: function (userId) {
    // Simulated — return a realistic number
    var user = CommunityHero.data.getUserById(userId);
    if (!user) return 0;
    return Math.min(Math.floor(user.xp / 200), 14);
  },

  // ---------- Format XP ----------
  formatXP: function (xp) {
    if (xp >= 1000) return (xp / 1000).toFixed(1) + 'K';
    return '' + xp;
  }
};
