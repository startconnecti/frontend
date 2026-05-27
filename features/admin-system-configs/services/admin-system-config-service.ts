import { adminApi } from '@/lib/admin-api/client';
import type {
  AdminSystemConfig,
  RawSystemConfig,
  SystemConfigCategory,
  SystemConfigValueType,
  SystemConfigsListResponse,
} from '../types';

// ─── Normalizers ─────────────────────────────────────────────────────────────

const KNOWN_CATEGORIES: SystemConfigCategory[] = ['booking', 'fee', 'payment', 'session', 'dispute'];
const KNOWN_VALUE_TYPES: SystemConfigValueType[] = ['number', 'boolean', 'string'];

function normalizeCategory(raw: string | undefined): SystemConfigCategory {
  const lower = (raw ?? '').toLowerCase() as SystemConfigCategory;
  return KNOWN_CATEGORIES.includes(lower) ? lower : 'booking';
}

function normalizeValueType(raw: string | undefined): SystemConfigValueType {
  const lower = (raw ?? '').toLowerCase() as SystemConfigValueType;
  return KNOWN_VALUE_TYPES.includes(lower) ? lower : 'string';
}

function normalizeConfig(raw: RawSystemConfig): AdminSystemConfig {
  return {
    key: raw.key ?? '',
    category: normalizeCategory(raw.category),
    label: raw.label ?? raw.key ?? '',
    description: raw.description ?? '',
    valueType: normalizeValueType(raw.valueType),
    value: raw.value,
    defaultValue: raw.defaultValue,
    editable: raw.editable ?? false,
    displayOrder: raw.displayOrder ?? 0,
    updatedAt: raw.updatedAt ?? '',
  };
}

/** Unwrap envelope shapes: { data: T }, { items: T[] }, or bare T. */
function unwrapResponse<T>(raw: unknown): T {
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if ('data' in obj) return obj.data as T;
  }
  return raw as T;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const adminSystemConfigService = {
  async getSystemConfigs(category?: SystemConfigCategory): Promise<SystemConfigsListResponse> {
    const params: Record<string, string> = {};
    if (category) params.category = category;

    const raw = await adminApi.get<unknown>('/api/v1/admin/system-configs', { params });
    const unwrapped = unwrapResponse<{ items?: RawSystemConfig[] } | RawSystemConfig[]>(raw);

    let rawItems: RawSystemConfig[];
    if (Array.isArray(unwrapped)) {
      rawItems = unwrapped;
    } else if (unwrapped && typeof unwrapped === 'object' && 'items' in unwrapped) {
      rawItems = (unwrapped as { items?: RawSystemConfig[] }).items ?? [];
    } else {
      rawItems = [];
    }

    return {
      items: rawItems.map(normalizeConfig),
    };
  },

  async getSystemConfig(key: string): Promise<AdminSystemConfig> {
    const raw = await adminApi.get<unknown>(`/api/v1/admin/system-configs/${encodeURIComponent(key)}`);
    const unwrapped = unwrapResponse<RawSystemConfig>(raw);
    return normalizeConfig(unwrapped);
  },

  async updateSystemConfig(key: string, value: unknown): Promise<AdminSystemConfig> {
    const raw = await adminApi.patch<unknown>(
      `/api/v1/admin/system-configs/${encodeURIComponent(key)}`,
      { value }
    );
    const unwrapped = unwrapResponse<RawSystemConfig>(raw);
    return normalizeConfig(unwrapped);
  },
};
