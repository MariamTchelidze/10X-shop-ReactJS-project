import { BrowserRouter, Route, Routes } from "react-router";

function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">10X Shop</h1>
      <p className="mt-3 text-slate-600">Your catalog will be here soon.</p>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
    </main>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
