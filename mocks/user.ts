import { User } from '@/types/index';

export const user: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  addresses: [
    {
      id: '1',
      label: 'Home',
      street: '123 Main St',
      apt: 'Apt 4B',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      isDefault: true
    },
    {
      id: '2',
      label: 'Work',
      street: '456 Business Ave',
      city: 'Worktown',
      state: 'CA',
      zipCode: '54321',
      isDefault: false
    }
  ],
  paymentMethods: [
    {
      id: '1',
      type: 'credit',
      last4: '4242',
      expiryDate: '04/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'debit',
      last4: '9876',
      expiryDate: '12/24',
      isDefault: false
    }
  ]
};