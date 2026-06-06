import { TutorOnboardingAvailability } from '../types';

export function validateWeeklyAvailability(
  availabilities: TutorOnboardingAvailability[]
): {
  valid: boolean;
  overlappingIndexes: number[];
} {
  const overlappingIndexes = new Set<number>();

  const slotsWithIndices = availabilities.map((slot, index) => ({
    ...slot,
    originalIndex: index,
  }));

  // Group by day of week
  const groupedByDay: Record<string, typeof slotsWithIndices> = {};

  slotsWithIndices.forEach((slot) => {
    const day = slot.dayOfWeek.toLowerCase();
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    groupedByDay[day].push(slot);
  });

  // Check overlaps for each day
  Object.values(groupedByDay).forEach((slots) => {
    // Sort by start time
    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (let i = 0; i < slots.length - 1; i++) {
      const current = slots[i];
      const next = slots[i + 1];

      if (current.endTime > next.startTime) {
        overlappingIndexes.add(current.originalIndex);
        overlappingIndexes.add(next.originalIndex);

        // Also check if current overlaps with subsequent slots
        for (let j = i + 2; j < slots.length; j++) {
          const future = slots[j];
          if (current.endTime > future.startTime) {
            overlappingIndexes.add(future.originalIndex);
          } else {
            break;
          }
        }
      }
    }
  });

  return {
    valid: overlappingIndexes.size === 0,
    overlappingIndexes: Array.from(overlappingIndexes),
  };
}
