import { Link } from "react-router";
import type { Product } from "../../types/product";
import { discountedPrice, formatPrice } from "../../utils/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const stockMessage =
    product.stock === 0
      ? "Out of stock"
      : product.stock <= 5
        ? `Only ${product.stock} left!`
        : "In stock";
  const stockColor =
    product.stock === 0
      ? "text-zara-gray"
      : product.stock <= 5
        ? "text-amber-700"
        : "text-zara-gray";

  return (
    <Link
      to={`/products/${product.id}`}
      aria-label={`View ${product.title}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
    >
      <article>
        <div className="overflow-hidden bg-zara-light">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            width={600}
            height={800}
            className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="space-y-2 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-sans text-sm font-medium uppercase tracking-wide text-zara-black">
              {product.title}
            </h2>
            <span className={`shrink-0 text-xs ${stockColor}`}>{stockMessage}</span>
          </div>
          <p className="text-xs capitalize tracking-wide text-zara-gray">
            {product.category}
          </p>
          <p className="text-sm text-zara-black">
            {formatPrice(discountedPrice(product.price, product.discountPercentage))}
          </p>
        </div>
      </article>
    </Link>
  );
}
