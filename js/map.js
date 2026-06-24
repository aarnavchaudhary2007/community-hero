// ============================================================
// Community Hero — Leaflet Map Module (Delhi Edition)
// ============================================================
window.CommunityHero = window.CommunityHero || {};

CommunityHero.map = {
  map: null,
  markers: {},
  markerLayer: null,
  heatLayer: null,
  labelLayer: null,
  activeFilters: { category: null, severity: null },
  _initialized: false,

  // ---------- Initialize ----------
  init: function () {
    if (this._initialized) return;
    var container = document.getElementById('map-container');
    if (!container || typeof L === 'undefined') {
      console.warn('Map: Leaflet or container not ready. Retrying in 500ms…');
      var self = this;
      setTimeout(function () { self.init(); }, 500);
      return;
    }

    // Centered on Delhi/NCR with a zoom level suitable for the city
    this.map = L.map('map-container', {
      center: [28.6139, 77.2090],
      zoom: 11,
      zoomControl: false
    });

    // Zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Premium CartoDB Dark Matter tile layer for high-fidelity dark styling
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this.heatLayer = L.layerGroup().addTo(this.map);
    this.labelLayer = L.layerGroup().addTo(this.map);

    this.addMarkers();
    this.addHeatmapVisualization();
    this.addWardLabels();
    this.updateIssueCount();
    this._initialized = true;

    // Inject custom CSS styles (including hover tooltips)
    this._injectStyles();
  },

  // ---------- Inject dynamic CSS ----------
  _injectStyles: function () {
    if (document.getElementById('ch-map-styles')) return;
    var css = [
      '.ch-map-marker { background: transparent !important; border: none !important; }',
      '.ch-marker { width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;background:#1f2937;border:3px solid #06d6a0;box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:pointer;transition:transform 0.2s; }',
      '.ch-marker:hover { transform:scale(1.2); }',
      '.ch-marker-severity-1 { border-color:#06d6a0; }',
      '.ch-marker-severity-2 { border-color:#ffd166; }',
      '.ch-marker-severity-3 { border-color:#f97316; }',
      '.ch-marker-severity-4 { border-color:#ef476f; animation:markerPulse 2s infinite; }',
      '.ch-marker-severity-5 { border-color:#dc2626; animation:markerPulse 1s infinite; box-shadow:0 0 12px rgba(220,38,38,0.6); }',
      '@keyframes markerPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.15);} }',
      '.ch-map-popup { font-family:"Inter",sans-serif;color:#f8f9fa;min-width:200px; }',
      '.ch-map-popup strong { display:block;margin-bottom:4px;font-size:14px; }',
      '.ch-map-popup p { margin:2px 0;font-size:12px;color:#9ca3af; }',
      '.ch-map-popup button { margin-top:8px;padding:6px 14px;background:linear-gradient(135deg,#06d6a0,#118ab2);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;width:100%; }',
      '.ch-map-popup button:hover { opacity:0.9; }',
      '.ch-ward-label { background:transparent !important;border:none !important;color:#9ca3af;font-size:10px;font-weight:700;font-family:"Inter",sans-serif;text-transform:uppercase;letter-spacing:1.5px;text-shadow:0 1px 4px rgba(0,0,0,0.9);white-space:nowrap; opacity:0.75; }',
      // Dark popup styling
      '.leaflet-popup-content-wrapper { background:#1e293b !important;border:1px solid rgba(255,255,255,0.1);border-radius:12px !important;box-shadow:0 8px 32px rgba(0,0,0,0.5) !important; }',
      '.leaflet-popup-tip { background:#1e293b !important; }',
      '.leaflet-popup-close-button { color:#9ca3af !important; }',
      // Premium hover tooltips styling
      '.ch-map-tooltip { background: rgba(30, 41, 59, 0.95) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important; border-radius: 8px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.6) !important; color: #f3f4f6 !important; font-family: "Inter", sans-serif !important; padding: 6px 10px !important; pointer-events: none !important; font-size: 11px !important; }',
      '.ch-map-tooltip::before { border-top-color: rgba(30, 41, 59, 0.95) !important; }',
      '.ch-map-tooltip-content strong { font-size: 12px; font-weight: 600; display: inline-block; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }'
    ].join('\n');
    var style = document.createElement('style');
    style.id = 'ch-map-styles';
    style.textContent = css;
    document.head.appendChild(style);
  },

  // ---------- Add markers ----------
  addMarkers: function () {
    var self = this;
    var issues = CommunityHero.data.issues;
    issues.forEach(function (issue) {
      self.addNewIssueMarker(issue);
    });
  },

  // ---------- Add single new marker dynamically ----------
  addNewIssueMarker: function (issue) {
    if (this.markers[issue.id]) return; // Avoid duplicates
    
    var cats = CommunityHero.data.categories;
    var cat = cats[issue.category] || cats['other'];

    var icon = L.divIcon({
      className: 'ch-map-marker',
      html: '<div class="ch-marker ch-marker-severity-' + issue.severity + '">' + cat.emoji + '</div>',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    var marker = L.marker([issue.location.lat, issue.location.lng], { icon: icon });
    
    // Bind Popup (for click)
    marker.bindPopup(
      '<div class="ch-map-popup">' +
        '<strong>' + cat.emoji + ' ' + issue.title + '</strong>' +
        '<p>📍 ' + issue.location.address + '</p>' +
        '<p>Severity: ' + issue.severity + '/5 | Status: ' + issue.status.toUpperCase() + '</p>' +
        '<button onclick="CommunityHero.app.showIssueDetail(\'' + issue.id + '\')">View Details →</button>' +
      '</div>'
    );

    // Bind Tooltip (for hover)
    marker.bindTooltip(
      '<div class="ch-map-tooltip-content">' +
        '<span style="font-size:1.1rem;margin-right:6px;vertical-align:middle;">' + cat.emoji + '</span>' +
        '<strong>' + issue.title + '</strong>' +
        '<div style="margin-top:4px;font-size:10px;color:#cbd5e1;">Severity: <span style="color:' + CommunityHero.data.severityLevels[issue.severity].color + ';font-weight:bold;">' + issue.severity + '/5</span> | ' + issue.location.address.split(',')[0] + '</div>' +
      '</div>',
      {
        permanent: false,
        direction: 'top',
        className: 'ch-map-tooltip',
        offset: [0, -10]
      }
    );

    marker._issueData = issue; // stash for filtering
    marker.addTo(this.markerLayer);
    this.markers[issue.id] = marker;
    this.updateIssueCount();
  },

  // ---------- Remove marker ----------
  removeMarker: function (issueId) {
    if (this.markers[issueId]) {
      this.markerLayer.removeLayer(this.markers[issueId]);
      delete this.markers[issueId];
      this.updateIssueCount();
    }
  },

  // ---------- Filtering ----------
  filterByCategory: function (category) {
    this.activeFilters.category = category || null;
    this.applyFilters();
  },

  filterBySeverity: function (severity) {
    this.activeFilters.severity = severity ? parseInt(severity) : null;
    this.applyFilters();
  },

  applyFilters: function () {
    var self = this;
    var catFilter = this.activeFilters.category;
    var sevFilter = this.activeFilters.severity;

    Object.keys(this.markers).forEach(function (id) {
      var marker = self.markers[id];
      var issue = marker._issueData;
      var show = true;
      if (catFilter && issue.category !== catFilter) show = false;
      if (sevFilter && issue.severity < sevFilter) show = false;

      if (show && !self.markerLayer.hasLayer(marker)) {
        self.markerLayer.addLayer(marker);
      } else if (!show && self.markerLayer.hasLayer(marker)) {
        self.markerLayer.removeLayer(marker);
      }
    });
    this.updateIssueCount();
  },

  // ---------- Issue count ----------
  updateIssueCount: function () {
    var el = document.getElementById('map-issue-count');
    if (!el) return;
    var count = 0;
    var self = this;
    Object.keys(this.markers).forEach(function (id) {
      if (self.markerLayer.hasLayer(self.markers[id])) count++;
    });
    el.textContent = count + ' issues';
  },

  // ---------- Invalidate size ----------
  invalidateSize: function () {
    if (this.map) {
      var self = this;
      setTimeout(function () { self.map.invalidateSize(); }, 150);
    }
  },

  // ---------- Heatmap via circles ----------
  addHeatmapVisualization: function () {
    var wards = CommunityHero.data.wards;
    var self = this;
    wards.forEach(function (w) {
      var color = w.issues > 45 ? '#ef476f' : w.issues > 30 ? '#ffd166' : '#06d6a0';
      L.circle([w.lat, w.lng], {
        radius: w.issues * 45,
        color: color,
        fillColor: color,
        fillOpacity: 0.12,
        weight: 1,
        opacity: 0.3
      }).addTo(self.heatLayer);
    });
  },

  // ---------- Ward labels ----------
  addWardLabels: function () {
    var wards = CommunityHero.data.wards;
    var self = this;
    wards.forEach(function (w) {
      var label = L.divIcon({
        className: 'ch-ward-label',
        html: w.name,
        iconSize: [120, 20],
        iconAnchor: [60, 10]
      });
      L.marker([w.lat, w.lng], { icon: label, interactive: false }).addTo(self.labelLayer);
    });
  },

  // ---------- Fly to issue ----------
  flyToIssue: function (issueId) {
    var marker = this.markers[issueId];
    if (!marker) return;
    var issue = marker._issueData;
    this.map.flyTo([issue.location.lat, issue.location.lng], 16, { duration: 1.2 });
    setTimeout(function () { marker.openPopup(); }, 1300);
  }
};
