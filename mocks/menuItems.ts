import { MenuItem } from '@/types/index';

export const menuItems: MenuItem[] = [
  // Burger Palace (id: 1)
  {
    id: '101',
    restaurantId: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar, lettuce, tomato, and special sauce',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Burgers',
    popular: true,
    options: [
      {
        id: '1001',
        name: 'Patty Type',
        choices: [
          { id: '10001', name: 'Beef', price: 0 },
          { id: '10002', name: 'Turkey', price: 1 },
          { id: '10003', name: 'Veggie', price: 1 }
        ],
        required: true
      },
      {
        id: '1002',
        name: 'Add-ons',
        choices: [
          { id: '10004', name: 'Bacon', price: 1.5 },
          { id: '10005', name: 'Extra Cheese', price: 1 },
          { id: '10006', name: 'Avocado', price: 2 }
        ],
        multiple: true
      }
    ]
  },
  {
    id: '102',
    restaurantId: '1',
    name: 'Double Bacon Burger',
    description: 'Two beef patties with crispy bacon, cheddar cheese, and BBQ sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Burgers',
    popular: true
  },
  {
    id: '103',
    restaurantId: '1',
    name: 'Crispy Chicken Sandwich',
    description: 'Crispy fried chicken breast with pickles and special sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Sandwiches'
  },
  {
    id: '104',
    restaurantId: '1',
    name: 'French Fries',
    description: 'Crispy golden fries with sea salt',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Sides',
    popular: true
  },
  {
    id: '105',
    restaurantId: '1',
    name: 'Onion Rings',
    description: 'Crispy battered onion rings',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Sides'
  },
  {
    id: '106',
    restaurantId: '1',
    name: 'Chocolate Milkshake',
    description: 'Rich and creamy chocolate milkshake',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Drinks'
  },

  // Pizza Heaven (id: 2)
  {
    id: '201',
    restaurantId: '2',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Pizzas',
    popular: true,
    options: [
      {
        id: '2001',
        name: 'Size',
        choices: [
          { id: '20001', name: 'Small (10")', price: 0 },
          { id: '20002', name: 'Medium (12")', price: 2 },
          { id: '20003', name: 'Large (14")', price: 4 }
        ],
        required: true
      },
      {
        id: '2002',
        name: 'Crust',
        choices: [
          { id: '20004', name: 'Thin', price: 0 },
          { id: '20005', name: 'Regular', price: 0 },
          { id: '20006', name: 'Thick', price: 1 }
        ],
        required: true
      }
    ]
  },
  {
    id: '202',
    restaurantId: '2',
    name: 'Pepperoni Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and pepperoni',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Pizzas',
    popular: true
  },
  {
    id: '203',
    restaurantId: '2',
    name: 'Vegetarian Pizza',
    description: 'Pizza with tomato sauce, mozzarella, bell peppers, mushrooms, and olives',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Pizzas'
  },
  {
    id: '204',
    restaurantId: '2',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Sides'
  },
  {
    id: '205',
    restaurantId: '2',
    name: 'Caesar Salad',
    description: 'Romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Salads'
  },

  // Sushi Express (id: 3)
  {
    id: '301',
    restaurantId: '3',
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber roll',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Rolls',
    popular: true
  },
  {
    id: '302',
    restaurantId: '3',
    name: 'Spicy Tuna Roll',
    description: 'Spicy tuna and cucumber roll',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Rolls',
    popular: true
  },
  {
    id: '303',
    restaurantId: '3',
    name: 'Salmon Nigiri',
    description: 'Fresh salmon over rice',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Nigiri',
    popular: true
  },
  {
    id: '304',
    restaurantId: '3',
    name: 'Tuna Sashimi',
    description: 'Sliced fresh tuna',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Sashimi'
  },
  {
    id: '305',
    restaurantId: '3',
    name: 'Miso Soup',
    description: 'Traditional Japanese soup with tofu and seaweed',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Sides'
  }
];