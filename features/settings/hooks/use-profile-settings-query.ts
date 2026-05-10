'use client';

import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../services/settings-service';

export function useProfileSettingsQuery() {
  return useQuery({
    queryKey: ['profile-settings'],
    queryFn: () => settingsService.getProfileSettings(),
  });
}
