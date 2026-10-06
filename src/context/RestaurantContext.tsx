import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  db,
  cleanForFirestore,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  Order,
  OrderStatus,
  WaiterCall,
  WaiterCallType,
  InventoryItem,
  RestaurantSettings,
  CartItem,
  Dish,
} from '../types';
import { INITIAL_DISHES, INITIAL_SETTINGS } from '../data/menuData';
import { playNewOrderChime, playOrderReadyChime } from '../lib/audio';

interface RestaurantContextType {
  // Client Table & Cart
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemsCount: number;

  // Active Client Order
  activeTableOrder: Order | null;
  submitClientOrder: (customerNotes?: string) => Promise<string>;
  submitOrderPayment: (
    paymentMethod: 'apple_pay' | 'card' | 'cash' | 'tpe_waiter',
    tipAmount: number,
    tipPercentage: number,
    splitWays: number
  ) => Promise<void>;
  submitFeedback: (orderId: string, rating: number, compliments: string[], note?: string) => Promise<void>;
  finishClientService: () => void;

  // Waiter Calls
  callWaiter: (type: WaiterCallType, message?: string) => Promise<void>;
  resolveWaiterCall: (callId: string) => Promise<void>;
  waiterCalls: WaiterCall[];

  // Staff Brigade
  isStaffAuthenticated: boolean;
  staffSection: 'kds' | 'pos' | 'tables' | 'erp';
  setStaffSection: (section: 'kds' | 'pos' | 'tables' | 'erp') => void;
  authenticateStaff: (pin: string) => boolean;
  logoutStaff: () => void;

  // Orders (KDS & POS)
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  createPosOrder: (tableNumber: string, items: CartItem[], paymentMethod?: 'cash' | 'card') => Promise<string>;

  // Catalog & Inventory
  dishes: Dish[];
  inventory: Record<string, InventoryItem>;
  toggleDishStock: (dishId: string) => Promise<void>;
  setDishStockQuantity: (dishId: string, quantity: number) => Promise<void>;

  // Settings
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  // Table state
  const [selectedTable, setSelectedTableState] = useState<string | null>(() => {
    return localStorage.getItem('dineflow_table') || null;
  });

  const setSelectedTable = (table: string | null) => {
    setSelectedTableState(table);
    if (table) {
      localStorage.setItem('dineflow_table', table);
    } else {
      localStorage.removeItem('dineflow_table');
    }
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dineflow_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dineflow_cart', JSON.stringify(cart));
  }, [cart]);

  // Staff authentication
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dineflow_staff_auth') === 'true';
  });
  const [staffSection, setStaffSection] = useState<'kds' | 'pos' | 'tables' | 'erp'>('kds');

  // Operational data from Firestore
  const [orders, setOrders] = useState<Order[]>([]);
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>({});
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);

  // Firestore sync for orders
  useEffect(() => {
    const ordersCol = collection(db, 'orders');
    const unsubscribe = onSnapshot(
      ordersCol,
      (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Order;
          list.push({ ...data, id: docSnap.id });
        });
        // Sort newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(list);
      },
      (error) => {
        console.warn('Realtime orders snapshot fallback:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Firestore sync for waiterCalls
  useEffect(() => {
    const waiterCol = collection(db, 'waiterCalls');
    const unsubscribe = onSnapshot(
      waiterCol,
      (snapshot) => {
        const list: WaiterCall[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as WaiterCall;
          list.push({ ...data, id: docSnap.id });
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setWaiterCalls(list);
      },
      (error) => {
        console.warn('Realtime waiterCalls snapshot fallback:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Firestore sync for inventory
  useEffect(() => {
    const invCol = collection(db, 'inventory');
    const unsubscribe = onSnapshot(
      invCol,
      (snapshot) => {
        const map: Record<string, InventoryItem> = {};
        snapshot.forEach((docSnap) => {
          map[docSnap.id] = docSnap.data() as InventoryItem;
        });
        setInventory(map);
      },
      (error) => {
        console.warn('Realtime inventory snapshot fallback:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Firestore sync for settings
  useEffect(() => {
    const settingsDocRef = doc(db, 'restaurantSettings', 'default');
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as RestaurantSettings);
        } else {
          // seed default settings
          setDoc(settingsDocRef, cleanForFirestore(INITIAL_SETTINGS)).catch((e) =>
            console.warn('Error seeding settings:', e)
          );
        }
      },
      (error) => {
        console.warn('Realtime settings snapshot fallback:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Active table order
  const activeTableOrder = useMemo(() => {
    if (!selectedTable) return null;
    return (
      orders.find(
        (o) =>
          o.tableNumber === selectedTable &&
          ['received', 'in_kitchen', 'ready', 'served'].includes(o.status)
      ) ||
      // Or recently paid order still in checkout feedback view
      orders.find(
        (o) =>
          o.tableNumber === selectedTable &&
          o.status === 'paid' &&
          !o.feedback
      ) ||
      null
    );
  }, [orders, selectedTable]);

  // Cart operations
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const uniqueId = `${item.dishId}-${item.cookingPreference || 'none'}-${(item.selectedAddons || [])
      .map((a) => a.id)
      .sort()
      .join('-')}-${Date.now()}`;

    setCart((prev) => {
      // Check if identical item already exists
      const existingIdx = prev.findIndex(
        (i) =>
          i.dishId === item.dishId &&
          i.cookingPreference === item.cookingPreference &&
          JSON.stringify(i.selectedAddons) === JSON.stringify(item.selectedAddons)
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, { ...item, id: uniqueId }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.id === itemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const addonsCost = (item.selectedAddons || []).reduce((aSum, a) => aSum + a.price, 0);
      return sum + (item.price + addonsCost) * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Client order submission
  const submitClientOrder = async (customerNotes?: string): Promise<string> => {
    if (!selectedTable) throw new Error('Aucune table sélectionnée');
    if (cart.length === 0) throw new Error('Le panier est vide');

    const orderId = `CMD-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const orderItems = cart.map((item) => {
      const addonsCost = (item.selectedAddons || []).reduce((s, a) => s + a.price, 0);
      return {
        dishId: item.dishId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price + addonsCost,
        totalPrice: (item.price + addonsCost) * item.quantity,
        cookingPreference: item.cookingPreference,
        selectedAddons: item.selectedAddons,
        specialInstructions: [item.specialInstructions, customerNotes].filter(Boolean).join(' | '),
      };
    });

    const subtotal = cartSubtotal;
    // Calculation: in French gastronomy, food is 10% (or 5.5%), wines/spirits 20%
    const tva10 = Number((subtotal * 0.10).toFixed(2));
    const tva20 = 0;
    const tva55 = 0;
    const taxTotal = tva10;

    const newOrder: Order = {
      id: orderId,
      tableNumber: selectedTable,
      customerName: `Client ${selectedTable}`,
      status: 'received',
      items: orderItems,
      subtotal,
      taxBreakdown: { tva55, tva10, tva20 },
      taxTotal,
      tipAmount: 0,
      tipPercentage: 0,
      totalAmount: subtotal,
      paymentMethod: 'unpaid',
      paymentStatus: 'pending',
      createdAt: now,
      updatedAt: now,
      origin: 'client_qr',
    };

    const docRef = doc(db, 'orders', orderId);
    try {
      await setDoc(docRef, cleanForFirestore(newOrder));
      playNewOrderChime();
      clearCart();
      return orderId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
    }
  };

  // Payment submission
  const submitOrderPayment = async (
    paymentMethod: 'apple_pay' | 'card' | 'cash' | 'tpe_waiter',
    tipAmount: number,
    tipPercentage: number,
    splitWays = 1
  ) => {
    if (!activeTableOrder) return;
    const orderRef = doc(db, 'orders', activeTableOrder.id);
    const now = new Date().toISOString();

    const totalWithTip = Number((activeTableOrder.subtotal + tipAmount).toFixed(2));

    try {
      await updateDoc(
        orderRef,
        cleanForFirestore({
          tipAmount,
          tipPercentage,
          totalAmount: totalWithTip,
          splitWays,
          paymentMethod,
          paymentStatus: paymentMethod === 'tpe_waiter' ? 'pending' : 'completed',
          status: paymentMethod === 'tpe_waiter' ? activeTableOrder.status : 'paid',
          paidAt: now,
          updatedAt: now,
        })
      );

      if (paymentMethod === 'tpe_waiter') {
        await callWaiter('bill_request', `Addition avec terminal TPE demandée pour table ${selectedTable}`);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${activeTableOrder.id}`);
    }
  };

  // Feedback submission
  const submitFeedback = async (
    orderId: string,
    rating: number,
    compliments: string[],
    note?: string
  ) => {
    const orderRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(
        orderRef,
        cleanForFirestore({
          feedback: {
            rating,
            compliments,
            note: note || '',
            submittedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Finish client service (libérer table)
  const finishClientService = () => {
    setSelectedTable(null);
    clearCart();
  };

  // Waiter calls
  const callWaiter = async (type: WaiterCallType, message?: string) => {
    if (!selectedTable) return;
    const callId = `CALL-${Date.now().toString().slice(-6)}`;
    const docRef = doc(db, 'waiterCalls', callId);

    const callData: WaiterCall = {
      id: callId,
      tableNumber: selectedTable,
      type,
      status: 'pending',
      message: message || '',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(docRef, cleanForFirestore(callData));
      playNewOrderChime();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `waiterCalls/${callId}`);
    }
  };

  const resolveWaiterCall = async (callId: string) => {
    const docRef = doc(db, 'waiterCalls', callId);
    try {
      // Suppression définitive en temps réel de Firestore et de l'écran
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `waiterCalls/${callId}`);
    }
  };

  // Staff authentication
  const authenticateStaff = (pin: string): boolean => {
    // PIN code 1234
    if (pin.trim() === '1234') {
      setIsStaffAuthenticated(true);
      sessionStorage.setItem('dineflow_staff_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutStaff = () => {
    setIsStaffAuthenticated(false);
    sessionStorage.removeItem('dineflow_staff_auth');
  };

  // Order status update (KDS)
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const docRef = doc(db, 'orders', orderId);
    const now = new Date().toISOString();
    const updatePayload: Partial<Order> = {
      status: newStatus,
      updatedAt: now,
    };
    if (newStatus === 'served') {
      updatePayload.servedAt = now;
    }
    if (newStatus === 'ready') {
      playOrderReadyChime();
    }

    try {
      await updateDoc(docRef, cleanForFirestore(updatePayload));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // POS Order creation
  const createPosOrder = async (
    tableNumber: string,
    items: CartItem[],
    paymentMethod: 'cash' | 'card' = 'card'
  ): Promise<string> => {
    const orderId = `POS-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const orderItems = items.map((item) => {
      const addonsCost = (item.selectedAddons || []).reduce((s, a) => s + a.price, 0);
      return {
        dishId: item.dishId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price + addonsCost,
        totalPrice: (item.price + addonsCost) * item.quantity,
        cookingPreference: item.cookingPreference,
        selectedAddons: item.selectedAddons,
        specialInstructions: item.specialInstructions,
      };
    });

    const subtotal = items.reduce((sum, item) => {
      const addonsCost = (item.selectedAddons || []).reduce((s, a) => s + a.price, 0);
      return sum + (item.price + addonsCost) * item.quantity;
    }, 0);

    const tva10 = Number((subtotal * 0.10).toFixed(2));

    const newOrder: Order = {
      id: orderId,
      tableNumber,
      customerName: `Caisse - ${tableNumber}`,
      status: 'received',
      items: orderItems,
      subtotal,
      taxBreakdown: { tva55: 0, tva10, tva20: 0 },
      taxTotal: tva10,
      tipAmount: 0,
      tipPercentage: 0,
      totalAmount: subtotal,
      paymentMethod,
      paymentStatus: 'completed',
      createdAt: now,
      updatedAt: now,
      origin: 'pos_staff',
    };

    const docRef = doc(db, 'orders', orderId);
    try {
      await setDoc(docRef, cleanForFirestore(newOrder));
      playNewOrderChime();
      return orderId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
    }
  };

  // Dishes combined with inventory availability
  const dishes = useMemo(() => {
    return INITIAL_DISHES;
  }, []);

  const toggleDishStock = async (dishId: string) => {
    const current = inventory[dishId];
    const newInStock = current ? !current.inStock : false; // default true if not in db
    const docRef = doc(db, 'inventory', dishId);
    const dish = INITIAL_DISHES.find((d) => d.id === dishId);

    const payload: InventoryItem = {
      dishId,
      dishName: dish?.name || dishId,
      inStock: newInStock,
      stockQuantity: current ? current.stockQuantity : 10,
      dailyStock: current ? current.dailyStock : 25,
      category: dish?.category || 'all',
    };

    try {
      await setDoc(docRef, cleanForFirestore(payload));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `inventory/${dishId}`);
    }
  };

  const setDishStockQuantity = async (dishId: string, quantity: number) => {
    const current = inventory[dishId];
    const docRef = doc(db, 'inventory', dishId);
    const dish = INITIAL_DISHES.find((d) => d.id === dishId);

    const payload: InventoryItem = {
      dishId,
      dishName: dish?.name || dishId,
      inStock: quantity > 0,
      stockQuantity: Math.max(0, quantity),
      dailyStock: current ? current.dailyStock : 25,
      category: dish?.category || 'all',
    };

    try {
      await setDoc(docRef, cleanForFirestore(payload));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `inventory/${dishId}`);
    }
  };

  const updateSettings = async (newSettings: Partial<RestaurantSettings>) => {
    const docRef = doc(db, 'restaurantSettings', 'default');
    const updated = { ...settings, ...newSettings };
    try {
      await setDoc(docRef, cleanForFirestore(updated));
      setSettings(updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'restaurantSettings/default');
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        selectedTable,
        setSelectedTable,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartItemsCount,
        activeTableOrder,
        submitClientOrder,
        submitOrderPayment,
        submitFeedback,
        finishClientService,
        callWaiter,
        resolveWaiterCall,
        waiterCalls,
        isStaffAuthenticated,
        staffSection,
        setStaffSection,
        authenticateStaff,
        logoutStaff,
        orders,
        updateOrderStatus,
        createPosOrder,
        dishes,
        inventory,
        toggleDishStock,
        setDishStockQuantity,
        settings,
        updateSettings,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
