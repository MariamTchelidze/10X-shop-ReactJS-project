import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity: number) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, quantity: number): boolean => {
    if (!Number.isInteger(quantity) || quantity < 1 || product.stock < 1) {
      return false;
    }

    const currentItem = items.find((item) => item.productId === product.id);
    const currentQuantity = currentItem?.quantity ?? 0;
    const nextQuantity = Math.min(currentQuantity + quantity, product.stock);

    if (nextQuantity === currentQuantity) {
      return false;
    }

    const cartItem: CartItem = {
      productId: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      quantity: nextQuantity,
    };

    setItems((currentItems) => {
      if (currentItem) {
        return currentItems.map((item) =>
          item.productId === product.id ? cartItem : item,
        );
      }

      return [...currentItems, cartItem];
    });

    return true;
  };

  const removeItem = (productId: number): void => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item,
      ),
    );
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.price * (1 - item.discountPercentage / 100) * item.quantity,
    0,
  );
  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
