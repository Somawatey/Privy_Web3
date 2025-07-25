import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { Stack, useRouter } from 'expo-router';
import { ChevronRight, Clock, CreditCard, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, restaurantId, restaurantName, subtotal, clearCart } = useCartStore();
  const { user, addOrder } = useUserStore();
  
  const [selectedAddress, setSelectedAddress] = useState(
    user?.addresses.find(addr => addr.isDefault) || user?.addresses[0]
  );
  
  const [selectedPayment, setSelectedPayment] = useState(
    user?.paymentMethods.find(method => method.isDefault) || user?.paymentMethods[0]
  );
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const deliveryFee = 3.99;
  const tax = subtotal() * 0.1; // 10% tax
  const total = subtotal() + deliveryFee + tax;
  
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      if (Platform.OS === 'web') {
        alert('Please select a delivery address');
      } else {
        Alert.alert('Missing Address', 'Please select a delivery address');
      }
      return;
    }
    
    if (!selectedPayment) {
      if (Platform.OS === 'web') {
        alert('Please select a payment method');
      } else {
        Alert.alert('Missing Payment', 'Please select a payment method');
      }
      return;
    }
    
    setIsProcessing(true);
    
    // Create new order
    const newOrder = {
      restaurantId: restaurantId!,
      restaurantName: restaurantName!,
      items: items,
      status: 'pending',
      total: subtotal(),
      deliveryFee,
      tax,
      grandTotal: total,
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '30-45 min',
      deliveryAddress: selectedAddress,
      paymentMethod: selectedPayment
    };
    
    // Simulate API call
    setTimeout(() => {
      addOrder(newOrder as any);
      clearCart();
      router.push('/order-confirmation');
      setIsProcessing(false);
    }, 2000);
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Checkout' }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView}>
          {/* Delivery Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            
            {user?.addresses && user.addresses.length > 0 ? (
              <TouchableOpacity 
                style={styles.addressCard}
                onPress={() => router.push('/addresses')}
              >
                <View style={styles.addressIcon}>
                  <MapPin size={20} color={Colors.light.primary} />
                </View>
                <View style={styles.addressContent}>
                  <Text style={styles.addressLabel}>{selectedAddress?.label}</Text>
                  <Text style={styles.addressText}>
                    {selectedAddress?.street}{selectedAddress?.apt ? `, ${selectedAddress.apt}` : ''}
                  </Text>
                  <Text style={styles.addressText}>
                    {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zipCode}
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.light.secondaryText} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/addresses')}
              >
                <Text style={styles.addButtonText}>Add Address</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            {user?.paymentMethods && user.paymentMethods.length > 0 ? (
              <TouchableOpacity 
                style={styles.paymentCard}
                onPress={() => router.push('/payment-methods')}
              >
                <View style={styles.paymentIcon}>
                  <CreditCard size={20} color={Colors.light.primary} />
                </View>
                <View style={styles.paymentContent}>
                  <Text style={styles.paymentType}>
                    {selectedPayment?.type === 'credit' ? 'Credit Card' : 
                     selectedPayment?.type === 'debit' ? 'Debit Card' : 
                     selectedPayment?.type === 'paypal' ? 'PayPal' : 
                     selectedPayment?.type === 'apple' ? 'Apple Pay' : 'Google Pay'}
                  </Text>
                  {selectedPayment?.last4 && (
                    <Text style={styles.paymentDetails}>
                      •••• {selectedPayment.last4}
                      {selectedPayment.expiryDate && ` | Expires ${selectedPayment.expiryDate}`}
                    </Text>
                  )}
                </View>
                <ChevronRight size={20} color={Colors.light.secondaryText} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/payment-methods')}
              >
                <Text style={styles.addButtonText}>Add Payment Method</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Delivery Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Time</Text>
            
            <View style={styles.deliveryTimeCard}>
              <View style={styles.deliveryTimeIcon}>
                <Clock size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.deliveryTimeContent}>
                <Text style={styles.deliveryTimeLabel}>Estimated Delivery Time</Text>
                <Text style={styles.deliveryTimeValue}>30-45 minutes</Text>
              </View>
            </View>
          </View>
          
          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.restaurantName}>{restaurantName}</Text>
                <Text style={styles.itemCount}>{items.length} items</Text>
              </View>
              
              {items.map((item) => (
                <View key={item.id} style={styles.summaryItem}>
                  <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.menuItem.name}
                  </Text>
                  <Text style={styles.itemPrice}>${item.totalPrice.toFixed(2)}</Text>
                </View>
              ))}
              
              <View style={styles.divider} />
              
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
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Place Order"
            onPress={handlePlaceOrder}
            fullWidth
            loading={isProcessing}
          />
        </View>
      </SafeAreaView>
    </>
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.light.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  addButton: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.light.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentContent: {
    flex: 1,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  paymentDetails: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  deliveryTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  deliveryTimeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.light.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deliveryTimeContent: {
    flex: 1,
  },
  deliveryTimeLabel: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginBottom: 4,
  },
  deliveryTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  summaryCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  itemCount: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemQuantity: {
    width: 30,
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.light.text,
  },
  totalRow: {
    marginTop: 8,
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