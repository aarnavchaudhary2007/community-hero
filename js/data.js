// ============================================================
// Community Hero — Data Layer (Delhi/NCR Edition)
// ============================================================
window.CommunityHero = window.CommunityHero || {};

CommunityHero.data = {

  // ---------- Categories & Delhi Concerned Authorities ----------
  categories: {
    'pothole':              { emoji: '🕳️', label: 'Pothole',              color: '#ef476f', dept: 'MCD - Road Infrastructure Division' },
    'water-leak':           { emoji: '💧', label: 'Water Leak',            color: '#118ab2', dept: 'Delhi Jal Board (DJB)' },
    'streetlight':          { emoji: '💡', label: 'Broken Streetlight',    color: '#ffd166', dept: 'BSES / NDMC - Electrical Department' },
    'waste':                { emoji: '🗑️', label: 'Waste/Garbage',         color: '#06d6a0', dept: 'MCD - Solid Waste Management' },
    'road-damage':          { emoji: '🛣️', label: 'Road Damage',           color: '#8b5cf6', dept: 'PWD Delhi - Road Infrastructure' },
    'drainage':             { emoji: '🌊', label: 'Drainage/Flooding',    color: '#73d2de', dept: 'MCD & PWD - Drainage Department' },
    'illegal-construction': { emoji: '🏗️', label: 'Illegal Construction', color: '#f97316', dept: 'Delhi Development Authority (DDA)' },
    'noise':                { emoji: '📢', label: 'Noise Pollution',      color: '#ec4899', dept: 'Delhi Pollution Control Committee (DPCC)' },
    'air-quality':          { emoji: '🌫️', label: 'Air Quality',           color: '#94a3b8', dept: 'Delhi Pollution Control Committee (DPCC)' },
    'other':                { emoji: '❓', label: 'Other',                 color: '#6b7280', dept: 'MCD - General Administration' }
  },

  // ---------- Severity Levels ----------
  severityLevels: {
    1: { label: 'Low',       color: '#06d6a0', description: 'Minor inconvenience' },
    2: { label: 'Moderate',  color: '#ffd166', description: 'Noticeable impact' },
    3: { label: 'High',      color: '#f97316', description: 'Significant disruption' },
    4: { label: 'Critical',  color: '#ef476f', description: 'Safety hazard' },
    5: { label: 'Emergency', color: '#dc2626', description: 'Immediate danger' }
  },

  // ---------- Delhi Wards / Localities ----------
  wards: [
    { id: 'connaught-place', name: 'Connaught Place', lat: 28.6304, lng: 77.2177, issues: 47 },
    { id: 'karol-bagh',      name: 'Karol Bagh',      lat: 28.6514, lng: 77.1903, issues: 38 },
    { id: 'saket',           name: 'Saket',           lat: 28.5224, lng: 77.2100, issues: 52 },
    { id: 'dwarka',          name: 'Dwarka',          lat: 28.5823, lng: 77.0500, issues: 55 },
    { id: 'vasant-kunj',     name: 'Vasant Kunj',     lat: 28.5387, lng: 77.1610, issues: 41 },
    { id: 'chandni-chowk',   name: 'Chandni Chowk',   lat: 28.6562, lng: 77.2300, issues: 29 },
    { id: 'rajouri-garden',  name: 'Rajouri Garden',  lat: 28.6415, lng: 77.1200, issues: 33 },
    { id: 'greater-kailash', name: 'Greater Kailash', lat: 28.5482, lng: 77.2347, issues: 44 },
    { id: 'lajpat-nagar',    name: 'Lajpat Nagar',    lat: 28.5684, lng: 77.2400, issues: 36 },
    { id: 'mayur-vihar',     name: 'Mayur Vihar',     lat: 28.6044, lng: 77.2910, issues: 22 }
  ],

  // ---------- Badge Definitions ----------
  badges: {
    'first-responder':  { emoji: '🛡️', name: 'First Responder',  description: 'Reported your first issue',          xpRequired: 0 },
    'streak-master':    { emoji: '🔥', name: 'Streak Master',    description: '7-day reporting streak',              xpRequired: 500 },
    'eagle-eye':        { emoji: '👁️', name: 'Eagle Eye',        description: 'Verified 25 issues',                 xpRequired: 1000 },
    'top-contributor':  { emoji: '🏆', name: 'Top Contributor',  description: 'Top 5 in your ward',                 xpRequired: 2000 },
    'monsoon-guardian': { emoji: '🌧️', name: 'Monsoon Guardian', description: 'Reported 10 drainage issues',        xpRequired: 1500 },
    'quick-reporter':   { emoji: '⚡', name: 'Quick Reporter',   description: 'Reported within 5 min of spotting',  xpRequired: 300 },
    'community-leader': { emoji: '👑', name: 'Community Leader', description: 'Trust Score above 900',              xpRequired: 3000 },
    'night-owl':        { emoji: '🦉', name: 'Night Owl',        description: 'Reported 5 issues after 10 pm',      xpRequired: 800 },
    'resolver':         { emoji: '✅', name: 'The Resolver',     description: 'Helped resolve 10 issues',           xpRequired: 2500 },
    'influencer':       { emoji: '📣', name: 'Civic Influencer', description: 'Issues got 100+ total upvotes',      xpRequired: 1800 }
  },

  // ---------- Sample Users ----------
  users: [
    { id:'USR-001', name:'Aarna Sharma',   avatar:'👩‍💻', trustScore:847, xp:2450, level:12, badges:['first-responder','streak-master','eagle-eye','top-contributor','monsoon-guardian','quick-reporter'], issuesReported:34, issuesVerified:67, issuesResolved:12, ward:'connaught-place', joinedAt:'2025-08-15' },
    { id:'USR-002', name:'Vikram Reddy',   avatar:'👨‍🔧', trustScore:812, xp:2100, level:11, badges:['first-responder','streak-master','eagle-eye','top-contributor'], issuesReported:28, issuesVerified:55, issuesResolved:9, ward:'karol-bagh', joinedAt:'2025-09-02' },
    { id:'USR-003', name:'Priya Patel',    avatar:'👩‍🏫', trustScore:790, xp:1850, level:10, badges:['first-responder','eagle-eye','monsoon-guardian'], issuesReported:22, issuesVerified:48, issuesResolved:7, ward:'saket', joinedAt:'2025-10-10' },
    { id:'USR-004', name:'Rahul Menon',    avatar:'👨‍💼', trustScore:735, xp:1500, level:9,  badges:['first-responder','streak-master','quick-reporter'], issuesReported:19, issuesVerified:35, issuesResolved:5, ward:'dwarka', joinedAt:'2025-11-20' },
    { id:'USR-005', name:'Sneha Kulkarni', avatar:'👩‍🎨', trustScore:710, xp:1300, level:8,  badges:['first-responder','quick-reporter','night-owl'], issuesReported:16, issuesVerified:30, issuesResolved:4, ward:'vasant-kunj', joinedAt:'2025-12-05' },
    { id:'USR-006', name:'Amit Desai',     avatar:'👨‍🚀', trustScore:680, xp:1100, level:7,  badges:['first-responder','streak-master'], issuesReported:14, issuesVerified:22, issuesResolved:3, ward:'chandni-chowk', joinedAt:'2026-01-15' },
    { id:'USR-007', name:'Arjun Rao',      avatar:'👨‍🔬', trustScore:650, xp:900,  level:6,  badges:['first-responder','quick-reporter'], issuesReported:11, issuesVerified:18, issuesResolved:2, ward:'rajouri-garden', joinedAt:'2026-02-01' },
    { id:'USR-008', name:'Meera Iyer',     avatar:'👩‍⚕️', trustScore:620, xp:750,  level:5,  badges:['first-responder'], issuesReported:9,  issuesVerified:14, issuesResolved:1, ward:'greater-kailash', joinedAt:'2026-02-28' },
    { id:'USR-009', name:'Karthik Nair',   avatar:'👨‍🎓', trustScore:580, xp:550,  level:4,  badges:['first-responder'], issuesReported:7,  issuesVerified:10, issuesResolved:1, ward:'lajpat-nagar', joinedAt:'2026-03-15' },
    { id:'USR-010', name:'Divya Hegde',    avatar:'👩‍🌾', trustScore:520, xp:350,  level:3,  badges:['first-responder'], issuesReported:5,  issuesVerified:6,  issuesResolved:0, ward:'mayur-vihar', joinedAt:'2026-04-01' }
  ],

  // ---------- Delhi Sample Issues (20) ----------
  issues: [
    {
      id:'ISS-001', title:'Large pothole on Connaught Place Inner Circle', description:'Deep pothole approximately 50 cm wide near Block B, Connaught Place. Multiple low-clearance cars scraped. Highly dangerous at night due to poor visibility.',
      category:'pothole', severity:4, status:'verified',
      location:{ lat:28.6304, lng:77.2177, address:'Block B, Inner Circle, Connaught Place', ward:'connaught-place' },
      reportedBy:{ id:'USR-001', name:'Aarna Sharma', avatar:'👩‍💻', trustScore:847 },
      reportedAt:'2026-06-20T10:30:00', updatedAt:'2026-06-22T14:15:00',
      aiAnalysis:{ category:'pothole', confidence:0.94, severity:4, riskScore:8.7, estimatedSize:'50cm × 35cm × 12cm', impactedPeople:340, suggestedDept:'MCD - Road Infrastructure Division', decayPrediction:'Will worsen to Level 5 within 2 weeks under heavy traffic' },
      bounty: {
        cost: 850,
        materials: [
          { name: '2 bags of cold asphalt patch mix', cost: 400 },
          { name: '1 hand tamper tool rental', cost: 250 },
          { name: '2 hours of volunteer labor', cost: 200 }
        ],
        rewardPoints: 450,
        fundedAmount: 600,
        backers: [
          { name: 'Priya Patel', amount: 300 },
          { name: 'Arjun Rao', amount: 300 }
        ],
        status: 'active',
        claimedBy: null,
        claimedAt: null,
        proofPhoto: null
      },
      verifications:[
        { userId:'USR-003', name:'Priya Patel', stake:15, verified:true, timestamp:'2026-06-20T12:00:00' },
        { userId:'USR-007', name:'Arjun Rao',   stake:20, verified:true, timestamp:'2026-06-20T15:30:00' }
      ],
      timeline:[
        { event:'reported',     timestamp:'2026-06-20T10:30:00', actor:'Aarna Sharma', detail:'Issue reported with photo evidence' },
        { event:'ai-analyzed',  timestamp:'2026-06-20T10:30:05', actor:'AI Engine',    detail:'Classified as Pothole (94% confidence), Severity 4/5' },
        { event:'verified',     timestamp:'2026-06-20T12:00:00', actor:'Priya Patel',  detail:'Verified with 15 trust points staked' },
        { event:'verified',     timestamp:'2026-06-20T15:30:00', actor:'Arjun Rao',    detail:'Verified with 20 trust points staked' },
        { event:'routed',       timestamp:'2026-06-21T09:00:00', actor:'AI Engine',    detail:'Auto-routed to MCD Road Infrastructure Division' },
        { event:'acknowledged', timestamp:'2026-06-22T14:15:00', actor:'MCD',         detail:'Issue acknowledged. Repair crew scheduled.' }
      ],
      upvotes:47, comments:12
    },
    {
      id:'ISS-002', title:'Major water main burst near Karol Bagh Metro', description:'Drinking water gushing from broken pipe under the road near Karol Bagh Metro Station. Flooding Karol Bagh main market. Heavy traffic jam.',
      category:'water-leak', severity:5, status:'in-progress',
      location:{ lat:28.6514, lng:77.1903, address:'Pusa Road, Near Karol Bagh Metro Station', ward:'karol-bagh' },
      reportedBy:{ id:'USR-002', name:'Vikram Reddy', avatar:'👨‍🔧', trustScore:812 },
      reportedAt:'2026-06-21T07:15:00', updatedAt:'2026-06-22T16:00:00',
      aiAnalysis:{ category:'water-leak', confidence:0.97, severity:5, riskScore:9.5, estimatedSize:'Major pipe breach ~2m', impactedPeople:1520, suggestedDept:'Delhi Jal Board (DJB)', decayPrediction:'Worsening rapidly — estimated 12,000 litres/hour clean water lost' },
      verifications:[
        { userId:'USR-001', name:'Aarna Sharma', stake:25, verified:true, timestamp:'2026-06-21T08:00:00' },
        { userId:'USR-004', name:'Rahul Menon',  stake:20, verified:true, timestamp:'2026-06-21T08:30:00' },
        { userId:'USR-005', name:'Sneha Kulkarni', stake:15, verified:true, timestamp:'2026-06-21T09:00:00' }
      ],
      timeline:[
        { event:'reported',     timestamp:'2026-06-21T07:15:00', actor:'Vikram Reddy',  detail:'Emergency water leak reported with video evidence' },
        { event:'ai-analyzed',  timestamp:'2026-06-21T07:15:04', actor:'AI Engine',     detail:'Classified as Water Leak (97% confidence), Severity 5/5 — EMERGENCY' },
        { event:'verified',     timestamp:'2026-06-21T08:00:00', actor:'Aarna Sharma',  detail:'Verified with 25 trust points staked' },
        { event:'escalated',    timestamp:'2026-06-21T08:05:00', actor:'AI Engine',     detail:'Auto-escalated: Direct emergency alert sent to Delhi Jal Board Chief Engineer' },
        { event:'acknowledged', timestamp:'2026-06-21T09:30:00', actor:'DJB',         detail:'Emergency repair squad deployed. Valve shut-off in progress.' },
        { event:'in-progress',  timestamp:'2026-06-22T16:00:00', actor:'DJB',         detail:'Pipe excavation completed. Welding replacement section.' }
      ],
      upvotes:89, comments:34
    },
    {
      id:'ISS-003', title:'Street lights out near Select Citywalk, Saket', description:'All 8 streetlights on the main avenue opposite Select Citywalk Mall are completely dark. Promotes anti-social behavior and makes walking unsafe after sunset.',
      category:'streetlight', severity:3, status:'resolved',
      location:{ lat:28.5224, lng:77.2100, address:'Press Enclave Marg, Saket District Centre', ward:'saket' },
      reportedBy:{ id:'USR-003', name:'Priya Patel', avatar:'👩‍🏫', trustScore:790 },
      reportedAt:'2026-06-15T19:00:00', updatedAt:'2026-06-19T11:00:00',
      aiAnalysis:{ category:'streetlight', confidence:0.91, severity:3, riskScore:7.2, estimatedSize:'8 lights — 250m stretch', impactedPeople:880, suggestedDept:'BSES / NDMC - Electrical Department', decayPrediction:'Safety risk increases daily — safety hazard for women and elderly' },
      verifications:[
        { userId:'USR-004', name:'Rahul Menon', stake:10, verified:true, timestamp:'2026-06-15T20:00:00' }
      ],
      timeline:[
        { event:'reported',    timestamp:'2026-06-15T19:00:00', actor:'Priya Patel', detail:'8 streetlights reported non-functional' },
        { event:'ai-analyzed', timestamp:'2026-06-15T19:00:04', actor:'AI Engine',   detail:'Classified as Streetlight issue (91%), Severity 3/5' },
        { event:'verified',    timestamp:'2026-06-15T20:00:00', actor:'Rahul Menon', detail:'Verified with 10 trust points staked' },
        { event:'routed',      timestamp:'2026-06-16T09:00:00', actor:'AI Engine',   detail:'Auto-routed to BSES Electrical Maintenance' },
        { event:'in-progress', timestamp:'2026-06-17T10:00:00', actor:'BSES',      detail:'Technician assigned. Feeder line cable fault discovered.' },
        { event:'resolved',    timestamp:'2026-06-19T11:00:00', actor:'BSES',      detail:'Feeder cable re-laid. All 8 streetlights operational.' }
      ],
      upvotes:31, comments:8
    },
    {
      id:'ISS-004', title:'Garbage dump overflowing in Dwarka Sector 6', description:'MCD community garbage collection point near Dwarka Sector 6 Market has not been cleared for 5 days. Stench is spreading, and stray cows/dogs are blocking the road.',
      category:'waste', severity:3, status:'verified',
      location:{ lat:28.5823, lng:77.0500, address:'Sector 6 Market Road, Dwarka', ward:'dwarka' },
      reportedBy:{ id:'USR-004', name:'Rahul Menon', avatar:'👨‍💼', trustScore:735 },
      reportedAt:'2026-06-22T08:00:00', updatedAt:'2026-06-22T15:00:00',
      aiAnalysis:{ category:'waste', confidence:0.96, severity:3, riskScore:7.8, estimatedSize:'~15 sq m overflow area', impactedPeople:610, suggestedDept:'MCD - Solid Waste Management', decayPrediction:'Health hazard — high risk of disease vector breeding' },
      bounty: {
        cost: 450,
        materials: [
          { name: '10 heavy-duty garbage bags', cost: 150 },
          { name: '1 pair of safety gloves & picker', cost: 100 },
          { name: '1 heavy-duty broom & disinfectant', cost: 200 }
        ],
        rewardPoints: 300,
        fundedAmount: 450,
        backers: [
          { name: 'Aarna Sharma', amount: 250 },
          { name: 'Sneha Kulkarni', amount: 200 }
        ],
        status: 'completed',
        claimedBy: 'USR-002',
        claimedAt: '2026-06-22T10:00:00',
        proofPhoto: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="100%" height="100%" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2306d6a0" font-family="sans-serif" font-size="14">Cleaned &amp; Verified</text></svg>'
      },
      verifications:[
        { userId:'USR-005', name:'Sneha Kulkarni', stake:10, verified:true, timestamp:'2026-06-22T09:00:00' },
        { userId:'USR-001', name:'Aarna Sharma',   stake:15, verified:true, timestamp:'2026-06-22T10:30:00' }
      ],
      timeline:[
        { event:'reported',    timestamp:'2026-06-22T08:00:00', actor:'Rahul Menon',     detail:'Overflowing garbage dump reported' },
        { event:'ai-analyzed', timestamp:'2026-06-22T08:00:04', actor:'AI Engine',        detail:'Classified as Waste (96%), Severity 3/5' },
        { event:'verified',    timestamp:'2026-06-22T09:00:00', actor:'Sneha Kulkarni',   detail:'Verified with 10 trust points staked' },
        { event:'verified',    timestamp:'2026-06-22T10:30:00', actor:'Aarna Sharma',     detail:'Verified with 15 trust points staked' },
        { event:'routed',      timestamp:'2026-06-22T11:00:00', actor:'AI Engine',        detail:'Auto-routed to MCD Solid Waste Management' }
      ],
      upvotes:56, comments:19
    },
    {
      id:'ISS-005', title:'Severe waterlogging at Vasant Kunj Sector C', description:'Knee-deep water accumulated at the main entry gate of Sector C, Vasant Kunj, after a brief spell of heavy rain. Multiple cars stranded, two-wheelers slipping.',
      category:'drainage', severity:4, status:'open',
      location:{ lat:28.5387, lng:77.1610, address:'Sector C Main Road, Vasant Kunj', ward:'vasant-kunj' },
      reportedBy:{ id:'USR-007', name:'Arjun Rao', avatar:'👨‍🔬', trustScore:650 },
      reportedAt:'2026-06-23T06:45:00', updatedAt:'2026-06-23T06:45:00',
      aiAnalysis:{ category:'drainage', confidence:0.92, severity:4, riskScore:8.9, estimatedSize:'~300m waterlogged stretch', impactedPeople:1400, suggestedDept:'MCD & PWD - Drainage Department', decayPrediction:'Blocked stormwater drains — water level will rise if rain continues' },
      verifications:[], timeline:[
        { event:'reported',    timestamp:'2026-06-23T06:45:00', actor:'Arjun Rao', detail:'Waterlogging reported with photos' },
        { event:'ai-analyzed', timestamp:'2026-06-23T06:45:04', actor:'AI Engine', detail:'Classified as Drainage (92%), Severity 4/5' }
      ],
      upvotes:23, comments:5
    },
    {
      id:'ISS-006', title:'Pothole near Chandni Chowk Metro Station', description:'Pothole developing on the busy pedestrian walkway right outside Gate 3 of Chandni Chowk Metro. High footfall area, multiple people tripped.',
      category:'pothole', severity:2, status:'resolved',
      location:{ lat:28.6562, lng:77.2300, address:'Nai Sarak Road, Outside Metro Gate 3, Chandni Chowk', ward:'chandni-chowk' },
      reportedBy:{ id:'USR-005', name:'Sneha Kulkarni', avatar:'👩‍🎨', trustScore:710 },
      reportedAt:'2026-06-10T14:00:00', updatedAt:'2026-06-14T10:00:00',
      aiAnalysis:{ category:'pothole', confidence:0.88, severity:2, riskScore:5.2, estimatedSize:'25cm × 20cm × 5cm', impactedPeople:400, suggestedDept:'MCD - Road Infrastructure Division', decayPrediction:'Minor risk, but high footfall increases tripping hazard' },
      verifications:[{ userId:'USR-008', name:'Meera Iyer', stake:10, verified:true, timestamp:'2026-06-10T16:00:00' }],
      timeline:[
        { event:'reported', timestamp:'2026-06-10T14:00:00', actor:'Sneha Kulkarni', detail:'Pothole on walkway reported' },
        { event:'ai-analyzed', timestamp:'2026-06-10T14:00:04', actor:'AI Engine', detail:'Severity 2/5' },
        { event:'resolved', timestamp:'2026-06-14T10:00:00', actor:'MCD', detail:'Walkway tiles repaired and patched.' }
      ],
      upvotes:12, comments:3
    },
    {
      id:'ISS-007', title:'Leaking pipeline near Rajouri Garden Market', description:'Drinking water leaking from a pipeline joint near Rajouri Garden Main Market. Creating mud and slippery conditions on the road.',
      category:'water-leak', severity:3, status:'verified',
      location:{ lat:28.6415, lng:77.1200, address:'Market Road, Near Rajouri Garden Market', ward:'rajouri-garden' },
      reportedBy:{ id:'USR-006', name:'Amit Desai', avatar:'👨‍🚀', trustScore:680 },
      reportedAt:'2026-06-21T11:00:00', updatedAt:'2026-06-22T09:00:00',
      aiAnalysis:{ category:'water-leak', confidence:0.89, severity:3, riskScore:6.8, estimatedSize:'Pipeline joint leak', impactedPeople:350, suggestedDept:'Delhi Jal Board (DJB)', decayPrediction:'Water wastage and localized road erosion if unfixed' },
      verifications:[{ userId:'USR-009', name:'Karthik Nair', stake:10, verified:true, timestamp:'2026-06-21T13:00:00' }],
      timeline:[
        { event:'reported', timestamp:'2026-06-21T11:00:00', actor:'Amit Desai', detail:'Water leak reported near market' },
        { event:'ai-analyzed', timestamp:'2026-06-21T11:00:04', actor:'AI Engine', detail:'Severity 3/5' },
        { event:'verified', timestamp:'2026-06-21T13:00:00', actor:'Karthik Nair', detail:'Verified with 10 trust points' }
      ],
      upvotes:18, comments:6
    },
    {
      id:'ISS-008', title:'Flickering streetlight near GK-I M-Block', description:'Streetlight near the exit of M-Block Market in Greater Kailash 1 flickering heavily, creating a blind spot for turning cars.',
      category:'streetlight', severity:2, status:'open',
      location:{ lat:28.5482, lng:77.2347, address:'M-Block Market Exit, Greater Kailash 1', ward:'greater-kailash' },
      reportedBy:{ id:'USR-002', name:'Vikram Reddy', avatar:'👨‍🔧', trustScore:812 },
      reportedAt:'2026-06-22T20:30:00', updatedAt:'2026-06-22T20:30:00',
      aiAnalysis:{ category:'streetlight', confidence:0.85, severity:2, riskScore:4.5, estimatedSize:'1 LED fixture', impactedPeople:220, suggestedDept:'BSES / NDMC - Electrical Department', decayPrediction:'Choke failing, light will turn off completely within days' },
      bounty: {
        cost: 350,
        materials: [
          { name: '1 replacement 30W LED bulb', cost: 250 },
          { name: '1 pair of safety gloves & fuse', cost: 100 }
        ],
        rewardPoints: 250,
        fundedAmount: 150,
        backers: [
          { name: 'Vikram Reddy', amount: 150 }
        ],
        status: 'active',
        claimedBy: null,
        claimedAt: null,
        proofPhoto: null
      },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-22T20:30:00', actor:'Vikram Reddy', detail:'Flickering streetlight reported' },
        { event:'ai-analyzed', timestamp:'2026-06-22T20:30:04', actor:'AI Engine', detail:'Severity 2/5' }
      ],
      upvotes:8, comments:2
    },
    {
      id:'ISS-009', title:'Construction debris dumped on Lajpat Nagar Ring Rd', description:'Large pile of concrete rubble and bricks dumped overnight on the side of Lajpat Nagar Ring Road, narrowing the motorable lane.',
      category:'waste', severity:4, status:'in-progress',
      location:{ lat:28.5684, lng:77.2400, address:'Lajpat Nagar Ring Road, Near Flyover', ward:'lajpat-nagar' },
      reportedBy:{ id:'USR-003', name:'Priya Patel', avatar:'👩‍🏫', trustScore:790 },
      reportedAt:'2026-06-19T09:00:00', updatedAt:'2026-06-22T10:00:00',
      aiAnalysis:{ category:'waste', confidence:0.93, severity:4, riskScore:8.3, estimatedSize:'~25 sq m debris pile', impactedPeople:1800, suggestedDept:'MCD - Solid Waste Management', decayPrediction:'Major traffic obstruction and dust pollution hazard' },
      verifications:[
        { userId:'USR-001', name:'Aarna Sharma', stake:20, verified:true, timestamp:'2026-06-19T10:00:00' },
        { userId:'USR-004', name:'Rahul Menon', stake:15, verified:true, timestamp:'2026-06-19T11:30:00' }
      ],
      timeline:[
        { event:'reported', timestamp:'2026-06-19T09:00:00', actor:'Priya Patel', detail:'Illegal debris dumping reported' },
        { event:'ai-analyzed', timestamp:'2026-06-19T09:00:04', actor:'AI Engine', detail:'Severity 4/5' },
        { event:'in-progress', timestamp:'2026-06-22T10:00:00', actor:'MCD', detail:'JCB truck dispatched for debris clearing' }
      ],
      upvotes:72, comments:28
    },
    {
      id:'ISS-010', title:'Road cave-in near Mayur Vihar Phase 1', description:'A section of the road has caved in near Pocket 1 Metro Station, creating a dangerous 1-meter deep pit on the road edge.',
      category:'road-damage', severity:3, status:'open',
      location:{ lat:28.6044, lng:77.2910, address:'Pocket 1 Metro Rd, Mayur Vihar Phase 1', ward:'mayur-vihar' },
      reportedBy:{ id:'USR-009', name:'Karthik Nair', avatar:'👨‍🎓', trustScore:580 },
      reportedAt:'2026-06-23T07:00:00', updatedAt:'2026-06-23T07:00:00',
      aiAnalysis:{ category:'road-damage', confidence:0.90, severity:3, riskScore:7.5, estimatedSize:'1.2m × 1m cave-in', impactedPeople:550, suggestedDept:'PWD Delhi - Road Infrastructure', decayPrediction:'Water seepage under asphalt will expand cave-in size' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-23T07:00:00', actor:'Karthik Nair', detail:'Road cave-in reported' },
        { event:'ai-analyzed', timestamp:'2026-06-23T07:00:04', actor:'AI Engine', detail:'Severity 3/5' }
      ],
      upvotes:15, comments:4
    },
    {
      id:'ISS-011', title:'Encroachment blocking footpath in Karol Bagh', description:'Shopkeepers in Karol Bagh Ghaffar Market have extended permanent metal racks onto the pedestrian footpath, forcing walkers onto the main road.',
      category:'illegal-construction', severity:3, status:'verified',
      location:{ lat:28.6530, lng:77.1880, address:'Ghaffar Market Road, Karol Bagh', ward:'karol-bagh' },
      reportedBy:{ id:'USR-010', name:'Divya Hegde', avatar:'👩‍🌾', trustScore:520 },
      reportedAt:'2026-06-18T16:00:00', updatedAt:'2026-06-20T11:00:00',
      aiAnalysis:{ category:'illegal-construction', confidence:0.87, severity:3, riskScore:6.5, estimatedSize:'3m × 1.5m encroachment', impactedPeople:700, suggestedDept:'Delhi Development Authority (DDA)', decayPrediction:'Encroachment will become permanent if unchecked' },
      verifications:[{ userId:'USR-008', name:'Meera Iyer', stake:10, verified:true, timestamp:'2026-06-18T18:00:00' }],
      timeline:[
        { event:'reported', timestamp:'2026-06-18T16:00:00', actor:'Divya Hegde', detail:'Footpath encroachment reported' },
        { event:'ai-analyzed', timestamp:'2026-06-18T16:00:04', actor:'AI Engine', detail:'Severity 3/5' },
        { event:'verified', timestamp:'2026-06-18T18:00:00', actor:'Meera Iyer', detail:'Verified with 10 trust points' }
      ],
      upvotes:25, comments:9
    },
    {
      id:'ISS-012', title:'Late night construction noise in Saket J-Block', description:'Residential construction site using concrete mixing trucks and drilling past 11:30 PM. Violating silent hours rules.',
      category:'noise', severity:2, status:'open',
      location:{ lat:28.5240, lng:77.2080, address:'J-Block Residential Road, Saket', ward:'saket' },
      reportedBy:{ id:'USR-008', name:'Meera Iyer', avatar:'👩‍⚕️', trustScore:620 },
      reportedAt:'2026-06-22T23:15:00', updatedAt:'2026-06-22T23:15:00',
      aiAnalysis:{ category:'noise', confidence:0.82, severity:2, riskScore:5.0, estimatedSize:'N/A — noise complaint', impactedPeople:310, suggestedDept:'Delhi Pollution Control Committee (DPCC)', decayPrediction:'Likely to repeat nightly to meet construction deadline' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-22T23:15:00', actor:'Meera Iyer', detail:'Late-night noise pollution reported' },
        { event:'ai-analyzed', timestamp:'2026-06-22T23:15:04', actor:'AI Engine', detail:'Severity 2/5' }
      ],
      upvotes:14, comments:7
    },
    {
      id:'ISS-013', title:'Storm sewer overflow in Chandni Chowk', description:'Ancient storm drain manhole blocked and overflowing onto Nai Sarak road. Black stinky water flooding bookshops.',
      category:'drainage', severity:5, status:'in-progress',
      location:{ lat:28.6580, lng:77.2280, address:'Nai Sarak Main Chowk, Chandni Chowk', ward:'chandni-chowk' },
      reportedBy:{ id:'USR-004', name:'Rahul Menon', avatar:'👨‍💼', trustScore:735 },
      reportedAt:'2026-06-22T05:30:00', updatedAt:'2026-06-23T08:00:00',
      aiAnalysis:{ category:'drainage', confidence:0.95, severity:5, riskScore:9.8, estimatedSize:'Sewage drain line blockage', impactedPeople:950, suggestedDept:'MCD & PWD - Drainage Department', decayPrediction:'EMERGENCY — major cholera and infection hazard in crowded bazaar' },
      verifications:[
        { userId:'USR-001', name:'Aarna Sharma', stake:25, verified:true, timestamp:'2026-06-22T06:00:00' },
        { userId:'USR-005', name:'Sneha Kulkarni', stake:20, verified:true, timestamp:'2026-06-22T06:30:00' }
      ],
      timeline:[
        { event:'reported', timestamp:'2026-06-22T05:30:00', actor:'Rahul Menon', detail:'Sewer overflow reported in bazaar' },
        { event:'ai-analyzed', timestamp:'2026-06-22T05:30:04', actor:'AI Engine', detail:'Severity 5/5 — EMERGENCY' },
        { event:'escalated', timestamp:'2026-06-22T06:35:00', actor:'AI Engine', detail:'Auto-escalated to MCD Zonal Commissioner' },
        { event:'in-progress', timestamp:'2026-06-23T08:00:00', actor:'MCD', detail:'Sewer suction machine deployed' }
      ],
      upvotes:95, comments:41
    },
    {
      id:'ISS-014', title:'Dust clouds from Dwarka Sector 10 site', description:'Large commercial plot construction site has no dust screens or water spraying. Generating huge dust clouds affecting Dwarka Sector 10 Metro path.',
      category:'air-quality', severity:1, status:'open',
      location:{ lat:28.5850, lng:77.0480, address:'Sector 10 Metro Road, Dwarka', ward:'dwarka' },
      reportedBy:{ id:'USR-007', name:'Arjun Rao', avatar:'👨‍🔬', trustScore:650 },
      reportedAt:'2026-06-23T10:00:00', updatedAt:'2026-06-23T10:00:00',
      aiAnalysis:{ category:'air-quality', confidence:0.80, severity:1, riskScore:3.5, estimatedSize:'Construction plot ~1000 sq m', impactedPeople:780, suggestedDept:'Delhi Pollution Control Committee (DPCC)', decayPrediction:'AQI local spike — fine dust PM10 levels elevated' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-23T10:00:00', actor:'Arjun Rao', detail:'Dust pollution reported' },
        { event:'ai-analyzed', timestamp:'2026-06-23T10:00:04', actor:'AI Engine', detail:'Severity 1/5' }
      ],
      upvotes:6, comments:1
    },
    {
      id:'ISS-015', title:'Severe potholes on Nelson Mandela Marg', description:'Series of 3 deep potholes on high-speed Nelson Mandela Marg in Vasant Kunj. Forcing cars to swerve dangerously.',
      category:'pothole', severity:3, status:'in-progress',
      location:{ lat:28.5420, lng:77.1580, address:'Nelson Mandela Marg, Vasant Kunj', ward:'vasant-kunj' },
      reportedBy:{ id:'USR-002', name:'Vikram Reddy', avatar:'👨‍🔧', trustScore:812 },
      reportedAt:'2026-06-17T09:00:00', updatedAt:'2026-06-21T14:00:00',
      aiAnalysis:{ category:'pothole', confidence:0.91, severity:3, riskScore:7.0, estimatedSize:'3 potholes, largest 45cm wide', impactedPeople:2200, suggestedDept:'PWD Delhi - Road Infrastructure', decayPrediction:'High-speed traffic corridor — high risk of fatal accidents' },
      verifications:[{ userId:'USR-006', name:'Amit Desai', stake:15, verified:true, timestamp:'2026-06-17T11:00:00' }],
      timeline:[
        { event:'reported', timestamp:'2026-06-17T09:00:00', actor:'Vikram Reddy', detail:'Potholes on main corridor reported' },
        { event:'ai-analyzed', timestamp:'2026-06-17T09:00:04', actor:'AI Engine', detail:'Severity 3/5' },
        { event:'in-progress', timestamp:'2026-06-21T14:00:00', actor:'PWD', detail:'PWD patch maintenance crew dispatched' }
      ],
      upvotes:38, comments:15
    },
    {
      id:'ISS-016', title:'Overflowing trash bin in CP Central Park', description:'Public smart bin near CP Central Park musical fountain is overflowing with plastic cups and food waste.',
      category:'waste', severity:1, status:'resolved',
      location:{ lat:28.6300, lng:77.2180, address:'Central Park, Connaught Place', ward:'connaught-place' },
      reportedBy:{ id:'USR-010', name:'Divya Hegde', avatar:'👩‍🌾', trustScore:520 },
      reportedAt:'2026-06-12T08:00:00', updatedAt:'2026-06-12T17:00:00',
      aiAnalysis:{ category:'waste', confidence:0.90, severity:1, riskScore:3.0, estimatedSize:'Single bin overflow', impactedPeople:500, suggestedDept:'MCD - Solid Waste Management', decayPrediction:'Low severity, but hurts public park hygiene' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-12T08:00:00', actor:'Divya Hegde', detail:'Overflowing bin reported' },
        { event:'resolved', timestamp:'2026-06-12T17:00:00', actor:'NDMC', detail:'Bin emptied and area cleaned.' }
      ],
      upvotes:5, comments:1
    },
    {
      id:'ISS-017', title:'Road surface peeling on Rajouri Garden Ring Rd', description:'Asphalt surface has completely peeled off near Rajouri Garden flyover exit, exposing concrete bed. Creating major road vibration and tyre damage.',
      category:'road-damage', severity:4, status:'verified',
      location:{ lat:28.6430, lng:77.1180, address:'Ring Road, Exit of Rajouri Garden Flyover', ward:'rajouri-garden' },
      reportedBy:{ id:'USR-003', name:'Priya Patel', avatar:'👩‍🏫', trustScore:790 },
      reportedAt:'2026-06-20T16:00:00', updatedAt:'2026-06-22T09:00:00',
      aiAnalysis:{ category:'road-damage', confidence:0.93, severity:4, riskScore:8.5, estimatedSize:'15m × 3m peeled section', impactedPeople:2500, suggestedDept:'PWD Delhi - Road Infrastructure', decayPrediction:'High traffic volume will expand road bed degradation' },
      verifications:[
        { userId:'USR-002', name:'Vikram Reddy', stake:20, verified:true, timestamp:'2026-06-20T18:00:00' },
        { userId:'USR-007', name:'Arjun Rao',    stake:15, verified:true, timestamp:'2026-06-21T08:00:00' }
      ],
      timeline:[
        { event:'reported', timestamp:'2026-06-20T16:00:00', actor:'Priya Patel', detail:'Peeled road surface reported' },
        { event:'ai-analyzed', timestamp:'2026-06-20T16:00:04', actor:'AI Engine', detail:'Severity 4/5' },
        { event:'verified', timestamp:'2026-06-20T18:00:00', actor:'Vikram Reddy', detail:'Verified with 20 trust points' }
      ],
      upvotes:42, comments:16
    },
    {
      id:'ISS-018', title:'Dim streetlight in Greater Kailash 2 S-Block', description:'Main streetlight bulb in GK-2 S-Block is extremely dim, leaving the residential street junction completely dark.',
      category:'streetlight', severity:1, status:'resolved',
      location:{ lat:28.5460, lng:77.2360, address:'S-Block Residential Lane, Greater Kailash 2', ward:'greater-kailash' },
      reportedBy:{ id:'USR-005', name:'Sneha Kulkarni', avatar:'👩‍🎨', trustScore:710 },
      reportedAt:'2026-06-08T21:00:00', updatedAt:'2026-06-11T14:00:00',
      aiAnalysis:{ category:'streetlight', confidence:0.86, severity:1, riskScore:2.8, estimatedSize:'1 light unit', impactedPeople:110, suggestedDept:'BSES / NDMC - Electrical Department', decayPrediction:'Bulb filament degraded, will burn out completely' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-08T21:00:00', actor:'Sneha Kulkarni', detail:'Dim streetlight reported' },
        { event:'resolved', timestamp:'2026-06-11T14:00:00', actor:'BSES', detail:'LED light fixture replaced.' }
      ],
      upvotes:4, comments:1
    },
    {
      id:'ISS-019', title:'Overhead water pipe leak near Lajpat Nagar Metro', description:'overhead pipeline connector dripping steadily onto the pavement below outside Lajpat Nagar Metro Gate 1.',
      category:'water-leak', severity:2, status:'open',
      location:{ lat:28.5670, lng:77.2420, address:'Lajpat Nagar Metro Gate 1 Walkway', ward:'lajpat-nagar' },
      reportedBy:{ id:'USR-001', name:'Aarna Sharma', avatar:'👩‍💻', trustScore:847 },
      reportedAt:'2026-06-23T12:00:00', updatedAt:'2026-06-23T12:00:00',
      aiAnalysis:{ category:'water-leak', confidence:0.87, severity:2, riskScore:4.8, estimatedSize:'Connector pipe drip', impactedPeople:350, suggestedDept:'Delhi Jal Board (DJB)', decayPrediction:'Slow leak — wastage of ~300 litres/day' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-23T12:00:00', actor:'Aarna Sharma', detail:'Overhead pipe leak reported' },
        { event:'ai-analyzed', timestamp:'2026-06-23T12:00:04', actor:'AI Engine', detail:'Severity 2/5' }
      ],
      upvotes:3, comments:0
    },
    {
      id:'ISS-020', title:'Damaged speed breaker in Mayur Vihar Pocket 1', description:'Concrete speed breaker near Mayur Vihar Pocket 1 School has broken into sharp edges, causing tyres to get cut and vehicles to scrape.',
      category:'other', severity:2, status:'open',
      location:{ lat:28.6030, lng:77.2890, address:'Pocket 1 School Road, Mayur Vihar Phase 1', ward:'mayur-vihar' },
      reportedBy:{ id:'USR-006', name:'Amit Desai', avatar:'👨‍🚀', trustScore:680 },
      reportedAt:'2026-06-23T08:30:00', updatedAt:'2026-06-23T08:30:00',
      aiAnalysis:{ category:'other', confidence:0.78, severity:2, riskScore:5.0, estimatedSize:'Speed breaker damage', impactedPeople:480, suggestedDept:'MCD - General Administration', decayPrediction:'Ongoing hazard for school vans and kids' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-23T08:30:00', actor:'Amit Desai', detail:'Broken speed breaker reported' },
        { event:'ai-analyzed', timestamp:'2026-06-23T08:30:04', actor:'AI Engine', detail:'Severity 2/5' }
      ],
      upvotes:9, comments:3
    }
  ],

  // ---------- Delhi Analytics / Dashboard ----------
  analytics: {
    monthlyTrend:    [42, 38, 55, 61, 48, 52],
    monthLabels:     ['Jan','Feb','Mar','Apr','May','Jun'],
    resolutionRates: [65, 68, 71, 73, 70, 73],
    categoryBreakdown: { pothole:28, 'water-leak':18, streetlight:15, waste:22, 'road-damage':8, drainage:12, other:9 },
    wardComparison: [
      { ward:'Connaught Place', reported:47, resolved:34 },
      { ward:'Karol Bagh',      reported:38, resolved:30 },
      { ward:'Saket',           reported:52, resolved:35 },
      { ward:'Dwarka',          reported:55, resolved:38 },
      { ward:'Vasant Kunj',     reported:41, resolved:28 }
    ],
    predictions: [
      {
        area: 'Vasant Kunj',
        prediction: 'Expect 3× waterlogging reports this week due to monsoon drainage blockage near Sector C main road.',
        severity: 'high',
        category: 'drainage',
        timeframe: 'Next 72 Hours',
        confidence: 88,
        mitigation: 'Deploy MCD drainage suction trucks to clean Sector C storm sewers before Thursday rain.'
      },
      {
        area: 'Connaught Place',
        prediction: 'Road surface near CP Inner Circle Block B deteriorating — high-impact pothole predicted to form under heavy traffic.',
        severity: 'medium',
        category: 'pothole',
        timeframe: 'Within 10 Days',
        confidence: 76,
        mitigation: 'PWD road crew to apply preventive micro-resurfacing patch to Block B asphalt seam.'
      },
      {
        area: 'Karol Bagh',
        prediction: 'Solid waste accumulation spike expected near Ghaffar Market main entrance due to weekend festival footfall.',
        severity: 'medium',
        category: 'waste',
        timeframe: 'Next 48 Hours',
        confidence: 82,
        mitigation: 'MCD Solid Waste Management to deploy 3 extra mobile garbage bins and schedule an extra Sunday pickup.'
      },
      {
        area: 'Dwarka',
        prediction: '4 critical streetlights on Sector 6 School Avenue road showing filament decay — predicted complete dark-out.',
        severity: 'low',
        category: 'streetlight',
        timeframe: 'Within 7 Days',
        confidence: 90,
        mitigation: 'BSES Electrical division to pre-emptively replace lamp fixtures with new 30W LED bulbs.'
      }
    ],
    totalSaved: '18.6L'
  }
};

// ---------- Helper Functions ----------
CommunityHero.data.getIssueById = function (id) {
  return this.issues.find(function (i) { return i.id === id; });
};
CommunityHero.data.getIssuesByWard = function (wardId) {
  return this.issues.filter(function (i) { return i.location.ward === wardId; });
};
CommunityHero.data.getIssuesByCategory = function (cat) {
  return this.issues.filter(function (i) { return i.category === cat; });
};
CommunityHero.data.getIssuesBySeverity = function (sev) {
  return this.issues.filter(function (i) { return i.severity >= sev; });
};
CommunityHero.data.getUserById = function (id) {
  return this.users.find(function (u) { return u.id === id; });
};
CommunityHero.data.getLeaderboard = function () {
  return this.users.slice().sort(function (a, b) { return b.xp - a.xp; });
};
CommunityHero.data.getRecentIssues = function (count) {
  return this.issues.slice().sort(function (a, b) {
    return new Date(b.reportedAt) - new Date(a.reportedAt);
  }).slice(0, count || 10);
};
CommunityHero.data.getStats = function () {
  var resolved = this.issues.filter(function (i) { return i.status === 'resolved'; }).length;
  return { totalIssues: 1247, resolved: 891, activeHeroes: 3420, moneySaved: '₹18.6L' };
};

// ---------- Bounty Specific Helpers ----------
CommunityHero.data.getBounties = function () {
  return this.issues.filter(function (i) { return i.bounty !== undefined && i.bounty !== null; }).map(function (i) {
    return {
      issueId: i.id,
      title: i.title,
      category: i.category,
      severity: i.severity,
      location: i.location,
      reportedAt: i.reportedAt,
      bounty: i.bounty
    };
  });
};

CommunityHero.data.generateMockBounty = function (category, severity) {
  // Safety Guardrails: Check if category is suitable for community micro-repairs
  var safeCategories = ['pothole', 'waste', 'streetlight', 'road-damage'];
  if (safeCategories.indexOf(category) === -1) {
    return null; // Requires municipal authority due to scale, complexity, or danger
  }

  var baseCosts = {
    'pothole': 200,
    'waste': 100,
    'streetlight': 150,
    'road-damage': 250
  };

  var materialSets = {
    'pothole': [
      { name: 'Quick-set cold asphalt bag', baseCost: 350 },
      { name: '1 hand tamper tool rental', baseCost: 200 },
      { name: '1 steel cleaning brush', baseCost: 100 }
    ],
    'waste': [
      { name: 'Heavy duty garbage bags (10-pack)', baseCost: 120 },
      { name: '1 high-grade sweeping broom', baseCost: 150 },
      { name: '1 safety picker & gloves kit', baseCost: 100 }
    ],
    'streetlight': [
      { name: 'BSES-approved LED bulb unit', baseCost: 200 },
      { name: 'Universal electrical screw fuse', baseCost: 80 }
    ],
    'road-damage': [
      { name: '1 bag premix road patch repair', baseCost: 400 },
      { name: '1 steel trowel applicator', baseCost: 150 }
    ]
  };

  var costMultiplier = severity * 0.8 + 0.6;
  var baseCost = baseCosts[category] || 150;
  var materialsSelected = materialSets[category] || [];
  
  var totalMaterialCost = 0;
  var materialsList = materialsSelected.map(function (mat) {
    var actualCost = Math.round(mat.baseCost * costMultiplier);
    totalMaterialCost += actualCost;
    return {
      name: mat.name,
      cost: actualCost
    };
  });

  // Add labor cost estimation (for payout/compensation)
  var laborHours = Math.max(1, Math.round(severity * 0.8));
  var laborCost = laborHours * 100; // Rs 100 per hour rate
  materialsList.push({ name: laborHours + ' hour' + (laborHours > 1 ? 's' : '') + ' of volunteer labor', cost: laborCost });

  var totalCost = totalMaterialCost + laborCost;

  // Calculate dynamic Point Reward based on severity and urgency
  var rewardPoints = severity * 100 + 50;
  
  return {
    cost: totalCost,
    materials: materialsList,
    rewardPoints: rewardPoints,
    fundedAmount: 0,
    backers: [],
    status: 'active',
    claimedBy: null,
    claimedAt: null,
    proofPhoto: null
  };
};
