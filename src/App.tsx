import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/Header/Header";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { CartPage } from "./pages/CartPage/CartPage";
import { CatalogPage } from "./pages/CatalogPage/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage/CheckoutPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { ProductPage } from "./pages/ProductPage/ProductPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zara-white">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-zara-border px-4 py-6 text-center text-[10px] uppercase tracking-[0.16em] text-zara-gray">
        10X Shop
      </footer>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-editorial text-3xl text-zara-black">Page not found</h1>
      <p className="mt-3 text-zara-gray">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block text-sm text-zara-black underline">
        Go to catalog
      </Link>
    </main>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<CheckoutPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
