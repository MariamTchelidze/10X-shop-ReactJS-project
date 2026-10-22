import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { readOrders } from "../../utils/orders";
import { formatPrice } from "../../utils/product";

export function OrdersPage() {
  const { user } = useAuth();
  const [orders] = useState(() => readOrders().filter((order) => order.username === user.username));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-8 border-b border-zara-border pb-5 font-editorial text-3xl text-zara-black sm:text-4xl">My orders</h1>
      {orders.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-zara-gray">You have no orders yet.</p>
          <Link to="/" className="mt-5 inline-flex min-h-11 items-center bg-zara-black px-6 text-xs uppercase tracking-widest text-zara-white">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <details key={order.id} className="border border-zara-border p-4 sm:p-6">
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4">
                <span className="min-w-0"><span className="block text-xs uppercase tracking-widest text-zara-gray">Order {order.id}</span><span className="mt-2 block text-sm text-zara-black">{new Date(order.date).toLocaleDateString()}</span></span>
                <span className="rounded-full border border-zara-border px-3 py-1 text-[10px] uppercase tracking-widest">{order.status}</span>
                <span className="text-sm font-medium">{formatPrice(order.total)}</span>
              </summary>
              <ul className="mt-5 divide-y divide-zara-border border-t border-zara-border">
                {order.items.map((item) => <li key={item.productId} className="flex justify-between gap-4 py-3 text-sm"><span className="min-w-0 text-zara-gray">{item.title} × {item.quantity}</span><span className="shrink-0">{formatPrice(item.price * (1 - item.discountPercentage / 100) * item.quantity)}</span></li>)}
              </ul>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}
