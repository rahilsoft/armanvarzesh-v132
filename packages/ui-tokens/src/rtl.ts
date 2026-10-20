export type Direction = 'rtl' | 'ltr';
export type Side = 'left' | 'right';
export const direction: Direction = 'rtl';

/** Map logical start/end to a physical side for the given direction (default RTL). */
export function logicalToPhysical(edge: 'start' | 'end', dir: Direction = direction): Side {
  const startSide: Side = dir === 'rtl' ? 'right' : 'left';
  const endSide: Side = dir === 'rtl' ? 'left' : 'right';
  return edge === 'start' ? startSide : endSide;
}

/** Inverse of logicalToPhysical. */
export function physicalToLogical(side: Side, dir: Direction = direction): 'start' | 'end' {
  return logicalToPhysical('start', dir) === side ? 'start' : 'end';
}

/** Physical margin/padding style from logical values, e.g. logicalSpacing('margin', {start: 8}). */
export function logicalSpacing(
  kind: 'margin' | 'padding',
  v: { start?: number; end?: number },
  dir: Direction = direction,
): Record<string, number> {
  const out: Record<string, number> = {};
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  if (v.start !== undefined) out[kind + cap(logicalToPhysical('start', dir))] = v.start;
  if (v.end !== undefined) out[kind + cap(logicalToPhysical('end', dir))] = v.end;
  return out;
}

export function textAlign(edge: 'start' | 'end', dir: Direction = direction): Side {
  return logicalToPhysical(edge, dir);
}

/** Directional icons (chevrons, arrows) flip in RTL. */
export function flipX(dir: Direction = direction): 1 | -1 {
  return dir === 'rtl' ? -1 : 1;
}
