import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('rashid_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('rashid_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) return;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product === product._id);
      const effectivePrice =
        product.discountPrice > 0 && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + qty;
        const maxStock = product.stock || 99;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            slug: product.slug,
            image: product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            price: effectivePrice,
            originalPrice: product.price,
            stock: product.stock || 50,
            sku: product.sku || '',
            brand: product.brand || '',
            quantity: Math.min(qty, product.stock || 99),
          },
        ];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          const maxStock = item.stock || 99;
          return { ...item, quantity: Math.min(qty, maxStock) };
        }
        return item;
      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('rashid_cart');
  };

  // Aggregated totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Free shipping threshold: $75
  const shipping = subtotal === 0 ? 0 : subtotal >= 75 ? 0 : 10;

  // 5% Sales tax
  const tax = Math.round(subtotal * 0.05 * 100) / 100;

  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        shipping,
        tax,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
