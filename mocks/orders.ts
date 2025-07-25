import { Order } from '@/types/index';

export const orders: Order[] = [
  {
    id: '1001',
    restaurantId: '1',
    restaurantName: 'Burger Palace',
    items: [
      {
        id: '10001',
        menuItem: {
          id: '101',
          restaurantId: '1',
          name: 'Classic Cheeseburger',
          description: 'Juicy beef patty with melted cheddar, lettuce, tomato, and special sauce',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'Burgers',
          popular: true
        },
        quantity: 1,
        totalPrice: 8.99
      },
      {
        id: '10002',
        menuItem: {
          id: '104',
          restaurantId: '1',
          name: 'French Fries',
          description: 'Crispy golden fries with sea salt',
          price: 3.99,
          image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'Sides',
          popular: true
        },
        quantity: 1,
        totalPrice: 3.99
      }
    ],
    status: 'delivered',
    total: 12.98,
    deliveryFee: 2.99,
    tax: 1.30,
    grandTotal: 17.27,
    createdAt: '2023-06-15T14:30:00Z',
    estimatedDeliveryTime: '15-25 min',
    deliveryAddress: {
      id: '1',
      label: 'Home',
      street: '123 Main St',
      apt: 'Apt 4B',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      isDefault: true
    },
    paymentMethod: {
      id: '1',
      type: 'credit',
      last4: '4242',
      expiryDate: '04/25',
      isDefault: true
    }
  },
  {
    id: '1002',
    restaurantId: '2',
    restaurantName: 'Pizza Heaven',
    items: [
      {
        id: '10003',
        menuItem: {
          id: '201',
          restaurantId: '2',
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and basil',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'Pizzas',
          popular: true
        },
        quantity: 1,
        totalPrice: 12.99
      }
    ],
    status: 'delivering',
    total: 12.99,
    deliveryFee: 3.99,
    tax: 1.30,
    grandTotal: 18.28,
    createdAt: '2023-06-18T18:45:00Z',
    estimatedDeliveryTime: '20-30 min',
    deliveryAddress: {
      id: '1',
      label: 'Home',
      street: '123 Main St',
      apt: 'Apt 4B',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      isDefault: true
    },
    paymentMethod: {
      id: '1',
      type: 'credit',
      last4: '4242',
      expiryDate: '04/25',
      isDefault: true
    }
  },
  {
    id: '1003',
    restaurantId: '3',
    restaurantName: 'Sushi Express',
    items: [
      {
        id: '10004',
        menuItem: {
          id: '301',
          restaurantId: '3',
          name: 'California Roll',
          description: 'Crab, avocado, and cucumber roll',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'Rolls',
          popular: true
        },
        quantity: 2,
        totalPrice: 17.98
      },
      {
        id: '10005',
        menuItem: {
          id: '305',
          restaurantId: '3',
          name: 'Miso Soup',
          description: 'Traditional Japanese soup with tofu and seaweed',
          price: 3.99,
          image: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'Sides'
        },
        quantity: 1,
        totalPrice: 3.99
      }
    ],
    status: 'preparing',
    total: 21.97,
    deliveryFee: 4.99,
    tax: 2.20,
    grandTotal: 29.16,
    createdAt: '2023-06-20T19:15:00Z',
    estimatedDeliveryTime: '25-35 min',
    deliveryAddress: {
      id: '1',
      label: 'Home',
      street: '123 Main St',
      apt: 'Apt 4B',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      isDefault: true
    },
    paymentMethod: {
      id: '2',
      type: 'debit',
      last4: '9876',
      expiryDate: '12/24',
      isDefault: false
    }
  }
];