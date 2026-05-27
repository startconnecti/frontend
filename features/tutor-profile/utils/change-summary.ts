import { TutorProfileChangePayload } from '../types';

export interface ChangeSummaryItem {
  label: string;
  value?: string;
}

/**
 * Builds a lightweight, human-readable summary of what changed in a snapshot payload.
 *
 * Strategy: presence-based only — we check whether each field/section exists,
 * NOT whether the value differs from the current profile.
 *
 * Supports both snake_case (API) and camelCase (legacy/FE) field names.
 */
export function buildChangeSummary(
  payload: TutorProfileChangePayload | null | undefined | Record<string, unknown>
): ChangeSummaryItem[] {
  if (!payload || typeof payload !== 'object') return [];

  const summary: ChangeSummaryItem[] = [];
  
  // Since normalization is now fixed at the service layer, 
  // payload is guaranteed to be the actual flat changePayload object.
  const profile = (payload as Record<string, unknown>).profile as Record<string, unknown> | undefined;

  if (profile && typeof profile === 'object') {
    // Bio
    if (profile.bio) {
      summary.push({ label: 'Bio updated' });
    }

    // Hourly rate
    const hourlyRate = profile.hourly_rate ?? profile.hourlyRate;
    if (hourlyRate !== undefined && hourlyRate !== null) {
      const rateNum = Number(hourlyRate);
      if (!isNaN(rateNum)) {
        summary.push({ 
          label: 'Hourly rate updated', 
          value: `${rateNum.toLocaleString('en-US')}₫/hour` 
        });
      }
    }

    // Years of experience
    const years = profile.years_of_experience ?? profile.yearsOfExperience;
    if (years !== undefined && years !== null) {
      const yearNum = Number(years);
      if (!isNaN(yearNum)) {
        summary.push({ 
          label: 'Experience updated', 
          value: `${yearNum} year${yearNum === 1 ? '' : 's'}` 
        });
      }
    }

    // Experience text
    const expText = profile.experience_text ?? profile.experienceText;
    if (expText) {
      summary.push({ label: 'Teaching experience updated' });
    }
  }

  // Subjects
  const subjectIds = Array.isArray((payload as Record<string, unknown>).subject_ids) 
    ? (payload as Record<string, unknown>).subject_ids as unknown[] 
    : [];
  const subjects = Array.isArray((payload as Record<string, unknown>).subjects) 
    ? (payload as Record<string, unknown>).subjects as unknown[] 
    : [];
  const totalSubjects = Math.max(subjectIds.length, subjects.length);
  
  if (totalSubjects > 0) {
    summary.push({ 
      label: 'Subjects updated', 
      value: `${totalSubjects} subject${totalSubjects === 1 ? '' : 's'}` 
    });
  }

  // Certifications
  const certifications = Array.isArray((payload as Record<string, unknown>).certifications) 
    ? (payload as Record<string, unknown>).certifications as unknown[] 
    : [];
  if (certifications.length > 0) {
    summary.push({ 
      label: 'Certifications updated', 
      value: `${certifications.length} certificate${certifications.length === 1 ? '' : 's'}` 
    });
  }

  return summary;
}
