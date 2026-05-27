export type SystemConfigCategory =
  | 'booking'
  | 'fee'
  | 'payment'
  | 'session'
  | 'dispute';

export type SystemConfigValueType =
  | 'number'
  | 'boolean'
  | 'string';

export interface AdminSystemConfig {
  key: string;
  category: SystemConfigCategory;
  label: string;
  description: string;
  valueType: SystemConfigValueType;
  value: unknown;
  defaultValue: unknown;
  editable: boolean;
  displayOrder: number;
  updatedAt: string;
}

export interface SystemConfigsListResponse {
  items: AdminSystemConfig[];
}

/** Grouped by category, sorted by displayOrder within each group. */
export type GroupedSystemConfigs = Map<SystemConfigCategory, AdminSystemConfig[]>;

/** The raw shape returned by the API (may contain nesting variants). */
export interface RawSystemConfig {
  key?: string;
  category?: string;
  label?: string;
  description?: string;
  valueType?: string;
  value?: unknown;
  defaultValue?: unknown;
  editable?: boolean;
  displayOrder?: number;
  updatedAt?: string;
}

export interface UpdateSystemConfigBody {
  value: unknown;
}
