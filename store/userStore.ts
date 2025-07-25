import { orders as mockOrders } from '@/mocks/orders';
import { user as mockUser } from '@/mocks/user';
import { Address, Order, PaymentMethod, User } from '@/types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  user: User | null;
  orders: Order[];
  isLoggedIn: boolean;
  
  // Auth actions
  login: () => void;
  logout: () => void;
  
  // User profile actions
  updateUserProfile: (userData: Partial<User>) => void;
  
  // Address actions
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (addressId: string, addressData: Partial<Address>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  
  // Payment method actions
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (paymentMethodId: string, paymentData: Partial<PaymentMethod>) => void;
  removePaymentMethod: (paymentMethodId: string) => void;
  setDefaultPaymentMethod: (paymentMethodId: string) => void;
  
  // Order actions
  addOrder: (order: Omit<Order, 'id'>) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      isLoggedIn: false,
      
      login: () => {
        // In a real app, this would make an API call
        // For now, we'll use mock data
        set({
          user: mockUser,
          orders: mockOrders,
          isLoggedIn: true
        });
      },
      
      logout: () => {
        set({
          user: null,
          orders: [],
          isLoggedIn: false
        });
      },
      
      updateUserProfile: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
      
      addAddress: (address) => {
        const { user } = get();
        if (user) {
          const newAddress: Address = {
            ...address,
            id: Date.now().toString()
          };
          
          // If this is the first address or marked as default, update other addresses
          const updatedAddresses = user.addresses.map(addr => ({
            ...addr,
            isDefault: address.isDefault ? false : addr.isDefault
          }));
          
          set({
            user: {
              ...user,
              addresses: [...updatedAddresses, newAddress]
            }
          });
        }
      },
      
      updateAddress: (addressId, addressData) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.map(address => {
            if (address.id === addressId) {
              return { ...address, ...addressData };
            }
            
            // If this address is being set as default, update other addresses
            if (addressData.isDefault && address.id !== addressId) {
              return { ...address, isDefault: false };
            }
            
            return address;
          });
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses
            }
          });
        }
      },
      
      removeAddress: (addressId) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.filter(address => address.id !== addressId);
          
          // If we removed the default address, set a new default if possible
          if (user.addresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
            updatedAddresses[0].isDefault = true;
          }
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses
            }
          });
        }
      },
      
      setDefaultAddress: (addressId) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.map(address => ({
            ...address,
            isDefault: address.id === addressId
          }));
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses
            }
          });
        }
      },
      
      addPaymentMethod: (paymentMethod) => {
        const { user } = get();
        if (user) {
          const newPaymentMethod: PaymentMethod = {
            ...paymentMethod,
            id: Date.now().toString()
          };
          
          // If this is the first payment method or marked as default, update other payment methods
          const updatedPaymentMethods = user.paymentMethods.map(method => ({
            ...method,
            isDefault: paymentMethod.isDefault ? false : method.isDefault
          }));
          
          set({
            user: {
              ...user,
              paymentMethods: [...updatedPaymentMethods, newPaymentMethod]
            }
          });
        }
      },
      
      updatePaymentMethod: (paymentMethodId, paymentData) => {
        const { user } = get();
        if (user) {
          const updatedPaymentMethods = user.paymentMethods.map(method => {
            if (method.id === paymentMethodId) {
              return { ...method, ...paymentData };
            }
            
            // If this method is being set as default, update other methods
            if (paymentData.isDefault && method.id !== paymentMethodId) {
              return { ...method, isDefault: false };
            }
            
            return method;
          });
          
          set({
            user: {
              ...user,
              paymentMethods: updatedPaymentMethods
            }
          });
        }
      },
      
      removePaymentMethod: (paymentMethodId) => {
        const { user } = get();
        if (user) {
          const updatedPaymentMethods = user.paymentMethods.filter(method => method.id !== paymentMethodId);
          
          // If we removed the default method, set a new default if possible
          if (user.paymentMethods.find(method => method.id === paymentMethodId)?.isDefault && updatedPaymentMethods.length > 0) {
            updatedPaymentMethods[0].isDefault = true;
          }
          
          set({
            user: {
              ...user,
              paymentMethods: updatedPaymentMethods
            }
          });
        }
      },
      
      setDefaultPaymentMethod: (paymentMethodId) => {
        const { user } = get();
        if (user) {
          const updatedPaymentMethods = user.paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === paymentMethodId
          }));
          
          set({
            user: {
              ...user,
              paymentMethods: updatedPaymentMethods
            }
          });
        }
      },
      
      addOrder: (orderData) => {
        const { orders } = get();
        const newOrder: Order = {
          ...orderData,
          id: Date.now().toString()
        };
        
        set({ orders: [newOrder, ...orders] });
      },
      
      getOrderById: (orderId) => {
        const { orders } = get();
        return orders.find(order => order.id === orderId);
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        orders: state.orders,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
);