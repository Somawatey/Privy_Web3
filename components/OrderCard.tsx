import Colors from '@/constants/colors';
import { Order } from '@/types/index';
import { useRouter } from 'expo-router';
import { ChevronRight, Clock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/order/${order.id}`);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{formatStatus(order.status)}</Text>
        </View>
      </View>
      
      <View style={styles.itemsContainer}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.itemText} numberOfLines={1}>
            {item.quantity}x {item.menuItem.name}
          </Text>
        ))}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${order.grandTotal.toFixed(2)}</Text>
        </View>
        
        <View style={styles.deliveryTimeContainer}>
          <Clock size={14} color={Colors.light.secondaryText} />
          <Text style={styles.deliveryTimeText}>{order.estimatedDeliveryTime}</Text>
        </View>
        
        <ChevronRight size={20} color={Colors.light.secondaryText} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.light.secondaryText,
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
  itemsContainer: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginRight: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTimeText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginLeft: 4,
  },
});

export default OrderCard;