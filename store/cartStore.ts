import { CartItem, MenuItem } from '@/types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  
  // Actions
  addToCart: (menuItem: MenuItem, quantity: number, selectedOptions?: any[], specialInstructions?: string) => void;
  updateCartItem: (cartItemId: string, quantity: number, selectedOptions?: any[], specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  
  // Computed
  totalItems: number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,
      totalItems: 0,
      
      addToCart: (menuItem, quantity, selectedOptions = [], specialInstructions = '') => {
        const { items, restaurantId } = get();
        
        // If cart has items from a different restaurant, clear it first
        if (restaurantId && restaurantId !== menuItem.restaurantId) {
          set({
            items: [],
            restaurantId: null,
            restaurantName: null,
            totalItems: 0
          });
        }
        
        // Calculate total price including options
        let totalPrice = menuItem.price * quantity;
        
        if (selectedOptions && selectedOptions.length > 0) {
          selectedOptions.forEach(option => {
            option.choiceIds.forEach((choiceId: string) => {
              const choice = menuItem.options?.find(opt => opt.id === option.optionId)?.choices.find(c => c.id === choiceId);
              if (choice) {
                totalPrice += choice.price * quantity;
              }
            });
          });
        }
        
        // Create new cart item
        const newItem: CartItem = {
          id: Date.now().toString(),
          menuItem,
          quantity,
          selectedOptions,
          specialInstructions,
          totalPrice
        };
        
        const newItems = [...items, newItem];
        const newTotalItems = newItems.reduce((total, item) => total + item.quantity, 0);
        
        set({
          items: newItems,
          restaurantId: menuItem.restaurantId,
          restaurantName: menuItem.name, // This should be restaurant name, but we'll fix it when adding to cart
          totalItems: newTotalItems
        });
      },
      
      updateCartItem: (cartItemId, quantity, selectedOptions, specialInstructions) => {
        const { items } = get();
        
        const updatedItems = items.map(item => {
          if (item.id === cartItemId) {
            // Calculate total price including options
            let totalPrice = item.menuItem.price * quantity;
            
            if (selectedOptions && selectedOptions.length > 0) {
              selectedOptions.forEach(option => {
                option.choiceIds.forEach((choiceId: string) => {
                  const choice = item.menuItem.options?.find(opt => opt.id === option.optionId)?.choices.find(c => c.id === choiceId);
                  if (choice) {
                    totalPrice += choice.price * quantity;
                  }
                });
              });
            }
            
            return {
              ...item,
              quantity,
              selectedOptions: selectedOptions || item.selectedOptions,
              specialInstructions: specialInstructions !== undefined ? specialInstructions : item.specialInstructions,
              totalPrice
            };
          }
          return item;
        });
        
        const newTotalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
        
        set({ 
          items: updatedItems,
          totalItems: newTotalItems
        });
      },
      
      removeFromCart: (cartItemId) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== cartItemId);
        
        // If cart is empty, reset restaurant info
        if (updatedItems.length === 0) {
          set({
            items: [],
            restaurantId: null,
            restaurantName: null,
            totalItems: 0
          });
        } else {
          const newTotalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
          set({ 
            items: updatedItems,
            totalItems: newTotalItems
          });
        }
      },
      
      clearCart: () => {
        set({
          items: [],
          restaurantId: null,
          restaurantName: null,
          totalItems: 0
        });
      },
      
      subtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.totalPrice, 0);
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);