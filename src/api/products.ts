import type { Product, ProductsResponse } from "../types/product";
import type { CatalogQuery, Category } from "../types/catalog";
import { CATALOG_PAGE_SIZE } from "../types/catalog";

const API_BASE = "https://dummyjson.com";

export async function fetchProducts(
  query: CatalogQuery,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const page = Math.max(1, Math.floor(query.page));
  const searchParams = new URLSearchParams();

  if (query.q) {
    searchParams.set("q", query.q);
  }
  searchParams.set("limit", String(CATALOG_PAGE_SIZE));
  searchParams.set("skip", String((page - 1) * CATALOG_PAGE_SIZE));

  const sortConfig = getSortConfig(query.sort);
  if (sortConfig) {
    searchParams.set("sortBy", sortConfig.sortBy);
    searchParams.set("order", sortConfig.order);
  }

  const endpoint = query.q
    ? "/products/search"
    : query.category
      ? `/products/category/${encodeURIComponent(query.category)}`
      : "/products";
  const response = await fetch(`${API_BASE}${endpoint}?${searchParams.toString()}`, { signal });

  if (!response.ok) {
    throw new Error(`Unable to load products (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as ProductsResponse;
  return { ...data, products: sortProducts(data.products, query.sort) };
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/products/categories`, { signal });

  if (!response.ok) {
    throw new Error(`Unable to load categories (HTTP ${response.status}).`);
  }

  return (await response.json()) as Category[];
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal,
): Promise<Product | null> {
  const response = await fetch(`https://dummyjson.com/products/${id}`, { signal });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to load this product (HTTP ${response.status}).`);
  }

  return (await response.json()) as Product;
}

interface SortConfig {
  sortBy: "price" | "rating" | "title";
  order: "asc" | "desc";
}

function getSortConfig(sort: CatalogQuery["sort"]): SortConfig | null {
  switch (sort) {
    case "price-asc":
      return { sortBy: "price", order: "asc" };
    case "price-desc":
      return { sortBy: "price", order: "desc" };
    case "rating-desc":
      return { sortBy: "rating", order: "desc" };
    case "title-asc":
      return { sortBy: "title", order: "asc" };
    case "":
      return null;
  }
}

function sortProducts(products: Product[], sort: CatalogQuery["sort"]): Product[] {
  return [...products].sort((first, second) => {
    switch (sort) {
      case "price-asc":
        return first.price - second.price;
      case "price-desc":
        return second.price - first.price;
      case "rating-desc":
        return second.rating - first.rating;
      case "title-asc":
        return first.title.localeCompare(second.title);
      case "":
        return 0;
    }
  });
}
