export type UUID = string;
export type ISO = string;

export type PhysioProtocol = {
  id: UUID;
  name: string;
  area: string;
  weeks: number;
  steps: PhysioStep[];
};

export type PhysioStep = {
  id: UUID;
  week: number;
  day: number;
  exerciseId: string;
  notes?: string;
  seconds?: number;
  videoUrl?: string;
};

export type PainLog = {
  id: UUID;
  sessionId: UUID;
  score: number; // 0..10
  notes?: string;
  createdAt: ISO;
};

export type RomMeasure = {
  id: UUID;
  userId: UUID;
  joint: string;
  side: 'left'|'right'|'bilateral';
  angle: number;
  createdAt: ISO;
};

export type PhysioAssignment = {
  id: UUID;
  userId: UUID;
  protocolId: UUID;
  startedAt: ISO;
  archivedAt?: ISO;
};

export type PhysioSession = {
  id: UUID;
  assignmentId: UUID;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: ISO;
};

export function uid(): UUID {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
