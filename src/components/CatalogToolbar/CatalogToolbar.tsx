import { useEffect, useState } from "react";
import { fetchCategories } from "../../api/products";
import type { CatalogSortOption, Category } from "../../types/catalog";

interface CatalogToolbarProps {
  searchValue: string;
  category: string;
  sort: CatalogSortOption;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: CatalogSortOption) => void;
}

const sortOptions: { value: CatalogSortOption; label: string }[] = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "title-asc", label: "Name A–Z" },
];

export function CatalogToolbar({
  searchValue,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: CatalogToolbarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async (): Promise<void> => {
      try {
        const result = await fetchCategories(controller.signal);
        if (!controller.signal.aborted) {
          setCategories(result);
        }
      } catch (reason: unknown) {
        if (!controller.signal.aborted) {
          setCategoryError(
            reason instanceof Error ? reason.message : "Unable to load categories.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCategories(false);
        }
      }
    };

    void loadCategories();
    return () => controller.abort();
  }, []);

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:mb-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      <div>
        <label htmlFor="catalog-search" className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-zara-gray">
          Search
        </label>
        <input
          id="catalog-search"
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products"
          className="min-h-11 w-full border-b border-zara-border bg-transparent px-1 text-sm text-zara-black outline-none placeholder:text-zara-gray focus:border-zara-black"
        />
      </div>
      <div>
        <label htmlFor="catalog-category" className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-zara-gray">
          Category
        </label>
        <select
          id="catalog-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          disabled={isLoadingCategories || categories.length === 0}
          className="min-h-11 w-full border-b border-zara-border bg-transparent px-1 text-sm text-zara-black outline-none focus:border-zara-black disabled:text-zara-gray"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        {categoryError && <p className="mt-1 text-xs text-zara-gray" role="status">Categories unavailable</p>}
      </div>
      <div>
        <label htmlFor="catalog-sort" className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-zara-gray">
          Sort by
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as CatalogSortOption)}
          className="min-h-11 w-full border-b border-zara-border bg-transparent px-1 text-sm text-zara-black outline-none focus:border-zara-black"
        >
          {sortOptions.map((option) => (
            <option key={option.value || "default"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
