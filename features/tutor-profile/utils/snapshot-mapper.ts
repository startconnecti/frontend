import { TutorProfileSnapshotCertification } from '../types';

export interface DraftSnapshotPayload {
  profile: {
    bio: string;
    experience_text: string;
    years_of_experience: number;
    hourly_rate: number;
  };
  subject_ids: string[];
  certifications: TutorProfileSnapshotCertification[];
}

export function buildTutorProfileSnapshotPayload(
  payload: DraftSnapshotPayload,
  requestNote?: string
): FormData {
  const formData = new FormData();
  const tempKeys = new Set<string>();

  // 1. Validate Certifications and Strip Files
  const cleanCertifications = (payload.certifications || []).map((cert, index) => {
    // E. No empty certification names.
    if (!cert.name || cert.name.trim() === '') {
      throw new Error(`Certification at index ${index} must have a name.`);
    }

    // C. No duplicate tempFileKey values.
    if (cert.tempFileKey) {
      if (tempKeys.has(cert.tempFileKey)) {
        throw new Error(`Duplicate file key detected: ${cert.tempFileKey}`);
      }
      tempKeys.add(cert.tempFileKey);
    }

    // A. Every certification with tempFileKey MUST have matching File.
    if (cert.tempFileKey && !cert.file) {
      throw new Error(`Certification "${cert.name}" has a file key but is missing the actual file.`);
    }

    // B. No uploaded File exists without matching certification tempFileKey.
    if (cert.file && !cert.tempFileKey) {
      throw new Error(`Certification "${cert.name}" has a file but is missing the file key.`);
    }

    // Strip the File object from the JSON payload (it's sent separately as FormData).
    // When a new file is being uploaded (tempFileKey set), omit the old URL fields
    // so the backend doesn't accidentally read a stale URL.
    // When no new file, preserve both URL fields for backward compat.
    // Strip `fileUrl` to conform to backend validation.
    const { file, fileUrl, ...certBase } = cert;
    const cleanCert = certBase.tempFileKey
      ? { ...certBase, certificateUrl: undefined }
      : certBase;

    // Append file to FormData if valid
    if (file && cleanCert.tempFileKey) {
      formData.append(cleanCert.tempFileKey, file);
    }

    return cleanCert;
  });

  // D. No duplicate certification ids.
  const certIds = new Set<string>();
  cleanCertifications.forEach(cert => {
    if (cert.id) {
      if (certIds.has(cert.id)) {
        throw new Error(`Duplicate certification ID detected: ${cert.id}`);
      }
      certIds.add(cert.id);
    }
  });

  // 2. Construct clean JSON payload matching exact backend schema
  const snapshotJson = {
    profile: {
      bio: payload.profile?.bio || '',
      experience_text: payload.profile?.experience_text || '',
      years_of_experience: Number(payload.profile?.years_of_experience) || 0,
      hourly_rate: Number(payload.profile?.hourly_rate) || 0,
    },
    subject_ids: Array.isArray(payload.subject_ids) ? payload.subject_ids : [],
    certifications: cleanCertifications,
  };

  formData.append('snapshotJson', JSON.stringify(snapshotJson));

  if (requestNote && requestNote.trim() !== '') {
    formData.append('request_note', requestNote.trim());
  }

  return formData;
}
