import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { Stack, useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orders } = useUserStore();
  
  // Get the most recent order
  const latestOrder = orders.length > 0 ? orders[0] : null;
  
  useEffect(() => {
    // If there's no order, redirect to home
    if (!latestOrder) {
      router.replace('/');
    }
  }, [latestOrder]);
  
  const handleTrackOrder = () => {
    if (latestOrder) {
      router.push(`/order/${latestOrder.id}`);
    }
  };
  
  const handleGoHome = () => {
    router.replace('/');
  };
  
  if (!latestOrder) {
    return null;
  }
  
  return (
    <>
      <Stack.Screen options={{ title: 'Order Confirmed', headerBackVisible: false }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <CheckCircle size={80} color={Colors.light.success} />
          </View>
          
          <Text style={styles.title}>Order Confirmed!</Text>
          
          <Text style={styles.message}>
            Your order has been placed successfully. You can track the status of your order below.
          </Text>
          
          <View style={styles.orderInfoContainer}>
            <Text style={styles.orderInfoTitle}>Order Details</Text>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Order ID:</Text>
              <Text style={styles.orderInfoValue}>#{latestOrder.id}</Text>
            </View>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Restaurant:</Text>
              <Text style={styles.orderInfoValue}>{latestOrder.restaurantName}</Text>
            </View>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Total Amount:</Text>
              <Text style={styles.orderInfoValue}>${latestOrder.grandTotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Estimated Delivery:</Text>
              <Text style={styles.orderInfoValue}>{latestOrder.estimatedDeliveryTime}</Text>
            </View>
          </View>
          
          <View style={styles.deliveryImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
              style={styles.deliveryImage} 
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Button
            title="Track Order"
            onPress={handleTrackOrder}
            fullWidth
            style={styles.trackButton}
          />
          
          <Button
            title="Back to Home"
            onPress={handleGoHome}
            variant="outline"
            fullWidth
            style={styles.homeButton}
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
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.light.secondaryText,
    textAlign: 'center',
    marginBottom: 32,
  },
  orderInfoContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  orderInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderInfoLabel: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  deliveryImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  deliveryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer: {
    padding: 16,
  },
  trackButton: {
    marginBottom: 12,
  },
  homeButton: {
    borderColor: Colors.light.primary,
  },
});