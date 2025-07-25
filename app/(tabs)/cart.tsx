import Button from '@/components/Button';
import CartItem from '@/components/CartItem';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();
  const { items, restaurantId, restaurantName, updateCartItem, removeFromCart, clearCart, subtotal } = useCartStore();
  const { isLoggedIn, user } = useUserStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const deliveryFee = items.length > 0 ? 3.99 : 0;
  const tax = subtotal() * 0.1; // 10% tax
  const total = subtotal() + deliveryFee + tax;
  
  const handleIncrement = (item: any) => {
    updateCartItem(item.id, item.quantity + 1, item.selectedOptions, item.specialInstructions);
  };
  
  const handleDecrement = (item: any) => {
    if (item.quantity > 1) {
      updateCartItem(item.id, item.quantity - 1, item.selectedOptions, item.specialInstructions);
    } else {
      handleRemove(item.id);
    }
  };
  
  const handleRemove = (itemId: string) => {
    if (Platform.OS === 'web') {
      if (confirm('Remove this item from your cart?')) {
        removeFromCart(itemId);
      }
    } else {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(itemId) }
        ]
      );
    }
  };
  
  const handleCheckout = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate checkout process
    setTimeout(() => {
      router.push('/checkout');
      setIsProcessing(false);
    }, 1000);
  };
  
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <EmptyState
          icon={<ShoppingBag size={64} color={Colors.light.secondaryText} />}
          title="Your cart is empty"
          message="Add items from restaurants to start your order"
          buttonTitle="Browse Restaurants"
          onButtonPress={() => router.push('/')}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
        </View>
        
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
            />
          ))}
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal().toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          fullWidth
          loading={isProcessing}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  itemsContainer: {
    padding: 16,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    margin: 16,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
});