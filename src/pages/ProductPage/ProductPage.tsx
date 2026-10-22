import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { fetchProductById, fetchProducts } from "../../api/products";
import { useCart } from "../../context/CartContext";
import type { Product, Review } from "../../types/product";
import { discountedPrice, formatPrice } from "../../utils/product";

export function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const isValidId = Number.isInteger(productId) && productId > 0;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { addItem } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    setQuantity(1);
    setCartMessage(null);

    if (!isValidId) {
      setProduct(null);
      setError(null);
      setIsLoading(false);
      return () => controller.abort();
    }

    const loadProduct = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchProductById(productId, controller.signal);
        if (!controller.signal.aborted) {
          setProduct(result);
        }
      } catch (reason: unknown) {
        if (!controller.signal.aborted) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Something went wrong while loading this product.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProduct();
    return () => controller.abort();
  }, [isValidId, productId]);

  useEffect(() => {
    if (!product) return;
    const reviewKey = `10x-shop-reviews-${product.id}`;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(reviewKey) ?? "[]");
      setReviews([...product.reviews, ...(Array.isArray(saved) ? saved as Review[] : [])]);
    } catch {
      setReviews(product.reviews);
    }

    const controller = new AbortController();
    void fetchProducts({ q: "", category: product.category, sort: "", page: 1 }, controller.signal)
      .then((response) => setRelatedProducts(response.products.filter((entry) => entry.id !== product.id).slice(0, 4)))
      .catch(() => setRelatedProducts([]));
    return () => controller.abort();
  }, [product]);

  const handleReviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reviewerName = reviewName.trim();
    const comment = reviewComment.trim();
    if (!reviewerName || !comment || !product) return;
    const review: Review = { reviewerName, comment, rating: reviewRating, date: new Date().toISOString() };
    const nextReviews = [...reviews, review];
    setReviews(nextReviews);
    localStorage.setItem(`10x-shop-reviews-${product.id}`, JSON.stringify(nextReviews.slice(product.reviews.length)));
    setReviewName("");
    setReviewComment("");
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-zara-gray" role="status">
        Loading product…
      </main>
    );
  }

  if (!isValidId || (!error && product === null)) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-editorial text-3xl text-zara-black">Page not found</h1>
        <p className="mt-3 text-sm text-zara-gray">The product you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-zara-black underline">
          Back to catalog
        </Link>
      </main>
    );
  }

  if (error || product === null) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center" role="alert">
        <p className="text-sm text-zara-gray">{error ?? "Unable to load this product."}</p>
        <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-zara-black underline">
          Back to catalog
        </Link>
      </main>
    );
  }

  const price = discountedPrice(product.price, product.discountPercentage);
  const stockMessage =
    product.stock === 0
      ? "Out of stock"
      : product.stock <= 5
        ? `Only ${product.stock} left!`
        : "In stock";
  const stockColor = product.stock > 0 && product.stock <= 5 ? "text-amber-700" : "text-zara-gray";

  const handleAddToCart = (): void => {
    const added = addItem(product, quantity);
    setCartMessage(
      added ? "Added to cart." : "Your cart already contains the available stock.",
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link to="/" className="mb-6 inline-block text-xs uppercase tracking-[0.14em] text-zara-gray hover:text-zara-black">
        ← Back to catalog
      </Link>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="bg-zara-light">
          <img
            src={product.thumbnail}
            alt={product.title}
            width={900}
            height={1100}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
        <section className="flex flex-col items-start py-2 md:py-8">
          <p className="text-xs uppercase tracking-[0.16em] text-zara-gray">{product.category}</p>
          <h1 className="mt-3 font-editorial text-3xl text-zara-black sm:text-4xl">{product.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-base text-zara-black">{formatPrice(price)}</p>
            {product.discountPercentage > 0 && (
              <>
                <p className="text-sm text-zara-gray line-through">{formatPrice(product.price)}</p>
                <span className="text-xs text-zara-gray">−{Math.round(product.discountPercentage)}%</span>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-zara-black" aria-label={`Rated ${product.rating} out of 5`}>
              ★ {product.rating.toFixed(1)}
            </span>
            <span className={stockColor}>{stockMessage}</span>
          </div>
          <p className="mt-6 max-w-prose text-sm leading-6 text-zara-gray">{product.description}</p>

          <div className="mt-8 flex min-h-12 items-center border border-zara-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1 || product.stock === 0}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="min-h-12 min-w-12 text-lg text-zara-black disabled:text-zara-border"
            >
              −
            </button>
            <span className="min-w-10 text-center text-sm" aria-live="polite">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= product.stock || product.stock === 0}
              onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
              className="min-h-12 min-w-12 text-lg text-zara-black disabled:text-zara-border"
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className="mt-4 min-h-12 w-full max-w-sm bg-zara-black px-6 text-xs font-medium uppercase tracking-[0.14em] text-zara-white transition-colors hover:bg-zara-gray disabled:cursor-not-allowed disabled:bg-zara-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
          >
            {product.stock === 0 ? "Out of stock" : "Add to cart"}
          </button>
          {cartMessage && <p className="mt-3 text-sm text-zara-gray" role="status">{cartMessage}</p>}
        </section>
      </div>
      <section className="mt-14 border-t border-zara-border pt-10 sm:mt-20" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="font-editorial text-2xl text-zara-black">Reviews <span className="font-sans text-sm text-zara-gray">({reviews.length})</span></h2>
        <ul className="mt-6 divide-y divide-zara-border">
          {reviews.map((review, index) => (
            <li key={`${review.date}-${index}`} className="py-5">
              <div className="flex flex-wrap justify-between gap-2"><span className="text-sm font-medium text-zara-black">{review.reviewerName}</span><span className="text-sm text-zara-gray" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span></div>
              <p className="mt-2 text-sm leading-6 text-zara-gray">{review.comment}</p>
              <time className="mt-2 block text-xs text-zara-gray" dateTime={review.date}>{new Date(review.date).toLocaleDateString()}</time>
            </li>
          ))}
        </ul>
        <form onSubmit={handleReviewSubmit} className="mt-8 grid gap-4 sm:max-w-xl">
          <h3 className="text-xs font-medium uppercase tracking-widest">Write a review</h3>
          <label className="grid gap-2 text-xs uppercase tracking-widest text-zara-gray" htmlFor="review-name">Name<input id="review-name" required value={reviewName} onChange={(event) => setReviewName(event.target.value)} className="min-h-11 border border-zara-border px-3 text-sm normal-case tracking-normal text-zara-black" /></label>
          <label className="grid gap-2 text-xs uppercase tracking-widest text-zara-gray" htmlFor="review-rating">Rating<select id="review-rating" value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))} className="min-h-11 border border-zara-border bg-white px-3 text-sm tracking-normal text-zara-black">{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label>
          <label className="grid gap-2 text-xs uppercase tracking-widest text-zara-gray" htmlFor="review-comment">Review<input id="review-comment" required value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} className="min-h-11 border border-zara-border px-3 text-sm normal-case tracking-normal text-zara-black" /></label>
          <button type="submit" className="min-h-12 bg-zara-black px-6 text-xs uppercase tracking-widest text-zara-white sm:w-fit">Submit review</button>
        </form>
      </section>
      {relatedProducts.length > 0 && (
        <section className="mt-14 border-t border-zara-border pt-10 sm:mt-20" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-editorial text-2xl text-zara-black">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {relatedProducts.map((related) => (
              <Link key={related.id} to={`/products/${related.id}`} className="group min-w-0">
                <img src={related.thumbnail} alt={related.title} loading="lazy" className="aspect-[3/4] w-full bg-zara-light object-cover" />
                <h3 className="mt-3 truncate text-xs text-zara-black group-hover:underline">{related.title}</h3>
                <p className="mt-1 text-xs text-zara-gray">{formatPrice(discountedPrice(related.price, related.discountPercentage))}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
