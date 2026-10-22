import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { discountedPrice, formatPrice } from "../../utils/product";

export function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const { addToast } = useToast();
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const applyPromoCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (promoInput.trim().toUpperCase() !== "10X10") {
      setPromoApplied(false);
      setPromoError("This promo code is not valid.");
      addToast("INVALID PROMO CODE", "error");
      return;
    }
    setPromoApplied(true);
    setPromoError("");
    addToast("PROMO CODE APPLIED (-10%)", "success");
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-editorial text-3xl text-zara-black">Your cart is empty</h1>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-12 items-center bg-zara-black px-8 text-xs uppercase tracking-[0.14em] text-zara-white transition-colors hover:bg-zara-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="mb-8 border-b border-zara-border pb-5 font-editorial text-3xl text-zara-black sm:mb-10 sm:text-4xl">
        Your cart
      </h1>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <ul className="divide-y divide-zara-border">
          {items.map((item) => {
            const unitPrice = discountedPrice(item.price, item.discountPercentage);

            return (
              <li key={item.productId} className="flex gap-4 py-5 sm:gap-6">
                <Link to={`/products/${item.productId}`} className="w-24 shrink-0 bg-zara-light sm:w-32">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    width={300}
                    height={400}
                    className="aspect-[3/4] h-full w-full object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <Link to={`/products/${item.productId}`} className="text-sm font-medium text-zara-black hover:underline">
                      {item.title}
                    </Link>
                    <p className="mt-2 text-sm text-zara-gray">{formatPrice(unitPrice)} each</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="mt-3 text-xs uppercase tracking-[0.12em] text-zara-gray underline underline-offset-4 hover:text-zara-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                    <div className="flex min-h-10 items-center border border-zara-border">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.title} quantity`}
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="min-h-10 min-w-10 text-lg text-zara-black disabled:text-zara-border"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.title} quantity`}
                        disabled={item.quantity >= item.stock}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="min-h-10 min-w-10 text-lg text-zara-black disabled:text-zara-border"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-medium text-zara-black">
                      {formatPrice(unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit border border-zara-border p-5 sm:p-6">
          <h2 className="font-editorial text-2xl text-zara-black">Order summary</h2>
          <div className="mt-6 flex justify-between gap-4 text-sm text-zara-gray">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <form onSubmit={applyPromoCode} className="mt-6">
            <label htmlFor="promo-code" className="mb-2 block text-xs uppercase tracking-[0.12em] text-zara-gray">
              Promo code
            </label>
            <div className="flex min-w-0 gap-2">
              <input
                id="promo-code"
                name="promoCode"
                value={promoInput}
                onChange={(event) => {
                  setPromoInput(event.target.value);
                  setPromoError("");
                }}
                aria-invalid={promoError.length > 0}
                aria-describedby={promoError ? "promo-error" : undefined}
                placeholder="Enter code"
                className="min-h-11 min-w-0 flex-1 border border-zara-border px-3 text-sm uppercase text-zara-black placeholder:normal-case placeholder:text-zara-gray focus:border-zara-black focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-11 shrink-0 border border-zara-black px-4 text-xs font-medium uppercase tracking-[0.12em] text-zara-black transition-colors hover:bg-zara-black hover:text-zara-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zara-black"
              >
                Apply
              </button>
            </div>
            {promoError && <p id="promo-error" role="alert" className="mt-2 text-xs text-red-700">{promoError}</p>}
          </form>
          {promoApplied && (
            <div className="mt-4 flex justify-between gap-4 text-sm text-zara-gray">
              <span>Promo discount (10%)</span>
              <span>−{formatPrice(discount)}</span>
            </div>
          )}
          <div className="mt-4 flex justify-between gap-4 border-t border-zara-border pt-4 text-sm font-medium text-zara-black">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 flex min-h-12 items-center justify-center bg-zara-black px-5 text-center text-xs uppercase tracking-[0.12em] text-zara-white transition-colors hover:bg-zara-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
