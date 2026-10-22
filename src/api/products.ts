import type { Product, ProductsResponse } from "../types/product";

const PRODUCTS_URL = "https://dummyjson.com/products?limit=12&skip=0";

export async function fetchProducts(
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const response = await fetch(PRODUCTS_URL, { signal });

  if (!response.ok) {
    throw new Error(`Unable to load products (HTTP ${response.status}).`);
  }

  return (await response.json()) as ProductsResponse;
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
