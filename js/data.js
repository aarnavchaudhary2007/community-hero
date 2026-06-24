// ============================================================
// Community Hero — Data Layer
// ============================================================
window.CommunityHero = window.CommunityHero || {};

CommunityHero.data = {

  // ---------- Categories ----------
  categories: {
    'pothole':              { emoji: '🕳️', label: 'Pothole',              color: '#ef476f', dept: 'BBMP - Road Infrastructure' },
    'water-leak':           { emoji: '💧', label: 'Water Leak',            color: '#118ab2', dept: 'BWSSB - Water Supply' },
    'streetlight':          { emoji: '💡', label: 'Broken Streetlight',    color: '#ffd166', dept: 'BESCOM - Electrical' },
    'waste':                { emoji: '🗑️', label: 'Waste/Garbage',         color: '#06d6a0', dept: 'BBMP - Solid Waste' },
    'road-damage':          { emoji: '🛣️', label: 'Road Damage',           color: '#8b5cf6', dept: 'BBMP - Road Infrastructure' },
    'drainage':             { emoji: '🌊', label: 'Drainage/Flooding',    color: '#73d2de', dept: 'BBMP - Storm Water' },
    'illegal-construction': { emoji: '🏗️', label: 'Illegal Construction', color: '#f97316', dept: 'BBMP - Town Planning' },
    'noise':                { emoji: '📢', label: 'Noise Pollution',      color: '#ec4899', dept: 'KSPCB - Pollution Control' },
    'air-quality':          { emoji: '🌫️', label: 'Air Quality',           color: '#94a3b8', dept: 'KSPCB - Pollution Control' },
    'other':                { emoji: '❓', label: 'Other',                 color: '#6b7280', dept: 'BBMP - General' }
  },

  // ---------- Severity Levels ----------
  severityLevels: {
    1: { label: 'Low',       color: '#06d6a0', description: 'Minor inconvenience' },
    2: { label: 'Moderate',  color: '#ffd166', description: 'Noticeable impact' },
    3: { label: 'High',      color: '#f97316', description: 'Significant disruption' },
    4: { label: 'Critical',  color: '#ef476f', description: 'Safety hazard' },
    5: { label: 'Emergency', color: '#dc2626', description: 'Immediate danger' }
  },

  // ---------- Wards ----------
  wards: [
    { id: 'koramangala',     name: 'Koramangala',     lat: 12.9352, lng: 77.6245, issues: 47 },
    { id: 'indiranagar',     name: 'Indiranagar',     lat: 12.9784, lng: 77.6408, issues: 38 },
    { id: 'hsr-layout',      name: 'HSR Layout',      lat: 12.9116, lng: 77.6389, issues: 52 },
    { id: 'whitefield',      name: 'Whitefield',      lat: 12.9698, lng: 77.7500, issues: 41 },
    { id: 'jayanagar',       name: 'Jayanagar',       lat: 12.9308, lng: 77.5838, issues: 29 },
    { id: 'btm-layout',      name: 'BTM Layout',      lat: 12.9166, lng: 77.6101, issues: 55 },
    { id: 'electronic-city', name: 'Electronic City',  lat: 12.8399, lng: 77.6770, issues: 33 },
    { id: 'marathahalli',    name: 'Marathahalli',    lat: 12.9591, lng: 77.7009, issues: 44 },
    { id: 'jp-nagar',        name: 'JP Nagar',        lat: 12.9063, lng: 77.5857, issues: 36 },
    { id: 'malleshwaram',    name: 'Malleshwaram',    lat: 12.9969, lng: 77.5711, issues: 22 }
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
    { id:'USR-001', name:'Aarna Sharma',   avatar:'👩‍💻', trustScore:847, xp:2450, level:12, badges:['first-responder','streak-master','eagle-eye','top-contributor','monsoon-guardian','quick-reporter'], issuesReported:34, issuesVerified:67, issuesResolved:12, ward:'koramangala', joinedAt:'2025-08-15' },
    { id:'USR-002', name:'Vikram Reddy',   avatar:'👨‍🔧', trustScore:812, xp:2100, level:11, badges:['first-responder','streak-master','eagle-eye','top-contributor'], issuesReported:28, issuesVerified:55, issuesResolved:9, ward:'indiranagar', joinedAt:'2025-09-02' },
    { id:'USR-003', name:'Priya Patel',    avatar:'👩‍🏫', trustScore:790, xp:1850, level:10, badges:['first-responder','eagle-eye','monsoon-guardian'], issuesReported:22, issuesVerified:48, issuesResolved:7, ward:'hsr-layout', joinedAt:'2025-10-10' },
    { id:'USR-004', name:'Rahul Menon',    avatar:'👨‍💼', trustScore:735, xp:1500, level:9,  badges:['first-responder','streak-master','quick-reporter'], issuesReported:19, issuesVerified:35, issuesResolved:5, ward:'btm-layout', joinedAt:'2025-11-20' },
    { id:'USR-005', name:'Sneha Kulkarni', avatar:'👩‍🎨', trustScore:710, xp:1300, level:8,  badges:['first-responder','quick-reporter','night-owl'], issuesReported:16, issuesVerified:30, issuesResolved:4, ward:'jayanagar', joinedAt:'2025-12-05' },
    { id:'USR-006', name:'Amit Desai',     avatar:'👨‍🚀', trustScore:680, xp:1100, level:7,  badges:['first-responder','streak-master'], issuesReported:14, issuesVerified:22, issuesResolved:3, ward:'whitefield', joinedAt:'2026-01-15' },
    { id:'USR-007', name:'Arjun Rao',      avatar:'👨‍🔬', trustScore:650, xp:900,  level:6,  badges:['first-responder','quick-reporter'], issuesReported:11, issuesVerified:18, issuesResolved:2, ward:'marathahalli', joinedAt:'2026-02-01' },
    { id:'USR-008', name:'Meera Iyer',     avatar:'👩‍⚕️', trustScore:620, xp:750,  level:5,  badges:['first-responder'], issuesReported:9,  issuesVerified:14, issuesResolved:1, ward:'jp-nagar', joinedAt:'2026-02-28' },
    { id:'USR-009', name:'Karthik Nair',   avatar:'👨‍🎓', trustScore:580, xp:550,  level:4,  badges:['first-responder'], issuesReported:7,  issuesVerified:10, issuesResolved:1, ward:'electronic-city', joinedAt:'2026-03-15' },
    { id:'USR-010', name:'Divya Hegde',    avatar:'👩‍🌾', trustScore:520, xp:350,  level:3,  badges:['first-responder'], issuesReported:5,  issuesVerified:6,  issuesResolved:0, ward:'malleshwaram', joinedAt:'2026-04-01' }
  ],

  // ---------- Sample Issues (20) ----------
  issues: [
    // ---- 1 ---- pothole, severity 4, verified
    {
      id:'ISS-001', title:'Large pothole on 80 Feet Road', description:'Deep pothole approximately 50 cm wide near Sony Signal junction. Multiple vehicles damaged. Especially dangerous at night.',
      category:'pothole', severity:4, status:'verified',
      location:{ lat:12.9352, lng:77.6245, address:'80 Feet Road, Koramangala 4th Block', ward:'koramangala' },
      reportedBy:{ id:'USR-001', name:'Aarna Sharma', avatar:'👩‍💻', trustScore:847 },
      reportedAt:'2026-06-20T10:30:00', updatedAt:'2026-06-22T14:15:00',
      aiAnalysis:{ category:'pothole', confidence:0.94, severity:4, riskScore:8.7, estimatedSize:'50cm × 35cm × 12cm', impactedPeople:340, suggestedDept:'BBMP - Road Infrastructure', decayPrediction:'Will worsen to Level 5 within 2 weeks if unrepaired' },
      bounty: {
        cost: 850,
        materials: [
          { name: '2 bags of quick-set concrete', cost: 400 },
          { name: '1 bucket & hand trowel', cost: 250 },
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
        { event:'ai-analyzed',  timestamp:'2026-06-20T10:30:05', actor:'AI Engine',    detail:'Classified as Pothole (94 % confidence), Severity 4/5' },
        { event:'verified',     timestamp:'2026-06-20T12:00:00', actor:'Priya Patel',  detail:'Verified with 15 trust points staked' },
        { event:'verified',     timestamp:'2026-06-20T15:30:00', actor:'Arjun Rao',    detail:'Verified with 20 trust points staked' },
        { event:'routed',       timestamp:'2026-06-21T09:00:00', actor:'AI Engine',    detail:'Auto-routed to BBMP Road Infrastructure Division' },
        { event:'acknowledged', timestamp:'2026-06-22T14:15:00', actor:'BBMP',         detail:'Issue acknowledged. Repair crew dispatched.' }
      ],
      upvotes:47, comments:12
    },

    // ---- 2 ---- water-leak, severity 5, in-progress
    {
      id:'ISS-002', title:'Major water main burst on 12th Main', description:'Water gushing from broken main pipe flooding the entire street. Traffic blocked. Immediate attention needed.',
      category:'water-leak', severity:5, status:'in-progress',
      location:{ lat:12.9784, lng:77.6408, address:'12th Main Road, Indiranagar', ward:'indiranagar' },
      reportedBy:{ id:'USR-002', name:'Vikram Reddy', avatar:'👨‍🔧', trustScore:812 },
      reportedAt:'2026-06-21T07:15:00', updatedAt:'2026-06-22T16:00:00',
      aiAnalysis:{ category:'water-leak', confidence:0.97, severity:5, riskScore:9.5, estimatedSize:'Major pipe breach ~2m', impactedPeople:520, suggestedDept:'BWSSB - Water Supply', decayPrediction:'Worsening rapidly — estimated 10,000 litres/hour lost' },
      verifications:[
        { userId:'USR-001', name:'Aarna Sharma', stake:25, verified:true, timestamp:'2026-06-21T08:00:00' },
        { userId:'USR-004', name:'Rahul Menon',  stake:20, verified:true, timestamp:'2026-06-21T08:30:00' },
        { userId:'USR-005', name:'Sneha Kulkarni', stake:15, verified:true, timestamp:'2026-06-21T09:00:00' }
      ],
      timeline:[
        { event:'reported',     timestamp:'2026-06-21T07:15:00', actor:'Vikram Reddy',  detail:'Emergency water leak reported with video evidence' },
        { event:'ai-analyzed',  timestamp:'2026-06-21T07:15:04', actor:'AI Engine',     detail:'Classified as Water Leak (97 % confidence), Severity 5/5 — EMERGENCY' },
        { event:'verified',     timestamp:'2026-06-21T08:00:00', actor:'Aarna Sharma',  detail:'Verified with 25 trust points staked' },
        { event:'escalated',    timestamp:'2026-06-21T08:05:00', actor:'AI Engine',     detail:'Auto-escalated: 3 verifications + Severity 5 → Direct alert to BWSSB Chief Engineer' },
        { event:'acknowledged', timestamp:'2026-06-21T09:30:00', actor:'BWSSB',         detail:'Emergency crew deployed. ETA 45 min.' },
        { event:'in-progress',  timestamp:'2026-06-22T16:00:00', actor:'BWSSB',         detail:'Repair work in progress. Expected completion: 24 hrs.' }
      ],
      upvotes:89, comments:34
    },

    // ---- 3 ---- streetlight, severity 3, resolved
    {
      id:'ISS-003', title:'Street lights out on Sector 2 Road', description:'All 6 street lights on Sector 2 main road have been off for 3 days. Area is pitch dark after 7 PM making it unsafe for pedestrians.',
      category:'streetlight', severity:3, status:'resolved',
      location:{ lat:12.9116, lng:77.6389, address:'Sector 2 Main Road, HSR Layout', ward:'hsr-layout' },
      reportedBy:{ id:'USR-003', name:'Priya Patel', avatar:'👩‍🏫', trustScore:790 },
      reportedAt:'2026-06-15T19:00:00', updatedAt:'2026-06-19T11:00:00',
      aiAnalysis:{ category:'streetlight', confidence:0.91, severity:3, riskScore:7.2, estimatedSize:'6 lights — 200 m stretch', impactedPeople:280, suggestedDept:'BESCOM - Electrical', decayPrediction:'Safety risk increases daily — pedestrian incidents likely' },
      verifications:[
        { userId:'USR-004', name:'Rahul Menon', stake:10, verified:true, timestamp:'2026-06-15T20:00:00' }
      ],
      timeline:[
        { event:'reported',    timestamp:'2026-06-15T19:00:00', actor:'Priya Patel', detail:'6 streetlights reported non-functional' },
        { event:'ai-analyzed', timestamp:'2026-06-15T19:00:04', actor:'AI Engine',   detail:'Classified as Streetlight issue (91 %), Severity 3/5' },
        { event:'verified',    timestamp:'2026-06-15T20:00:00', actor:'Rahul Menon', detail:'Verified with 10 trust points staked' },
        { event:'routed',      timestamp:'2026-06-16T09:00:00', actor:'AI Engine',   detail:'Auto-routed to BESCOM Electrical Division' },
        { event:'in-progress', timestamp:'2026-06-17T10:00:00', actor:'BESCOM',      detail:'Technician assigned. Transformer fault identified.' },
        { event:'resolved',    timestamp:'2026-06-19T11:00:00', actor:'BESCOM',      detail:'All 6 streetlights restored. Transformer replaced.' }
      ],
      upvotes:31, comments:8
    },

    // ---- 4 ---- waste, severity 3, verified
    {
      id:'ISS-004', title:'Garbage dump overflowing near market', description:'The community garbage collection point near the main market has not been cleared for 5 days. Stench is unbearable and attracting stray animals.',
      category:'waste', severity:3, status:'verified',
      location:{ lat:12.9166, lng:77.6101, address:'BTM 2nd Stage, Near Udupi Garden', ward:'btm-layout' },
      reportedBy:{ id:'USR-004', name:'Rahul Menon', avatar:'👨‍💼', trustScore:735 },
      reportedAt:'2026-06-22T08:00:00', updatedAt:'2026-06-22T15:00:00',
      aiAnalysis:{ category:'waste', confidence:0.96, severity:3, riskScore:7.8, estimatedSize:'~15 sq m overflow area', impactedPeople:410, suggestedDept:'BBMP - Solid Waste', decayPrediction:'Health hazard will escalate to Severity 4 in 2 days' },
      bounty: {
        cost: 450,
        materials: [
          { name: '5 heavy-duty garbage bags', cost: 150 },
          { name: '1 pair of safety gloves', cost: 100 },
          { name: '1 heavy-duty broom & dustpan', cost: 200 }
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
        { event:'ai-analyzed', timestamp:'2026-06-22T08:00:04', actor:'AI Engine',        detail:'Classified as Waste (96 %), Severity 3/5' },
        { event:'verified',    timestamp:'2026-06-22T09:00:00', actor:'Sneha Kulkarni',   detail:'Verified with 10 trust points staked' },
        { event:'verified',    timestamp:'2026-06-22T10:30:00', actor:'Aarna Sharma',     detail:'Verified with 15 trust points staked' },
        { event:'routed',      timestamp:'2026-06-22T11:00:00', actor:'AI Engine',        detail:'Auto-routed to BBMP Solid Waste Management' }
      ],
      upvotes:56, comments:19
    },

    // ---- 5 ---- drainage, severity 4, open
    { id:'ISS-005', title:'Severe waterlogging on Outer Ring Road', description:'Knee-deep water accumulated under ORR flyover after overnight rain. Vehicles stranded.',
      category:'drainage', severity:4, status:'open',
      location:{ lat:12.9591, lng:77.7009, address:'Outer Ring Road, Near Marathahalli Bridge', ward:'marathahalli' },
      reportedBy:{ id:'USR-007', name:'Arjun Rao', avatar:'👨‍🔬', trustScore:650 },
      reportedAt:'2026-06-23T06:45:00', updatedAt:'2026-06-23T06:45:00',
      aiAnalysis:{ category:'drainage', confidence:0.92, severity:4, riskScore:8.9, estimatedSize:'~500 m stretch', impactedPeople:1200, suggestedDept:'BBMP - Storm Water', decayPrediction:'More rain forecasted — expect worsening within 6 hours' },
      verifications:[], timeline:[
        { event:'reported',    timestamp:'2026-06-23T06:45:00', actor:'Arjun Rao', detail:'Waterlogging reported with photos' },
        { event:'ai-analyzed', timestamp:'2026-06-23T06:45:04', actor:'AI Engine', detail:'Classified as Drainage (92 %), Severity 4/5' }
      ],
      upvotes:23, comments:5
    },

    // ---- 6 ---- pothole, severity 2, resolved
    { id:'ISS-006', title:'Small pothole near Jayanagar 4th Block park', description:'Small but growing pothole near the park entrance.',
      category:'pothole', severity:2, status:'resolved',
      location:{ lat:12.9308, lng:77.5838, address:'4th Block Park Road, Jayanagar', ward:'jayanagar' },
      reportedBy:{ id:'USR-005', name:'Sneha Kulkarni', avatar:'👩‍🎨', trustScore:710 },
      reportedAt:'2026-06-10T14:00:00', updatedAt:'2026-06-14T10:00:00',
      aiAnalysis:{ category:'pothole', confidence:0.88, severity:2, riskScore:5.2, estimatedSize:'20cm × 15cm × 5cm', impactedPeople:150, suggestedDept:'BBMP - Road Infrastructure', decayPrediction:'Moderate — will worsen during monsoon' },
      verifications:[{ userId:'USR-008', name:'Meera Iyer', stake:10, verified:true, timestamp:'2026-06-10T16:00:00' }],
      timeline:[
        { event:'reported', timestamp:'2026-06-10T14:00:00', actor:'Sneha Kulkarni', detail:'Small pothole reported' },
        { event:'ai-analyzed', timestamp:'2026-06-10T14:00:04', actor:'AI Engine', detail:'Severity 2/5' },
        { event:'resolved', timestamp:'2026-06-14T10:00:00', actor:'BBMP', detail:'Pothole patched.' }
      ],
      upvotes:12, comments:3
    },

    // ---- 7 ---- water-leak, severity 3, verified
    { id:'ISS-007', title:'Leaking pipe on 5th Cross', description:'Water pipe leaking at junction creating slippery surface.',
      category:'water-leak', severity:3, status:'verified',
      location:{ lat:12.9698, lng:77.7500, address:'5th Cross, ITPL Main Road, Whitefield', ward:'whitefield' },
      reportedBy:{ id:'USR-006', name:'Amit Desai', avatar:'👨‍🚀', trustScore:680 },
      reportedAt:'2026-06-21T11:00:00', updatedAt:'2026-06-22T09:00:00',
      aiAnalysis:{ category:'water-leak', confidence:0.89, severity:3, riskScore:6.8, estimatedSize:'Pipe crack ~30cm', impactedPeople:200, suggestedDept:'BWSSB - Water Supply', decayPrediction:'Steady leak — ~500 litres/hour wasted' },
      verifications:[{ userId:'USR-009', name:'Karthik Nair', stake:10, verified:true, timestamp:'2026-06-21T13:00:00' }],
      timeline:[
        { event:'reported', timestamp:'2026-06-21T11:00:00', actor:'Amit Desai', detail:'Leaking pipe reported' },
        { event:'ai-analyzed', timestamp:'2026-06-21T11:00:04', actor:'AI Engine', detail:'Severity 3/5' },
        { event:'verified', timestamp:'2026-06-21T13:00:00', actor:'Karthik Nair', detail:'Verified with 10 trust points' }
      ],
      upvotes:18, comments:6
    },

    // ---- 8 ---- streetlight, severity 2, open
    { id:'ISS-008', title:'Flickering streetlight near bus stop', description:'Streetlight at Domlur bus stop flickering intermittently.',
      category:'streetlight', severity:2, status:'open',
      location:{ lat:12.9610, lng:77.6387, address:'Domlur Bus Stop, Indiranagar', ward:'indiranagar' },
      reportedBy:{ id:'USR-002', name:'Vikram Reddy', avatar:'👨‍🔧', trustScore:812 },
      reportedAt:'2026-06-22T20:30:00', updatedAt:'2026-06-22T20:30:00',
      aiAnalysis:{ category:'streetlight', confidence:0.85, severity:2, riskScore:4.5, estimatedSize:'1 light unit', impactedPeople:180, suggestedDept:'BESCOM - Electrical', decayPrediction:'Likely to fail completely within 1 week' },
      bounty: {
        cost: 350,
        materials: [
          { name: '1 replacement LED bulb (20W)', cost: 250 },
          { name: '1 pair of rubber safety gloves', cost: 100 }
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
        { event:'reported', timestamp:'2026-06-22T20:30:00', actor:'Vikram Reddy', detail:'Flickering light reported' },
        { event:'ai-analyzed', timestamp:'2026-06-22T20:30:04', actor:'AI Engine', detail:'Severity 2/5' }
      ],
      upvotes:8, comments:2
    },

    // ---- 9 ---- waste, severity 4, in-progress
    { id:'ISS-009', title:'Illegal dumping near Agara Lake', description:'Construction debris and household waste dumped near Agara Lake boundary wall. Environmental hazard.',
      category:'waste', severity:4, status:'in-progress',
      location:{ lat:12.9250, lng:77.6380, address:'Agara Lake Road, HSR Layout', ward:'hsr-layout' },
      reportedBy:{ id:'USR-003', name:'Priya Patel', avatar:'👩‍🏫', trustScore:790 },
      reportedAt:'2026-06-19T09:00:00', updatedAt:'2026-06-22T10:00:00',
      aiAnalysis:{ category:'waste', confidence:0.93, severity:4, riskScore:8.3, estimatedSize:'~30 sq m dump area', impactedPeople:600, suggestedDept:'BBMP - Solid Waste', decayPrediction:'Lake contamination risk — escalate immediately' },
      verifications:[
        { userId:'USR-001', name:'Aarna Sharma', stake:20, verified:true, timestamp:'2026-06-19T10:00:00' },
        { userId:'USR-004', name:'Rahul Menon', stake:15, verified:true, timestamp:'2026-06-19T11:30:00' }
      ],
      timeline:[
        { event:'reported', timestamp:'2026-06-19T09:00:00', actor:'Priya Patel', detail:'Illegal dumping reported near Agara Lake' },
        { event:'ai-analyzed', timestamp:'2026-06-19T09:00:04', actor:'AI Engine', detail:'Severity 4/5 — Environmental hazard' },
        { event:'in-progress', timestamp:'2026-06-22T10:00:00', actor:'BBMP', detail:'Cleanup crew deployed.' }
      ],
      upvotes:72, comments:28
    },

    // ---- 10 ---- road-damage, severity 3, open
    { id:'ISS-010', title:'Road caved in after heavy rain', description:'Section of road has caved in creating a dangerous depression.',
      category:'road-damage', severity:3, status:'open',
      location:{ lat:12.8399, lng:77.6770, address:'Phase 1 Main Road, Electronic City', ward:'electronic-city' },
      reportedBy:{ id:'USR-009', name:'Karthik Nair', avatar:'👨‍🎓', trustScore:580 },
      reportedAt:'2026-06-23T07:00:00', updatedAt:'2026-06-23T07:00:00',
      aiAnalysis:{ category:'road-damage', confidence:0.90, severity:3, riskScore:7.5, estimatedSize:'1.5m × 1m depression', impactedPeople:450, suggestedDept:'BBMP - Road Infrastructure', decayPrediction:'Structural risk — could expand with more rain' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-23T07:00:00', actor:'Karthik Nair', detail:'Road cave-in reported' },
        { event:'ai-analyzed', timestamp:'2026-06-23T07:00:04', actor:'AI Engine', detail:'Severity 3/5' }
      ],
      upvotes:15, comments:4
    },

    // ---- 11 ---- illegal-construction, severity 3, verified
    { id:'ISS-011', title:'Unauthorized building extension blocking footpath', description:'A shop has extended its structure onto the public footpath blocking pedestrian access.',
      category:'illegal-construction', severity:3, status:'verified',
      location:{ lat:12.9969, lng:77.5711, address:'Sampige Road, Malleshwaram', ward:'malleshwaram' },
      reportedBy:{ id:'USR-010', name:'Divya Hegde', avatar:'👩‍🌾', trustScore:520 },
      reportedAt:'2026-06-18T16:00:00', updatedAt:'2026-06-20T11:00:00',
      aiAnalysis:{ category:'illegal-construction', confidence:0.87, severity:3, riskScore:6.5, estimatedSize:'3m × 2m encroachment', impactedPeople:300, suggestedDept:'BBMP - Town Planning', decayPrediction:'Permanent if not addressed within 30 days' },
      verifications:[{ userId:'USR-008', name:'Meera Iyer', stake:10, verified:true, timestamp:'2026-06-18T18:00:00' }],
      timeline:[
        { event:'reported', timestamp:'2026-06-18T16:00:00', actor:'Divya Hegde', detail:'Unauthorized construction reported' },
        { event:'ai-analyzed', timestamp:'2026-06-18T16:00:04', actor:'AI Engine', detail:'Severity 3/5' },
        { event:'verified', timestamp:'2026-06-18T18:00:00', actor:'Meera Iyer', detail:'Verified with 10 trust points' }
      ],
      upvotes:25, comments:9
    },

    // ---- 12 ---- noise, severity 2, open
    { id:'ISS-012', title:'Late-night construction noise', description:'Construction site operating heavy machinery past 10 PM in residential area.',
      category:'noise', severity:2, status:'open',
      location:{ lat:12.9063, lng:77.5857, address:'15th Cross, JP Nagar 6th Phase', ward:'jp-nagar' },
      reportedBy:{ id:'USR-008', name:'Meera Iyer', avatar:'👩‍⚕️', trustScore:620 },
      reportedAt:'2026-06-22T23:15:00', updatedAt:'2026-06-22T23:15:00',
      aiAnalysis:{ category:'noise', confidence:0.82, severity:2, riskScore:5.0, estimatedSize:'N/A — noise complaint', impactedPeople:200, suggestedDept:'KSPCB - Pollution Control', decayPrediction:'Recurring — likely to continue daily' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-22T23:15:00', actor:'Meera Iyer', detail:'Noise pollution reported' },
        { event:'ai-analyzed', timestamp:'2026-06-22T23:15:04', actor:'AI Engine', detail:'Severity 2/5' }
      ],
      upvotes:14, comments:7
    },

    // ---- 13 ---- drainage, severity 5, in-progress
    { id:'ISS-013', title:'Storm drain overflowing into residential colony', description:'Storm drain manhole cover displaced. Sewage water entering houses in 1st Cross.',
      category:'drainage', severity:5, status:'in-progress',
      location:{ lat:12.9200, lng:77.6150, address:'1st Cross, BTM 1st Stage', ward:'btm-layout' },
      reportedBy:{ id:'USR-004', name:'Rahul Menon', avatar:'👨‍💼', trustScore:735 },
      reportedAt:'2026-06-22T05:30:00', updatedAt:'2026-06-23T08:00:00',
      aiAnalysis:{ category:'drainage', confidence:0.95, severity:5, riskScore:9.8, estimatedSize:'Manhole + 100m drainage line', impactedPeople:350, suggestedDept:'BBMP - Storm Water', decayPrediction:'EMERGENCY — disease risk within 24 hours' },
      verifications:[
        { userId:'USR-001', name:'Aarna Sharma', stake:25, verified:true, timestamp:'2026-06-22T06:00:00' },
        { userId:'USR-005', name:'Sneha Kulkarni', stake:20, verified:true, timestamp:'2026-06-22T06:30:00' }
      ],
      timeline:[
        { event:'reported', timestamp:'2026-06-22T05:30:00', actor:'Rahul Menon', detail:'Emergency drainage overflow reported' },
        { event:'ai-analyzed', timestamp:'2026-06-22T05:30:04', actor:'AI Engine', detail:'EMERGENCY Severity 5/5' },
        { event:'escalated', timestamp:'2026-06-22T06:35:00', actor:'AI Engine', detail:'Auto-escalated to BBMP Commissioner' },
        { event:'in-progress', timestamp:'2026-06-23T08:00:00', actor:'BBMP', detail:'Emergency repair underway' }
      ],
      upvotes:95, comments:41
    },

    // ---- 14 ---- air-quality, severity 1, open
    { id:'ISS-014', title:'Dust from construction site', description:'Unpaved construction site generating excessive dust. No water sprinkling observed.',
      category:'air-quality', severity:1, status:'open',
      location:{ lat:12.9500, lng:77.7100, address:'Varthur Road, Near Kundalahalli', ward:'marathahalli' },
      reportedBy:{ id:'USR-007', name:'Arjun Rao', avatar:'👨‍🔬', trustScore:650 },
      reportedAt:'2026-06-23T10:00:00', updatedAt:'2026-06-23T10:00:00',
      aiAnalysis:{ category:'air-quality', confidence:0.80, severity:1, riskScore:3.5, estimatedSize:'Construction site ~500 sq m', impactedPeople:120, suggestedDept:'KSPCB - Pollution Control', decayPrediction:'Ongoing — will persist through construction period' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-23T10:00:00', actor:'Arjun Rao', detail:'Dust pollution reported' },
        { event:'ai-analyzed', timestamp:'2026-06-23T10:00:04', actor:'AI Engine', detail:'Severity 1/5' }
      ],
      upvotes:6, comments:1
    },

    // ---- 15 ---- pothole, severity 3, in-progress
    { id:'ISS-015', title:'Multiple potholes on HAL Airport Road', description:'Series of 4 potholes in a 100 m stretch causing traffic bottleneck.',
      category:'pothole', severity:3, status:'in-progress',
      location:{ lat:12.9600, lng:77.6500, address:'HAL Airport Road, Near Domlur', ward:'indiranagar' },
      reportedBy:{ id:'USR-002', name:'Vikram Reddy', avatar:'👨‍🔧', trustScore:812 },
      reportedAt:'2026-06-17T09:00:00', updatedAt:'2026-06-21T14:00:00',
      aiAnalysis:{ category:'pothole', confidence:0.91, severity:3, riskScore:7.0, estimatedSize:'4 potholes, largest 40 cm', impactedPeople:800, suggestedDept:'BBMP - Road Infrastructure', decayPrediction:'High traffic area — rapid deterioration expected' },
      verifications:[{ userId:'USR-006', name:'Amit Desai', stake:15, verified:true, timestamp:'2026-06-17T11:00:00' }],
      timeline:[
        { event:'reported', timestamp:'2026-06-17T09:00:00', actor:'Vikram Reddy', detail:'Multiple potholes reported' },
        { event:'ai-analyzed', timestamp:'2026-06-17T09:00:04', actor:'AI Engine', detail:'Severity 3/5' },
        { event:'in-progress', timestamp:'2026-06-21T14:00:00', actor:'BBMP', detail:'Resurfacing work started' }
      ],
      upvotes:38, comments:15
    },

    // ---- 16 ---- waste, severity 1, resolved
    { id:'ISS-016', title:'Overflowing bin near Cubbon Park entrance', description:'Public trash bin near the east gate is overflowing.',
      category:'waste', severity:1, status:'resolved',
      location:{ lat:12.9763, lng:77.5929, address:'Cubbon Park East Gate, MG Road', ward:'malleshwaram' },
      reportedBy:{ id:'USR-010', name:'Divya Hegde', avatar:'👩‍🌾', trustScore:520 },
      reportedAt:'2026-06-12T08:00:00', updatedAt:'2026-06-12T17:00:00',
      aiAnalysis:{ category:'waste', confidence:0.90, severity:1, riskScore:3.0, estimatedSize:'Single bin overflow', impactedPeople:100, suggestedDept:'BBMP - Solid Waste', decayPrediction:'Low — routine clearance needed' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-12T08:00:00', actor:'Divya Hegde', detail:'Overflowing bin reported' },
        { event:'resolved', timestamp:'2026-06-12T17:00:00', actor:'BBMP', detail:'Bin cleared and sanitized.' }
      ],
      upvotes:5, comments:1
    },

    // ---- 17 ---- road-damage, severity 4, verified
    { id:'ISS-017', title:'Road surface peeling off on Sarjapur Road', description:'Large section of road surface has peeled off exposing rubble base. High-speed traffic area.',
      category:'road-damage', severity:4, status:'verified',
      location:{ lat:12.9100, lng:77.6600, address:'Sarjapur Road, Near Wipro Junction', ward:'hsr-layout' },
      reportedBy:{ id:'USR-003', name:'Priya Patel', avatar:'👩‍🏫', trustScore:790 },
      reportedAt:'2026-06-20T16:00:00', updatedAt:'2026-06-22T09:00:00',
      aiAnalysis:{ category:'road-damage', confidence:0.93, severity:4, riskScore:8.5, estimatedSize:'10m × 3m strip', impactedPeople:900, suggestedDept:'BBMP - Road Infrastructure', decayPrediction:'Will cause accidents if not barricaded immediately' },
      verifications:[
        { userId:'USR-002', name:'Vikram Reddy', stake:20, verified:true, timestamp:'2026-06-20T18:00:00' },
        { userId:'USR-007', name:'Arjun Rao',    stake:15, verified:true, timestamp:'2026-06-21T08:00:00' }
      ],
      timeline:[
        { event:'reported', timestamp:'2026-06-20T16:00:00', actor:'Priya Patel', detail:'Road damage reported with photo' },
        { event:'ai-analyzed', timestamp:'2026-06-20T16:00:04', actor:'AI Engine', detail:'Severity 4/5 — Safety hazard' },
        { event:'verified', timestamp:'2026-06-20T18:00:00', actor:'Vikram Reddy', detail:'Verified with 20 trust points' }
      ],
      upvotes:42, comments:16
    },

    // ---- 18 ---- streetlight, severity 1, resolved
    { id:'ISS-018', title:'Dim streetlight on 3rd Main', description:'Streetlight emitting very low light, needs bulb replacement.',
      category:'streetlight', severity:1, status:'resolved',
      location:{ lat:12.9350, lng:77.5800, address:'3rd Main, Jayanagar 3rd Block', ward:'jayanagar' },
      reportedBy:{ id:'USR-005', name:'Sneha Kulkarni', avatar:'👩‍🎨', trustScore:710 },
      reportedAt:'2026-06-08T21:00:00', updatedAt:'2026-06-11T14:00:00',
      aiAnalysis:{ category:'streetlight', confidence:0.86, severity:1, riskScore:2.8, estimatedSize:'1 light', impactedPeople:80, suggestedDept:'BESCOM - Electrical', decayPrediction:'Complete failure expected in ~2 weeks' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-08T21:00:00', actor:'Sneha Kulkarni', detail:'Dim streetlight reported' },
        { event:'resolved', timestamp:'2026-06-11T14:00:00', actor:'BESCOM', detail:'LED bulb replaced.' }
      ],
      upvotes:4, comments:1
    },

    // ---- 19 ---- water-leak, severity 2, open
    { id:'ISS-019', title:'Minor pipe leak at Koramangala water tank', description:'Slow but steady drip from overhead water tank pipe connector.',
      category:'water-leak', severity:2, status:'open',
      location:{ lat:12.9380, lng:77.6280, address:'6th Block, Near Forum Mall, Koramangala', ward:'koramangala' },
      reportedBy:{ id:'USR-001', name:'Aarna Sharma', avatar:'👩‍💻', trustScore:847 },
      reportedAt:'2026-06-23T12:00:00', updatedAt:'2026-06-23T12:00:00',
      aiAnalysis:{ category:'water-leak', confidence:0.87, severity:2, riskScore:4.8, estimatedSize:'Connector drip', impactedPeople:60, suggestedDept:'BWSSB - Water Supply', decayPrediction:'Slow worsening — full leak in ~1 month' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-23T12:00:00', actor:'Aarna Sharma', detail:'Minor leak reported' },
        { event:'ai-analyzed', timestamp:'2026-06-23T12:00:04', actor:'AI Engine', detail:'Severity 2/5' }
      ],
      upvotes:3, comments:0
    },

    // ---- 20 ---- other, severity 2, open
    { id:'ISS-020', title:'Damaged speed breaker causing vehicle scraping', description:'Speed breaker near school is too steep and damaging low-clearance vehicles.',
      category:'other', severity:2, status:'open',
      location:{ lat:12.9700, lng:77.7450, address:'Near DPS School, Whitefield', ward:'whitefield' },
      reportedBy:{ id:'USR-006', name:'Amit Desai', avatar:'👨‍🚀', trustScore:680 },
      reportedAt:'2026-06-23T08:30:00', updatedAt:'2026-06-23T08:30:00',
      aiAnalysis:{ category:'other', confidence:0.78, severity:2, riskScore:5.0, estimatedSize:'Speed breaker ~3m wide', impactedPeople:250, suggestedDept:'BBMP - General', decayPrediction:'Ongoing — needs redesign' },
      verifications:[],
      timeline:[
        { event:'reported', timestamp:'2026-06-23T08:30:00', actor:'Amit Desai', detail:'Damaged speed breaker reported' },
        { event:'ai-analyzed', timestamp:'2026-06-23T08:30:04', actor:'AI Engine', detail:'Severity 2/5' }
      ],
      upvotes:9, comments:3
    }
  ],

  // ---------- Analytics / Dashboard ----------
  analytics: {
    monthlyTrend:    [42, 38, 55, 61, 48, 52],
    monthLabels:     ['Jan','Feb','Mar','Apr','May','Jun'],
    resolutionRates: [65, 68, 71, 73, 70, 73],
    categoryBreakdown: { pothole:28, 'water-leak':18, streetlight:15, waste:22, 'road-damage':8, drainage:12, other:9 },
    wardComparison: [
      { ward:'Koramangala',  reported:47, resolved:34 },
      { ward:'Indiranagar',  reported:38, resolved:30 },
      { ward:'HSR Layout',   reported:52, resolved:35 },
      { ward:'BTM Layout',   reported:55, resolved:38 },
      { ward:'Whitefield',   reported:41, resolved:28 }
    ],
    predictions: [
      { area:'HSR Layout',   prediction:'Expect 3× waterlogging reports this week due to monsoon forecast', severity:'high',   category:'drainage' },
      { area:'Koramangala',  prediction:'Road on 80 Feet Rd deteriorating — predicted pothole in 2 weeks',  severity:'medium', category:'pothole' },
      { area:'BTM Layout',   prediction:'Waste accumulation spike expected near market area this weekend',   severity:'medium', category:'waste' },
      { area:'Whitefield',   prediction:'4 streetlights in Sector 5 nearing end-of-life (installed 2019)',   severity:'low',    category:'streetlight' }
    ],
    totalSaved: '12.4L'
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
  return { totalIssues: 1247, resolved: 891, activeHeroes: 3420, moneySaved: '₹12.4L' };
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
      { name: 'Quick-set asphalt patch bag', baseCost: 350 },
      { name: '1 heavy hand tamper tool', baseCost: 200 },
      { name: '1 steel wire brush cleaner', baseCost: 100 }
    ],
    'waste': [
      { name: 'Heavy duty waste bags (10-pack)', baseCost: 120 },
      { name: '1 high-grade sweeping broom', baseCost: 150 },
      { name: '1 safety picker & gloves kit', baseCost: 100 }
    ],
    'streetlight': [
      { name: 'Standard LED fixture bulb', baseCost: 200 },
      { name: 'Universal screw fuse unit', baseCost: 80 }
    ],
    'road-damage': [
      { name: '1 bag premix patching repair', baseCost: 400 },
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

