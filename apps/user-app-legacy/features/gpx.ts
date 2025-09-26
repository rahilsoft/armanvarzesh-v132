
export async function importGpxToSession(apiBase: string, token: string, sessionId: number, gpx: string, distance: number, elev: number){
  const r = await fetch(`${apiBase}/v1/activities/${sessionId}/route`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ gpx, distance_m: distance, elevation_gain_m: elev }),
  });
  return r.json();
}
