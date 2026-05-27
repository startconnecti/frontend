import type { AdminSystemConfig, GroupedSystemConfigs, SystemConfigCategory } from '../types';

/**
 * Groups and sorts configs by category and displayOrder.
 * Returns a Map so insertion-order is preserved (important for rendering).
 */
export function groupConfigsByCategory(configs: AdminSystemConfig[]): GroupedSystemConfigs {
  const map = new Map<SystemConfigCategory, AdminSystemConfig[]>();

  for (const config of configs) {
    const existing = map.get(config.category) ?? [];
    map.set(config.category, [...existing, config]);
  }

  // Sort each category's configs by displayOrder
  for (const [category, items] of map.entries()) {
    map.set(
      category,
      [...items].sort((a, b) => a.displayOrder - b.displayOrder)
    );
  }

  return map;
}

/** Human-readable category label. */
export function categoryLabel(category: SystemConfigCategory): string {
  switch (category) {
    case 'booking': return 'Booking';
    case 'fee':     return 'Fees';
    case 'payment': return 'Payment';
    case 'session': return 'Session';
    case 'dispute': return 'Dispute';
  }
}

/** Format an ISO date string for display. */
export function formatConfigDate(iso: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
