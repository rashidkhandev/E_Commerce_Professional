import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('rashid_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('rashid_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Sync with backend if user is logged in
  useEffect(() => {
    const fetchBackendWishlist = async () => {
      if (user) {
        try {
          const res = await API.get('/users/wishlist');
          if (res.data?.success && Array.isArray(res.data.data)) {
            setWishlistItems(res.data.data);
          }
        } catch (e) {
          // Keep local wishlist fallback
        }
      }
    };
    fetchBackendWishlist();
  }, [user]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some((item) => (item._id || item.product || item) === productId);
  };

  const addToWishlist = async (product) => {
    if (!product || !product._id) return;
    if (isInWishlist(product._id)) return;

    setWishlistItems((prev) => [...prev, product]);

    if (user) {
      try {
        await API.post(`/users/wishlist/${product._id}`);
      } catch (e) {
        console.error('Failed to sync wishlist with server', e);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) return;
    setWishlistItems((prev) => prev.filter((item) => (item._id || item.product || item) !== productId));

    if (user) {
      try {
        await API.delete(`/users/wishlist/${productId}`);
      } catch (e) {
        console.error('Failed to remove from server wishlist', e);
      }
    }
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
