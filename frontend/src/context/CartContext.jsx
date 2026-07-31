import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { zones as initialZones } from '../features/customer/data/zones';

const CartContext = createContext(null);
const LOCAL_STORAGE_CART_KEY = 'rasamrat-cart';
const LOCAL_STORAGE_ZONE_KEY = 'rasamrat-zone';
const LOCAL_STORAGE_ALL_ZONES_KEY = 'rasamrat-zones-all';

export const CartProvider = ({ children }) => {
  // Zones list state synced with localStorage
  const [allZones, setAllZones] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ALL_ZONES_KEY);
      return saved ? JSON.parse(saved) : initialZones;
    } catch (e) {
      return initialZones;
    }
  });

  // Only active zones visible to customer
  const activeZones = useMemo(() => {
    const activeOnly = allZones.filter((z) => z.active !== false);
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
      return saved || activeZones[0].id;
    } catch (e) {
      return activeZones[0].id;
    }
  });

  // Sync allZones to localStorage & window custom event
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ALL_ZONES_KEY, JSON.stringify(allZones));
    } catch (e) {
      console.error('Failed to save zones to localStorage', e);
    }
  }, [allZones]);

  // Listen for zone update events across components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_ALL_ZONES_KEY);
        if (saved) {
          setAllZones(JSON.parse(saved));
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rasamrat-zones-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rasamrat-zones-updated', handleStorageChange);
    };
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // Save selected zone to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ZONE_KEY, selectedZoneId);
    } catch (e) {}
  }, [selectedZoneId]);

  const selectedZone = useMemo(() => {
    return activeZones.find((z) => z.id === selectedZoneId) || activeZones[0];
  }, [activeZones, selectedZoneId]);

  const addToCart = (product, qty = 1) => {
    if (product.inStock === false) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const setZone = (zoneId) => {
    setSelectedZoneId(zoneId);
  };

  const updateAllZones = (newZonesList) => {
    setAllZones(newZonesList);
    try {
      localStorage.setItem(LOCAL_STORAGE_ALL_ZONES_KEY, JSON.stringify(newZonesList));
      window.dispatchEvent(new Event('rasamrat-zones-updated'));
    } catch (e) {}
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const minOrderAmount = selectedZone ? (selectedZone.minOrderAmount || selectedZone.minOrder || 100) : 100;
  const deliveryFee = selectedZone ? (selectedZone.deliveryFee || 0) : 0;

  const shortfall = Math.max(0, minOrderAmount - subtotal);
  const isMinOrderMet = subtotal >= minOrderAmount;

  const progressPercent = useMemo(() => {
    if (minOrderAmount <= 0) return 100;
    return Math.min(100, Math.round((subtotal / minOrderAmount) * 100));
  }, [subtotal, minOrderAmount]);

  const grandTotal = subtotal + deliveryFee;

  const totalCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        selectedZoneId,
        selectedZone,
        setZone,
        zones: activeZones,
        allZones,
        updateAllZones,
        deliveryZones: activeZones,
        subtotal,
        totalCount,
        deliveryFee,
        minOrderAmount,
        shortfall,
        isMinOrderMet,
        progressPercent,
        grandTotal,
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
