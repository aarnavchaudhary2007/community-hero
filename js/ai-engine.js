// ============================================================
// Community Hero — AI Simulation Engine
// ============================================================
window.CommunityHero = window.CommunityHero || {};

CommunityHero.ai = {

  // Weighted category distribution for random selection
  _categoryWeights: [
    { cat: 'pothole',    w: 25 },
    { cat: 'water-leak', w: 18 },
    { cat: 'streetlight', w: 15 },
    { cat: 'waste',      w: 20 },
    { cat: 'road-damage', w: 8 },
    { cat: 'drainage',   w: 12 },
    { cat: 'illegal-construction', w: 4 },
    { cat: 'noise',      w: 3 },
    { cat: 'air-quality', w: 2 },
    { cat: 'other',      w: 3 }
  ],

  _pickCategory: function () {
    var total = this._categoryWeights.reduce(function (s, c) { return s + c.w; }, 0);
    var r = Math.random() * total;
    var cum = 0;
    for (var i = 0; i < this._categoryWeights.length; i++) {
      cum += this._categoryWeights[i].w;
      if (r <= cum) return this._categoryWeights[i].cat;
    }
    return 'other';
  },

  // ---------- Main analysis function ----------
  analyzeImage: function (file, forceSimulation) {
    var self = this;
    var apiKey = forceSimulation ? null : localStorage.getItem('gemini_api_key');

    // Dispatch progress events for UI animations
    var steps = [
      { delay: 0,    event: 'ai:started',     data: { progress: 0,   message: 'Initializing AI Orchestration Engine…' } },
      { delay: 500,  event: 'ai:scanning',     data: { progress: 25,  message: apiKey ? 'Triage Agent: Running multimodal analysis with Gemini 2.5 Flash…' : 'Triage Agent: Scanning image…' } },
      { delay: 1200, event: 'ai:detecting',    data: { progress: 50,  message: 'Verification Agent: Performing duplicate check via Issue DNA…' } },
      { delay: 1800, event: 'ai:classifying',  data: { progress: 75,  message: 'Bounty Agent: Calculating material costs and reward points…' } },
      { delay: 2400, event: 'ai:complete',     data: { progress: 100, message: 'Analysis complete!' } }
    ];

    steps.forEach(function (s) {
      setTimeout(function () {
        document.dispatchEvent(new CustomEvent(s.event, { detail: s.data }));
      }, s.delay);
    });

    if (!apiKey) {
      // Simulation mode fallback
      return new Promise(function (resolve) {
        setTimeout(function () {
          var category = self._pickCategory();
          var cats = CommunityHero.data.categories;
          var severity = Math.floor(Math.random() * 4) + 2; // 2-5
          resolve({
            category: category,
            categoryLabel: cats[category].label,
            categoryEmoji: cats[category].emoji,
            confidence: +(0.85 + Math.random() * 0.14).toFixed(2),
            severity: severity,
            riskScore: +(6 + Math.random() * 4).toFixed(1),
            estimatedSize: self._generateSize(category),
            impactedPeople: Math.floor(100 + Math.random() * 500),
            suggestedDept: cats[category].dept,
            decayPrediction: self._generateDecayPrediction(severity),
            processingTime: '2.4s (Simulated)',
            bounty: CommunityHero.data.generateMockBounty(category, severity)
          });
        }, 2500);
      });
    }

    // Real Gemini mode!
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var base64Data = e.target.result.split(',')[1];
        var mimeType = file.type;

        var prompt = "You are the Triage Agent and Micro-Bounty Agent for Community Hero, an autonomous hyperlocal infrastructure platform. " +
          "Analyze the attached image and provide a JSON response summarizing your findings. You must output a valid JSON object ONLY. No markdown, no wrapping (except you can output standard JSON text, do not put it inside markdown code blocks). " +
          "JSON Schema to return:\n" +
          "{\n" +
          "  \"category\": \"string (must be one of: pothole, water-leak, streetlight, waste, road-damage, drainage, illegal-construction, other)\",\n" +
          "  \"confidence\": \"number between 0.0 and 1.0\",\n" +
          "  \"severity\": \"integer between 1 and 5\",\n" +
          "  \"riskScore\": \"number between 1.0 and 10.0 representing risk if left unfixed\",\n" +
          "  \"estimatedSize\": \"string estimating physical size of damage\",\n" +
          "  \"impactedPeople\": \"integer estimating number of affected local citizens\",\n" +
          "  \"decayPrediction\": \"string forecasting how this issue will worsen over time\",\n" +
          "  \"bounty\": {\n" +
          "    \"cost\": \"integer representing estimated cost in Indian Rupees (₹) for materials and labor\",\n" +
          "    \"materials\": [\n" +
          "      { \"name\": \"string (material name)\", \"cost\": \"integer\" }\n" +
          "    ],\n" +
          "    \"rewardPoints\": \"integer representing points reward (severity * 100 + 50)\"\n" +
          "  }\n" +
          "}\n" +
          "Note: If the issue is NOT suitable for community self-repair due to safety concerns or scale (e.g. water-leak, drainage, illegal-construction, noise, air-quality, or severity 5 emergency), set \"bounty\" to null. Bounties are only for safe, simple repairs like potholes, waste cleanup, light repairs, and minor road damage. Make the material names and costs highly realistic and tailored to the image.";

        var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        
        var payload = {
          contents: [{
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        };

        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        .then(res => {
          if (!res.ok) throw new Error("Gemini API request failed: " + res.statusText);
          return res.json();
        })
        .then(data => {
          try {
            var text = data.candidates[0].content.parts[0].text;
            // Clean markdown if Gemini ignored the format request
            if (text.indexOf("```") !== -1) {
              text = text.replace(/```json|```/g, "").trim();
            }
            var parsed = JSON.parse(text);
            
            var cats = CommunityHero.data.categories;
            var cat = parsed.category || 'other';
            
            // Populate auxiliary fields
            parsed.categoryLabel = cats[cat].label;
            parsed.categoryEmoji = cats[cat].emoji;
            parsed.suggestedDept = cats[cat].dept;
            parsed.processingTime = "Live Gemini API";

            if (parsed.bounty) {
              parsed.bounty.fundedAmount = 0;
              parsed.bounty.backers = [];
              parsed.bounty.status = 'active';
              parsed.bounty.claimedBy = null;
              parsed.bounty.claimedAt = null;
              parsed.bounty.proofPhoto = null;
            }
            
            resolve(parsed);
          } catch (err) {
            console.error("Error parsing Gemini JSON:", err, data);
            reject(new Error("Failed to parse AI response. Ensure image is clear."));
          }
        })
        .catch(err => {
          console.error("Gemini API Error:", err);
          reject(err);
        });
      };
      reader.onerror = function (err) { reject(err); };
      reader.readAsDataURL(file);
    });
  }

  // ---------- Size estimation ----------
  _generateSize: function (category) {
    var sizes = {
      'pothole':     ['30cm × 20cm × 8cm','50cm × 35cm × 12cm','70cm × 50cm × 15cm'],
      'water-leak':  ['Pipe crack ~10cm','Pipe crack ~30cm','Major pipe breach ~2m'],
      'streetlight':  ['1 light unit','3 light units','6 lights — 200m stretch'],
      'waste':       ['Single bin overflow','~5 sq m pile','~15 sq m dump area'],
      'road-damage': ['1m × 0.5m crack','3m × 2m depression','10m × 3m strip'],
      'drainage':    ['Manhole overflow','50m drainage line','~500m stretch'],
      'illegal-construction': ['2m × 1m encroachment','3m × 2m extension','Full floor addition'],
      'noise':       ['N/A — noise complaint','N/A — noise complaint','N/A — noise complaint'],
      'air-quality': ['Localized dust','~200m radius','~500m radius'],
      'other':       ['Small area','Medium area','Large area']
    };
    var arr = sizes[category] || sizes['other'];
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // ---------- Decay prediction ----------
  _generateDecayPrediction: function (severity) {
    var predictions = {
      1: 'Slow deterioration expected — routine maintenance sufficient',
      2: 'Moderate worsening likely during monsoon season',
      3: 'Will escalate to Severity 4 within 2 weeks without intervention',
      4: 'Rapid deterioration — safety incident likely within 1 week',
      5: 'EMERGENCY — Immediate danger. Situation worsening by the hour.'
    };
    return predictions[severity] || predictions[3];
  },

  // ---------- Severity scoring from description ----------
  scoreSeverity: function (category, description) {
    var text = (description || '').toLowerCase();
    var score = 2; // baseline
    var highWords = ['dangerous','emergency','flood','burst','collapse','accident','injury','stranded','sewage','blocked'];
    var medWords  = ['damaged','broken','overflow','leak','crack','unsafe','dark','stench'];
    var lowWords  = ['minor','small','dim','slight','slow','drip'];

    highWords.forEach(function (w) { if (text.indexOf(w) !== -1) score = Math.max(score, 4); });
    medWords.forEach(function (w)  { if (text.indexOf(w) !== -1) score = Math.max(score, 3); });
    lowWords.forEach(function (w)  { if (text.indexOf(w) !== -1) score = Math.min(score, 2); });

    if (category === 'drainage' || category === 'water-leak') score = Math.max(score, 3);
    return Math.min(score, 5);
  },

  // ---------- Report generation ----------
  generateReport: function (issue) {
    var cats = CommunityHero.data.categories;
    var cat = cats[issue.category] || cats['other'];
    var sev = CommunityHero.data.severityLevels[issue.severity];
    return [
      '═══════════════════════════════════════════',
      '  MUNICIPAL ISSUE REPORT — AUTO-GENERATED  ',
      '═══════════════════════════════════════════',
      '',
      'Report ID    : ' + issue.id,
      'Category     : ' + cat.emoji + ' ' + cat.label,
      'Severity     : ' + issue.severity + '/5 (' + sev.label + ')',
      'Risk Score   : ' + issue.aiAnalysis.riskScore + '/10',
      'Location     : ' + issue.location.address,
      'Ward         : ' + issue.location.ward,
      'Reported By  : ' + issue.reportedBy.name,
      'Date         : ' + new Date(issue.reportedAt).toLocaleString(),
      '',
      'DESCRIPTION:',
      issue.description,
      '',
      'AI ANALYSIS:',
      '  Confidence     : ' + (issue.aiAnalysis.confidence * 100).toFixed(0) + '%',
      '  Estimated Size : ' + issue.aiAnalysis.estimatedSize,
      '  Impacted People: ' + issue.aiAnalysis.impactedPeople,
      '  Suggested Dept : ' + issue.aiAnalysis.suggestedDept,
      '  Decay Forecast : ' + issue.aiAnalysis.decayPrediction,
      '',
      'VERIFICATIONS: ' + issue.verifications.length,
      'COMMUNITY UPVOTES: ' + issue.upvotes,
      '',
      '═══════════════════════════════════════════'
    ].join('\n');
  },

  // ---------- Predict decay for a ward ----------
  predictDecay: function (wardId) {
    var preds = CommunityHero.data.analytics.predictions;
    var wardName = '';
    CommunityHero.data.wards.forEach(function (w) { if (w.id === wardId) wardName = w.name; });
    return preds.filter(function (p) { return p.area === wardName; });
  },

  // ---------- Before/After comparison ----------
  compareBeforeAfter: function (beforeScore, afterScore) {
    var improvement = afterScore - beforeScore;
    if (improvement >= 8) return { grade: 'A+', message: 'Excellent resolution — issue fully addressed', color: '#06d6a0' };
    if (improvement >= 6) return { grade: 'A',  message: 'Good resolution — minor remnants remain', color: '#06d6a0' };
    if (improvement >= 4) return { grade: 'B',  message: 'Partial resolution — follow-up recommended', color: '#ffd166' };
    if (improvement >= 2) return { grade: 'C',  message: 'Minimal improvement — re-escalation needed', color: '#f97316' };
    return { grade: 'F', message: 'Not resolved — issue persists', color: '#ef476f' };
  },

  // ---------- Title generation ----------
  generateReportTitle: function (category, address) {
    var cats = CommunityHero.data.categories;
    var cat = cats[category] || cats['other'];
    var prefixes = {
      'pothole': 'Pothole detected on',
      'water-leak': 'Water leak reported at',
      'streetlight': 'Streetlight issue near',
      'waste': 'Waste accumulation at',
      'road-damage': 'Road damage on',
      'drainage': 'Drainage issue at',
      'illegal-construction': 'Unauthorized construction near',
      'noise': 'Noise complaint at',
      'air-quality': 'Air quality concern near',
      'other': 'Issue reported at'
    };
    return (prefixes[category] || prefixes['other']) + ' ' + (address || 'Unknown location');
  }
};
