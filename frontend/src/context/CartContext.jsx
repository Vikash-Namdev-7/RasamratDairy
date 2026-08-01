import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { deliveryZones as initialZones } from '../features/customer/data/zones';
import zonesApi from '../api/zones.api';

const CartContext = createContext(null);
const LOCAL_STORAGE_CART_KEY = 'rasamrat-cart';
const LOCAL_STORAGE_ZONE_KEY = 'rasamrat-zone';

export const CartProvider = ({ children }) => {
  const [allZones, setAllZones] = useState(initialZones);

  // Fetch real delivery zones from REST API
  useEffect(() => {
    let isMounted = true;
    async function fetchZones() {
      try {
        const res = await zonesApi.getZones();
        if (isMounted && res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAllZones(res.data.data);
        }
      } catch (err) {
        console.warn('Real Zones API offline, using fallback zones dataset in CartContext');
      }
    }
    fetchZones();
    return () => { isMounted = false; };
  }, []);

  // Active zones filter
  const activeZones = useMemo(() => {
    const activeOnly = allZones.filter((z) => z.isActive !== false);
    return activeOnly.length > 0 ? activeOnly : allZones;
  }, [allZones]);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedZoneId, setSelectedZoneId] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ZONE_KEY);
      return saved || (activeZones[0]?.id || activeZones[0]?._id);
    } catch (e) {
      return activeZones[0]?.id || activeZones[0]?._id;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (selectedZoneId) {
        localStorage.setItem(LOCAL_STORAGE_ZONE_KEY, selectedZoneId);
      }
    } catch (e) {
      console.error('Failed to save zone ID to localStorage', e);
    }
  }, [selectedZoneId]);

  const selectedZone = useMemo(() => {
    return (
      activeZones.find((z) => (z.id || z._id) === selectedZoneId) ||
      activeZones[0] ||
      initialZones[0]
    );
  }, [activeZones, selectedZoneId]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const prodId = product.id || product._id;
      const existingItemIndex = prevItems.findIndex((item) => (item.id || item._id) === prodId);

      if (existingItemIndex > -1) {
        const updated = [...prevItems];
        updated[existingItemIndex].qty += qty;
        return updated;
      } else {
        return [...prevItems, { ...product, qty }];
      }
    });
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => ((item.id || item._id) === productId ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item.id || item._id) !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return selectedZone ? selectedZone.deliveryFee : 0;
  }, [cartItems.length, selectedZone]);

  const minOrderAmount = useMemo(() => {
    return selectedZone ? selectedZone.minOrderAmount : 0;
  }, [selectedZone]);

  const isMinOrderMet = useMemo(() => {
    if (cartItems.length === 0) return true;
    return subtotal >= minOrderAmount;
  }, [subtotal, minOrderAmount, cartItems.length]);

  const grandTotal = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return subtotal + deliveryFee;
  }, [subtotal, deliveryFee, cartItems.length]);

  const totalCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.qty, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        zones: activeZones,
        selectedZone,
        selectedZoneId,
        setSelectedZoneId,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        minOrderAmount,
        isMinOrderMet,
        grandTotal,
        totalCount
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

export default CartContext;
