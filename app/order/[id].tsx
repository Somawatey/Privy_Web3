import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Clock, MapPin, MessageCircle, Phone } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { orders } = useUserStore();
  
  const order = orders.find(o => o.id === id);
  
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    if (order) {
      switch (order.status) {
        case 'pending':
          setCurrentStep(0);
          break;
        case 'preparing':
          setCurrentStep(1);
          break;
        case 'delivering':
          setCurrentStep(2);
          break;
        case 'delivered':
          setCurrentStep(3);
          break;
        default:
          setCurrentStep(0);
      }
    }
  }, [order]);
  
  if (!order) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Order not found</Text>
      </View>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.status.pending;
      case 'preparing':
        return Colors.status.preparing;
      case 'delivering':
        return Colors.status.delivering;
      case 'delivered':
        return Colors.status.delivered;
      case 'cancelled':
        return Colors.status.cancelled;
      default:
        return Colors.light.secondaryText;
    }
  };
  
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView}>
          {/* Order Status */}
          <View style={styles.statusContainer}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{formatStatus(order.status)}</Text>
              </View>
              <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
            </View>
            
            <View style={styles.statusTracker}>
              <View style={styles.statusLine}>
                <View style={[
                  styles.statusLineInner,
                  { width: `${currentStep * 33.3}%` }
                ]} />
              </View>
              
              <View style={styles.statusSteps}>
                <View style={styles.statusStep}>
                  <View style={[
                    styles.statusDot,
                    currentStep >= 0 && styles.statusDotActive
                  ]}>
                    {currentStep >= 0 && (
                      <CheckCircle size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.statusStepText}>Confirmed</Text>
                </View>
                
                <View style={styles.statusStep}>
                  <View style={[
                    styles.statusDot,
                    currentStep >= 1 && styles.statusDotActive
                  ]}>
                    {currentStep >= 1 && (
                      <CheckCircle size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.statusStepText}>Preparing</Text>
                </View>
                
                <View style={styles.statusStep}>
                  <View style={[
                    styles.statusDot,
                    currentStep >= 2 && styles.statusDotActive
                  ]}>
                    {currentStep >= 2 && (
                      <CheckCircle size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.statusStepText}>On the way</Text>
                </View>
                
                <View style={styles.statusStep}>
                  <View style={[
                    styles.statusDot,
                    currentStep >= 3 && styles.statusDotActive
                  ]}>
                    {currentStep >= 3 && (
                      <CheckCircle size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.statusStepText}>Delivered</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.deliveryTimeContainer}>
              <Clock size={16} color={Colors.light.secondaryText} />
              <Text style={styles.deliveryTimeText}>
                Estimated Delivery: {order.estimatedDeliveryTime}
              </Text>
            </View>
          </View>
          
          {/* Delivery Info */}
          {(order.status === 'delivering' || order.status === 'delivered') && (
            <View style={styles.deliveryInfoContainer}>
              <View style={styles.deliveryPersonContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }} 
                  style={styles.deliveryPersonImage} 
                />
                <View style={styles.deliveryPersonInfo}>
                  <Text style={styles.deliveryPersonName}>John Delivery</Text>
                  <Text style={styles.deliveryPersonRole}>Your Delivery Driver</Text>
                </View>
              </View>
              
              <View style={styles.deliveryActions}>
                <TouchableOpacity style={styles.deliveryAction}>
                  <View style={[styles.deliveryActionIcon, { backgroundColor: `${Colors.light.primary}20` }]}>
                    <Phone size={20} color={Colors.light.primary} />
                  </View>
                  <Text style={styles.deliveryActionText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.deliveryAction}>
                  <View style={[styles.deliveryActionIcon, { backgroundColor: `${Colors.light.secondary}20` }]}>
                    <MessageCircle size={20} color={Colors.light.secondary} />
                  </View>
                  <Text style={styles.deliveryActionText}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Restaurant Info */}
          <View style={styles.restaurantContainer}>
            <Text style={styles.sectionTitle}>Restaurant</Text>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{order.restaurantName}</Text>
              <TouchableOpacity 
                style={styles.reorderButton}
                onPress={() => router.push(`/restaurant/${order.restaurantId}`)}
              >
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Order Items */}
          <View style={styles.itemsContainer}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            
            {order.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemQuantity}>
                  <Text style={styles.orderItemQuantityText}>{item.quantity}x</Text>
                </View>
                <View style={styles.orderItemContent}>
                  <Text style={styles.orderItemName}>{item.menuItem.name}</Text>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <Text style={styles.orderItemOptions}>
                      With options
                    </Text>
                  )}
                  {item.specialInstructions && (
                    <Text style={styles.orderItemInstructions}>
                      Note: {item.specialInstructions}
                    </Text>
                  )}
                </View>
                <Text style={styles.orderItemPrice}>${item.totalPrice.toFixed(2)}</Text>
              </View>
            ))}
          </View>
          
          {/* Delivery Address */}
          <View style={styles.addressContainer}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            
            <View style={styles.addressCard}>
              <View style={styles.addressIcon}>
                <MapPin size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressLabel}>{order.deliveryAddress.label}</Text>
                <Text style={styles.addressText}>
                  {order.deliveryAddress.street}
                  {order.deliveryAddress.apt ? `, ${order.deliveryAddress.apt}` : ''}
                </Text>
                <Text style={styles.addressText}>
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Payment Summary */}
          <View style={styles.paymentContainer}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            
            <View style={styles.paymentCard}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Subtotal</Text>
                <Text style={styles.paymentValue}>${order.total.toFixed(2)}</Text>
              </View>
              
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Delivery Fee</Text>
                <Text style={styles.paymentValue}>${order.deliveryFee.toFixed(2)}</Text>
              </View>
              
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Tax</Text>
                <Text style={styles.paymentValue}>${order.tax.toFixed(2)}</Text>
              </View>
              
              <View style={[styles.paymentRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${order.grandTotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.paymentMethod}>
                <Text style={styles.paymentMethodLabel}>Paid with</Text>
                <Text style={styles.paymentMethodValue}>
                  {order.paymentMethod.type === 'credit' ? 'Credit Card' : 
                   order.paymentMethod.type === 'debit' ? 'Debit Card' : 
                   order.paymentMethod.type === 'paypal' ? 'PayPal' : 
                   order.paymentMethod.type === 'apple' ? 'Apple Pay' : 'Google Pay'}
                  {order.paymentMethod.last4 && ` •••• ${order.paymentMethod.last4}`}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        {order.status === 'delivered' && (
          <View style={styles.footer}>
            <Button
              title="Rate Your Order"
              onPress={() => {}}
              fullWidth
            />
          </View>
        )}
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusContainer: {
    backgroundColor: Colors.light.card,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  orderDate: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  statusTracker: {
    marginBottom: 16,
  },
  statusLine: {
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    marginBottom: 8,
    position: 'relative',
  },
  statusLineInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  statusSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusStep: {
    alignItems: 'center',
    width: '25%',
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statusDotActive: {
    backgroundColor: Colors.light.primary,
  },
  statusStepText: {
    fontSize: 12,
    color: Colors.light.secondaryText,
    textAlign: 'center',
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deliveryTimeText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginLeft: 8,
  },
  deliveryInfoContainer: {
    backgroundColor: Colors.light.card,
    padding: 16,
    marginBottom: 16,
  },
  deliveryPersonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryPersonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  deliveryPersonInfo: {
    flex: 1,
  },
  deliveryPersonName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  deliveryPersonRole: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  deliveryAction: {
    alignItems: 'center',
  },
  deliveryActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  deliveryActionText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  restaurantContainer: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  restaurantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  restaurantName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  reorderButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reorderButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  itemsContainer: {
    padding: 16,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderItemQuantity: {
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  orderItemQuantityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderItemContent: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  orderItemOptions: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginBottom: 2,
  },
  orderItemInstructions: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    fontStyle: 'italic',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  addressContainer: {
    padding: 16,
    marginBottom: 16,
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
  paymentContainer: {
    padding: 16,
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  paymentValue: {
    fontSize: 14,
    color: Colors.light.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 8,
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
  paymentMethod: {
    marginTop: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 12,
  },
  paymentMethodLabel: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginBottom: 4,
  },
  paymentMethodValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
});