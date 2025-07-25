export interface Restaurant {
    id: string;
    name: string;
    image: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    deliveryFee: number;
    featured?: boolean;
    address: string;
    distance: string;
    tags: string[];
  }
  
  export interface MenuItem {
    id: string;
    restaurantId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    popular?: boolean;
    options?: MenuItemOption[];
  }
  
  export interface MenuItemOption {
    id: string;
    name: string;
    choices: {
      id: string;
      name: string;
      price: number;
    }[];
    required?: boolean;
    multiple?: boolean;
  }
  
  export interface CartItem {
    id: string;
    menuItem: MenuItem;
    quantity: number;
    selectedOptions?: {
      optionId: string;
      choiceIds: string[];
    }[];
    specialInstructions?: string;
    totalPrice: number;
  }
  
  export interface Order {
    id: string;
    restaurantId: string;
    restaurantName: string;
    items: CartItem[];
    status: 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
    total: number;
    deliveryFee: number;
    tax: number;
    grandTotal: number;
    createdAt: string;
    estimatedDeliveryTime: string;
    deliveryAddress: Address;
    paymentMethod: PaymentMethod;
  }
  
  export interface Address {
    id: string;
    label: string;
    street: string;
    apt?: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
  }
  
  export interface PaymentMethod {
    id: string;
    type: 'credit' | 'debit' | 'paypal' | 'apple' | 'google';
    last4?: string;
    expiryDate?: string;
    isDefault?: boolean;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    addresses: Address[];
    paymentMethods: PaymentMethod[];
  }
  
  export type FilterOptions = {
    cuisine: string[];
    price: string[];
    rating: number | null;
    sortBy: 'popular' | 'rating' | 'deliveryTime' | 'deliveryFee';
  };

  export type Wallet = {
    label: string;
    value: string;
    rate: number;
  };