import Colors from '@/constants/colors';
import { CartItem as CartItemType } from '@/types/index';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CartItemProps {
  item: CartItemType;
  onIncrement: (item: CartItemType) => void;
  onDecrement: (item: CartItemType) => void;
  onRemove: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onRemove 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantity}>{item.quantity}x</Text>
        </View>
        <Text style={styles.name}>{item.menuItem.name}</Text>
        <Text style={styles.price}>${item.totalPrice.toFixed(2)}</Text>
      </View>
      
      {/* Selected options */}
      {item.selectedOptions && item.selectedOptions.length > 0 && (
        <View style={styles.optionsContainer}>
          {item.selectedOptions.map((option, index) => {
            // Find option and choice names from the menu item
            const optionData = item.menuItem.options?.find(opt => opt.id === option.optionId);
            const choiceNames = option.choiceIds.map(choiceId => {
              const choice = optionData?.choices.find(c => c.id === choiceId);
              return choice?.name || '';
            }).filter(Boolean);
            
            return (
              <Text key={index} style={styles.optionText}>
                {optionData?.name}: {choiceNames.join(', ')}
              </Text>
            );
          })}
        </View>
      )}
      
      {/* Special instructions */}
      {item.specialInstructions && (
        <Text style={styles.instructions}>
          Note: {item.specialInstructions}
        </Text>
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => onRemove(item.id)}
        >
          <Trash2 size={16} color={Colors.light.error} />
        </TouchableOpacity>
        
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => onDecrement(item)}
          >
            <Minus size={16} color={Colors.light.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => onIncrement(item)}
          >
            <Plus size={16} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityContainer: {
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  quantity: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  optionsContainer: {
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginBottom: 2,
  },
  instructions: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: Colors.light.border,
    borderRadius: 8,
    padding: 6,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginHorizontal: 12,
  },
});

export default CartItem;