
export interface StartEgressParams { roomName: string; outputUrl: string; fileType?: 'mp4'; token: string; }
export interface StopEgressParams { egressId: string; token: string; }

// NOTE: In real deployment you will call LiveKit Egress REST API.
// Here we expose interfaces so the subgraph can wire start/stop actions.
export async function startRoomCompositeEgress({ roomName, outputUrl }: StartEgressParams): Promise<{ egressId: string }> {
  // Placeholder: return a pseudo id; real impl should do a fetch() to LiveKit Egress service.
  const egressId = `egress_${Math.random().toString(36).slice(2)}`;
  return { egressId };
}
export async function stopEgress({ egressId }: StopEgressParams): Promise<{ status: 'stopped' }> {
  return { status: 'stopped' };
}
