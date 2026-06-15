/**
 * Generates a list of 1-hour time-slot strings from a start/end time range.
 *
 * @example
 * generateHourlySlots("09:00", "17:00")
 * // → ["09:00-10:00", "10:00-11:00", ..., "16:00-17:00"]
 */
export function generateHourlySlots(startTime: string, endTime: string): string[] {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH] = endTime.split(':').map(Number);
  const slots: string[] = [];

  for (let h = startH; h < endH; h++) {
    const from = `${String(h).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    const to = `${String(h + 1).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    slots.push(`${from}-${to}`);
  }

  return slots;
}
