import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navClass = ({ isActive }: { isActive: boolean }): string =>
  `text-xs uppercase tracking-[0.12em] transition-colors hover:text-zara-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black ${isActive ? "text-zara-black" : "text-zara-gray"}`;

export function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-zara-border bg-zara-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 text-sm font-semibold tracking-[0.2em] text-zara-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
        >
          10X SHOP
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-6">
          <NavLink to="/" end className={navClass}>
            Catalog
          </NavLink>
          <NavLink to="/cart" className={navClass}>
            <span className="inline-flex items-center gap-1.5">
              Cart
              {itemCount > 0 && (
                <span
                  aria-label={`${itemCount} items`}
                  className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-zara-black px-1 text-[10px] text-zara-white"
                >
                  {itemCount}
                </span>
              )}
            </span>
          </NavLink>
          {user.isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs uppercase tracking-[0.12em] text-zara-gray transition-colors hover:text-zara-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
            >
              Log out
            </button>
          ) : (
            <NavLink to="/login" className={navClass}>
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
