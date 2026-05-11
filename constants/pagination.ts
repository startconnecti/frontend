const DEFAULT_PAGE_SIZE = Number(
  process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE ?? 10
);

export const PAGINATION = {
  DEFAULT_PAGE_SIZE:
    Number.isNaN(DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE <= 0
      ? 10
      : DEFAULT_PAGE_SIZE,
} as const;