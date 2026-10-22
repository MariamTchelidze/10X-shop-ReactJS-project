interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

type PageToken = number | "start-ellipsis" | "end-ellipsis";

function getPageTokens(page: number, totalPages: number): PageToken[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const firstVisible = Math.max(2, page - 1);
  const lastVisible = Math.min(totalPages - 1, page + 1);
  const tokens: PageToken[] = [1];

  if (firstVisible > 2) {
    tokens.push("start-ellipsis");
  }

  for (let current = firstVisible; current <= lastVisible; current += 1) {
    tokens.push(current);
  }

  if (lastVisible < totalPages - 1) {
    tokens.push("end-ellipsis");
  }

  tokens.push(totalPages);
  return tokens;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const tokens = getPageTokens(page, totalPages);
  const buttonClass = "inline-flex min-h-10 min-w-10 items-center justify-center text-xs text-zara-gray transition-colors hover:text-zara-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zara-black disabled:cursor-not-allowed disabled:text-zara-border";

  return (
    <nav aria-label="Catalog pages" className="mt-10 flex flex-wrap items-center justify-center gap-1 sm:mt-14 sm:gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={buttonClass}
      >
        Previous
      </button>
      {tokens.map((token) => {
        if (typeof token !== "number") {
          return (
            <span key={token} aria-hidden="true" className="inline-flex min-h-10 min-w-5 items-center justify-center text-zara-gray">
              …
            </span>
          );
        }

        return (
          <button
            key={token}
            type="button"
            aria-label={`Page ${token}`}
            aria-current={page === token ? "page" : undefined}
            onClick={() => onChange(token)}
            className={`${buttonClass} ${page === token ? "bg-zara-black text-zara-white hover:text-zara-white" : ""}`}
          >
            {token}
          </button>
        );
      })}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={buttonClass}
      >
        Next
      </button>
    </nav>
  );
}
