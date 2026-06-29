// Lightweight reservation shape used by reminder/scheduler flows.
export interface Reservation {
  id: number | string;
  userId: number;
  slotId: number | string;
  startTime: Date | string;
}

export const __stub = true;
