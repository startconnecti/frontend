import { TutorAvailability } from './types';

export const MOCK_TUTOR_AVAILABILITY: TutorAvailability = {
  timezone: 'UTC+7 (Ho Chi Minh City)',
  slots: [
    { id: '1', dayOfWeek: 'monday', startTime: '09:00', endTime: '11:00', isActive: true },
    { id: '2', dayOfWeek: 'monday', startTime: '14:00', endTime: '16:00', isActive: true },
    { id: '3', dayOfWeek: 'tuesday', startTime: '10:00', endTime: '12:00', isActive: true },
    { id: '4', dayOfWeek: 'wednesday', startTime: '09:00', endTime: '11:00', isActive: true },
    { id: '5', dayOfWeek: 'thursday', startTime: '15:00', endTime: '17:00', isActive: true },
    { id: '6', dayOfWeek: 'friday', startTime: '09:00', endTime: '11:00', isActive: true },
  ],
};
