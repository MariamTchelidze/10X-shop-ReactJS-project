import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../api/products";
import { CatalogToolbar } from "../../components/CatalogToolbar/CatalogToolbar";
import { Pagination } from "../../components/Pagination/Pagination";
import { ProductGrid } from "../../components/ProductGrid/ProductGrid";
import {
  CATALOG_PAGE_SIZE,
  isCatalogSortOption,
  type CatalogQuery,
  type CatalogSortOption,
} from "../../types/catalog";
import type { Product } from "../../types/product";

const SEARCH_DEBOUNCE_MS = 400;

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const routeState = location.state as { focusSearch?: boolean } | null;
  const focusSearch = routeState?.focusSearch === true;
  const query = searchParams.get("q")?.trim() ?? "";
  const rawCategory = searchParams.get("category") ?? "";
  const category = query ? "" : rawCategory;
  const rawSort = searchParams.get("sort") ?? "";
  const sort: CatalogSortOption = isCatalogSortOption(rawSort) ? rawSort : "";
  const rawPage = Number(searchParams.get("page"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const hasInvalidSort = rawSort !== "" && !isCatalogSortOption(rawSort);
    const needsPage = searchParams.get("page") !== String(page);
    const hasConflictingFilters = Boolean(query && rawCategory);

    if (!needsPage && !hasInvalidSort && !hasConflictingFilters) {
      return;
    }

    setSearchParams(
      (current) => {
        current.set("page", String(page));
        if (hasInvalidSort) {
          current.delete("sort");
        }
        if (query && rawCategory) {
          current.delete("category");
        }
        return current;
      },
      { replace: true },
    );
  }, [page, query, rawCategory, rawSort, searchParams, setSearchParams]);

  useEffect(() => {
    const normalizedInput = searchInput.trim();
    if (normalizedInput === query) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSearchParams(
        (current) => {
          if (normalizedInput) {
            current.set("q", normalizedInput);
            current.delete("category");
          } else {
            current.delete("q");
          }
          current.set("page", "1");
          return current;
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [query, searchInput, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const params: CatalogQuery = { q: query, category, sort, page };

    const loadProducts = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchProducts(params, controller.signal);
        if (!controller.signal.aborted) {
          const lastPage = Math.max(
            1,
            Math.ceil(response.total / CATALOG_PAGE_SIZE),
          );
          if (page > lastPage) {
            setSearchParams(
              (current) => {
                current.set("page", String(lastPage));
                return current;
              },
              { replace: true },
            );
            return;
          }
          setProducts(response.products);
          setTotal(response.total);
        }
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
  }, [category, page, query, retryCount, setSearchParams, sort]);

  const totalPages = Math.ceil(total / CATALOG_PAGE_SIZE);
  const firstResult = total === 0 ? 0 : (page - 1) * CATALOG_PAGE_SIZE + 1;
  const lastResult = Math.min(page * CATALOG_PAGE_SIZE, total);

  const handleCategoryChange = (value: string): void => {
    setSearchInput("");
    setSearchParams((current) => {
      current.delete("q");
      if (value) {
        current.set("category", value);
      } else {
        current.delete("category");
      }
      current.set("page", "1");
      return current;
    });
  };

  const handleSortChange = (value: CatalogSortOption): void => {
    setSearchParams((current) => {
      if (value) {
        current.set("sort", value);
      } else {
        current.delete("sort");
      }
      current.set("page", "1");
      return current;
    });
  };

  const handlePageChange = (nextPage: number): void => {
    const boundedPage = Math.min(Math.max(1, nextPage), Math.max(1, totalPages));
    setSearchParams((current) => {
      current.set("page", String(boundedPage));
      return current;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = (): void => {
    setSearchInput("");
    setSearchParams({ page: "1" });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-7 flex items-end justify-between gap-4 border-b border-zara-border pb-5 sm:mb-8">
        <h1 className="font-editorial text-3xl text-zara-black sm:text-4xl">Catalog</h1>
        {!isLoading && !error && (
          <p className="text-right text-[10px] uppercase tracking-[0.12em] text-zara-gray sm:text-xs">
            {total === 0 ? "0 items" : `Showing ${firstResult}–${lastResult} of ${total}`}
          </p>
        )}
      </header>

      <CatalogToolbar
        focusSearch={focusSearch}
        searchValue={searchInput}
        category={category}
        sort={sort}
        onSearchChange={setSearchInput}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />

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
        <section className="py-16 text-center">
          <p className="text-sm text-zara-gray">No products found.</p>
          {(query || category || sort) && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-xs uppercase tracking-[0.14em] text-zara-black underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </section>
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <ProductGrid products={products} />
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </>
      )}
    </main>
  );
}
