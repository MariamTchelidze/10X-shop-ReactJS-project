export const CATALOG_PAGE_SIZE = 12;

export type CatalogSortOption =
  | ""
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "title-asc";

export interface CatalogQuery {
  q: string;
  category: string;
  sort: CatalogSortOption;
  page: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export function isCatalogSortOption(value: string): value is CatalogSortOption {
  return ["", "price-asc", "price-desc", "rating-desc", "title-asc"].includes(value);
}
