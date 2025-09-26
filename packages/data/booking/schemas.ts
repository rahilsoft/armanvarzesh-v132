import { z } from 'zod';
export const BookingCreateSchema = z.object({
  when: z.string().min(1),
  notes: z.string().optional()
});
export type BookingCreateInput = z.infer<typeof BookingCreateSchema>;
export type Booking = { id:string; when:string; notes?:string; status:'scheduled'|'canceled'|'completed' };
