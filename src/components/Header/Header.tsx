import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const categoryLinks = [
  { label: "WOMEN", slug: "womens-dresses" },
  { label: "MEN", slug: "mens-shirts" },
  { label: "TEEN", slug: "tops" },
  { label: "KIDS", slug: "sports-accessories" },
  { label: "HOME", slug: "home-decoration" },
] as const;

function getCategoryHref(pathname: string, search: string, slug: string): string {
  const params = new URLSearchParams(pathname === "/" ? search : "");
  params.delete("q");
  params.set("category", slug);
  params.set("page", "1");
  return `/?${params.toString()}`;
}

function CategoryLinks({ mobile = false }: { mobile?: boolean }) {
  const location = useLocation();
  const currentCategory = new URLSearchParams(location.search).get("category");

  return (
    <nav
      aria-label="Shop by category"
      className={`flex items-center ${mobile ? "w-max gap-7 px-4" : "gap-5 lg:gap-7"}`}
    >
      {categoryLinks.map((category) => {
        const isActive =
          location.pathname === "/" && currentCategory === category.slug;

        return (
          <Link
            key={category.label}
            to={getCategoryHref(location.pathname, location.search, category.slug)}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex min-h-10 shrink-0 items-center border-b-2 text-[10px] font-medium tracking-[0.16em] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zara-black sm:text-xs ${isActive ? "border-zara-black text-zara-black" : "border-transparent text-zara-gray"}`}
          >
            {category.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = user.fullName || user.email || user.username;

  const handleSearchClick = (): void => {
    if (location.pathname === "/") {
      document.getElementById("catalog-search")?.focus();
      return;
    }

    navigate("/", { state: { focusSearch: true } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zara-border bg-zara-white">
      <div className="mx-auto grid min-h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-6 lg:min-h-20 lg:px-10">
        <div className="min-w-0">
          <div className="hidden lg:block">
            <CategoryLinks />
          </div>
          <button
            type="button"
            onClick={handleSearchClick}
            className="text-[10px] font-medium tracking-[0.14em] text-zara-gray transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black sm:text-xs lg:hidden"
          >
            SEARCH
          </button>
        </div>

        <Link
          to="/"
          className="justify-self-center whitespace-nowrap font-sans text-sm font-bold tracking-[0.24em] text-zara-black transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black sm:text-base sm:tracking-[0.3em] lg:text-lg"
        >
          10X SHOP
        </Link>

        <div className="flex items-center justify-self-end gap-3 sm:gap-5 lg:gap-7">
          <button
            type="button"
            onClick={handleSearchClick}
            className="hidden text-xs font-medium tracking-[0.12em] text-zara-gray transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black lg:inline-flex"
          >
            SEARCH
          </button>
          {user.isLoggedIn ? (
            <Link
              to="/profile"
              aria-label={`Profile for ${displayName}`}
              className="max-w-20 truncate text-[10px] font-medium tracking-[0.12em] text-zara-gray transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black sm:max-w-32 sm:text-xs"
            >
              {displayName || "PROFILE"}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-medium tracking-[0.12em] text-zara-gray transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black sm:text-xs"
            >
              LOG IN
            </Link>
          )}
          <Link
            to="/cart"
            aria-label={itemCount > 0 ? `Bag, ${itemCount} items` : "Bag"}
            className="inline-flex min-h-10 items-center gap-1.5 text-[10px] font-medium tracking-[0.12em] text-zara-gray transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black sm:text-xs"
          >
            BAG
            <span className="inline-flex min-w-4 justify-center text-zara-black">
              {itemCount > 0 ? itemCount : ""}
            </span>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-zara-border lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CategoryLinks mobile />
      </div>
    </header>
  );
}
