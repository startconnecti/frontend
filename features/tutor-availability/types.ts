export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  isActive: boolean;
}

export interface TutorAvailability {
  slots: AvailabilitySlot[];
  timezone: string;
}

export interface UpdateAvailabilityRequest {
  slots: AvailabilitySlot[];
}
