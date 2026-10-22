import { useEffect, useState } from "react";
import { fetchProducts } from "../../api/products";
import { ProductGrid } from "../../components/ProductGrid/ProductGrid";
import type { Product } from "../../types/product";

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchProducts(controller.signal);
        setProducts(response.products);
        setTotal(response.total);
      } catch (reason: unknown) {
        if (!controller.signal.aborted) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Something went wrong while loading products.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => controller.abort();
  }, [retryCount]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-zara-border pb-5 sm:mb-10">
        <h1 className="font-editorial text-3xl text-zara-black sm:text-4xl">Catalog</h1>
        {!isLoading && !error && products.length > 0 && (
          <p className="text-xs uppercase tracking-[0.12em] text-zara-gray">
            {total} items
          </p>
        )}
      </header>

      {isLoading && (
        <p className="py-16 text-center text-sm text-zara-gray" role="status">
          Loading products…
        </p>
      )}

      {!isLoading && error && (
        <section className="py-16 text-center" role="alert">
          <p className="text-sm text-zara-gray">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-5 border-b border-zara-black pb-1 text-xs uppercase tracking-[0.14em] text-zara-black hover:text-zara-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
          >
            Try again
          </button>
        </section>
      )}

      {!isLoading && !error && products.length === 0 && (
        <p className="py-16 text-center text-sm text-zara-gray">No products found.</p>
      )}

      {!isLoading && !error && products.length > 0 && (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
