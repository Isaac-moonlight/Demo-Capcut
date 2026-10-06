export type CookingPreference = 'bleu' | 'saignant' | 'a_point' | 'bien_cuit';

export interface Allergen {
  id: string;
  name: string;
  icon: string;
}

export interface DishAddon {
  id: string;
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  frenchSubtitle?: string;
  description: string;
  price: number;
  category: 'starters' | 'mains' | 'meats' | 'seafood' | 'desserts' | 'wines' | 'cocktails';
  image: string;
  isChefSpecial?: boolean;
  requiresCooking?: boolean;
  availableCooking?: CookingPreference[];
  addons?: DishAddon[];
  allergens: string[]; // list of allergen names
  calories?: number;
  prepTimeMinutes?: number;
  winePairing?: string;
}

export interface CartItem {
  id: string; // unique item cart id
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  cookingPreference?: CookingPreference;
  selectedAddons: DishAddon[];
  specialInstructions?: string;
  image: string;
}

export type OrderStatus = 'received' | 'in_kitchen' | 'ready' | 'served' | 'paid' | 'cancelled';

export interface OrderItem {
  dishId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  cookingPreference?: CookingPreference;
  selectedAddons?: DishAddon[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  taxBreakdown: {
    tva55: number;
    tva10: number;
    tva20: number;
  };
  taxTotal: number;
  tipAmount: number;
  tipPercentage: number;
  totalAmount: number;
  splitWays?: number;
  paymentMethod?: 'apple_pay' | 'card' | 'cash' | 'tpe_waiter' | 'unpaid';
  paymentStatus: 'pending' | 'completed';
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  servedAt?: string;
  paidAt?: string;
  origin: 'client_qr' | 'pos_staff';
  feedback?: {
    rating: number;
    compliments: string[];
    note?: string;
    submittedAt: string;
  };
}

export type WaiterCallType = 'call_waiter' | 'bill_request' | 'water_bread' | 'urgent';

export interface WaiterCall {
  id: string;
  tableNumber: string;
  type: WaiterCallType;
  status: 'pending' | 'handled';
  message?: string;
  createdAt: string;
}

export interface InventoryItem {
  dishId: string;
  dishName: string;
  inStock: boolean; // false = 86 mode (rupture)
  stockQuantity: number;
  dailyStock: number;
  category: string;
}

export interface RestaurantSettings {
  id: string;
  name: string;
  tagline: string;
  siret: string;
  vatNumber: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  tva55Rate: number;
  tva10Rate: number;
  tva20Rate: number;
  chefRewardThreshold: number; // e.g., 60 EUR
  chefRewardDescription: string;
  currency: string;
}
