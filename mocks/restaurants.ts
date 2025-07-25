import { Restaurant } from '@/types/index';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'American',
    rating: 4.7,
    deliveryTime: '15-25 min',
    deliveryFee: 2.99,
    featured: true,
    address: '123 Main St, Anytown, USA',
    distance: '1.2 mi',
    tags: ['Burgers', 'Fast Food', 'Fries']
  },
  {
    id: '2',
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '20-30 min',
    deliveryFee: 3.99,
    featured: true,
    address: '456 Oak St, Anytown, USA',
    distance: '2.1 mi',
    tags: ['Pizza', 'Italian', 'Pasta']
  },
  {
    id: '3',
    name: 'Sushi Express',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: 4.99,
    featured: true,
    address: '789 Maple St, Anytown, USA',
    distance: '3.0 mi',
    tags: ['Sushi', 'Japanese', 'Healthy']
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Mexican',
    rating: 4.3,
    deliveryTime: '15-25 min',
    deliveryFee: 2.49,
    address: '101 Pine St, Anytown, USA',
    distance: '1.8 mi',
    tags: ['Mexican', 'Tacos', 'Burritos']
  },
  {
    id: '5',
    name: 'Noodle House',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Chinese',
    rating: 4.2,
    deliveryTime: '20-30 min',
    deliveryFee: 3.49,
    address: '202 Cedar St, Anytown, USA',
    distance: '2.5 mi',
    tags: ['Chinese', 'Noodles', 'Dumplings']
  },
  {
    id: '6',
    name: 'Salad Bar',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Healthy',
    rating: 4.6,
    deliveryTime: '15-25 min',
    deliveryFee: 3.99,
    address: '303 Birch St, Anytown, USA',
    distance: '1.5 mi',
    tags: ['Salads', 'Healthy', 'Vegan']
  },
  {
    id: '7',
    name: 'Curry House',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Indian',
    rating: 4.4,
    deliveryTime: '25-35 min',
    deliveryFee: 3.99,
    address: '404 Elm St, Anytown, USA',
    distance: '2.8 mi',
    tags: ['Indian', 'Curry', 'Spicy']
  },
  {
    id: '8',
    name: 'Mediterranean Grill',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Mediterranean',
    rating: 4.7,
    deliveryTime: '20-30 min',
    deliveryFee: 4.49,
    address: '505 Walnut St, Anytown, USA',
    distance: '3.2 mi',
    tags: ['Mediterranean', 'Kebabs', 'Hummus']
  }
];