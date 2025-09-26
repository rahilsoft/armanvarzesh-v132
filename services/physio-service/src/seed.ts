import fetch from 'node-fetch';
const API = process.env.API || 'http://localhost:4061';
(async ()=>{
  const res = await fetch(`${API}/physio/seed`, {
    method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify({
      protocols: [{
        id: 'proto-knee-basic',
        name: 'Knee Basic',
        area: 'knee',
        weeks: 4,
        steps: [
          { id:'s1', week:1, day:1, exerciseId:'quad-set', seconds:30 },
          { id:'s2', week:1, day:3, exerciseId:'bridge', seconds:30 }
        ]
      }]
    })
  });
  console.log('seed:', await res.text());
})();
