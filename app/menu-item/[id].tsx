import Button from '@/components/Button';
import QuantitySelector from '@/components/QuantitySelector';
import Colors from '@/constants/colors';
import { menuItems } from '@/mocks/menuItems';
import { restaurants } from '@/mocks/restaurants';
import { useCartStore } from '@/store/cartStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MenuItemScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, restaurantId } = useCartStore();
  
  const menuItem = menuItems.find(item => item.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  if (!menuItem) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Item not found</Text>
      </View>
    );
  }
  
  const restaurant = restaurants.find(r => r.id === menuItem.restaurantId);
  
  // Calculate total price including options
  const calculateTotalPrice = () => {
    let total = menuItem.price * quantity;
    
    selectedOptions.forEach(option => {
      option.choiceIds.forEach((choiceId: string) => {
        const choice = menuItem.options?.find(opt => opt.id === option.optionId)?.choices.find(c => c.id === choiceId);
        if (choice) {
          total += choice.price * quantity;
        }
      });
    });
    
    return total;
  };
  
  const handleOptionSelect = (optionId: string, choiceId: string, multiple: boolean = false) => {
    setSelectedOptions(prev => {
      // Find if this option is already selected
      const existingOptionIndex = prev.findIndex(opt => opt.optionId === optionId);
      
      if (existingOptionIndex >= 0) {
        // Option already exists
        const updatedOptions = [...prev];
        
        if (multiple) {
          // For multiple selection options
          const choiceIndex = updatedOptions[existingOptionIndex].choiceIds.indexOf(choiceId);
          
          if (choiceIndex >= 0) {
            // Remove choice if already selected
            updatedOptions[existingOptionIndex].choiceIds = updatedOptions[existingOptionIndex].choiceIds.filter(id => id !== choiceId);
            
            // Remove the option entirely if no choices left
            if (updatedOptions[existingOptionIndex].choiceIds.length === 0) {
              return updatedOptions.filter(opt => opt.optionId !== optionId);
            }
          } else {
            // Add choice
            updatedOptions[existingOptionIndex].choiceIds.push(choiceId);
          }
        } else {
          // For single selection options
          updatedOptions[existingOptionIndex].choiceIds = [choiceId];
        }
        
        return updatedOptions;
      } else {
        // Option doesn't exist yet, add it
        return [...prev, { optionId, choiceIds: [choiceId] }];
      }
    });
  };
  
  const isChoiceSelected = (optionId: string, choiceId: string) => {
    const option = selectedOptions.find(opt => opt.optionId === optionId);
    return option ? option.choiceIds.includes(choiceId) : false;
  };
  
  const handleAddToCart = () => {
    // Check if all required options are selected
    const requiredOptions = menuItem.options?.filter(option => option.required) || [];
    const missingRequiredOptions = requiredOptions.filter(option => {
      return !selectedOptions.some(selected => selected.optionId === option.id && selected.choiceIds.length > 0
      );
    });
    
    if (missingRequiredOptions.length > 0) {
      const missingOptionNames = missingRequiredOptions.map(option => option.name).join(', ');
      
      if (Platform.OS === 'web') {
        alert(`Please select options for: ${missingOptionNames}`);
      } else {
        Alert.alert(
          'Missing Options',
          `Please select options for: ${missingOptionNames}`,
          [{ text: 'OK' }]
        );
      }
      return;
    }
    
    // Check if adding from a different restaurant
    if (restaurantId && restaurantId !== menuItem.restaurantId) {
      if (Platform.OS === 'web') {
        if (confirm('Your cart contains items from a different restaurant. Would you like to clear your cart and add this item?')) {
          addToCart(menuItem, quantity, selectedOptions, specialInstructions);
          router.push('/cart');
        }
      } else {
        Alert.alert(
          'Different Restaurant',
          'Your cart contains items from a different restaurant. Would you like to clear your cart and add this item?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Clear Cart & Add', 
              onPress: () => {
                addToCart(menuItem, quantity, selectedOptions, specialInstructions);
                router.push('/cart');
              }
            }
          ]
        );
      }
    } else {
      // Add to cart normally
      addToCart(menuItem, quantity, selectedOptions, specialInstructions);
      router.push('/cart');
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: menuItem.name,
          headerTransparent: true,
          headerTintColor: '#FFFFFF',
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Item Image */}
          <Image source={{ uri: menuItem.image }} style={styles.itemImage} />
          
          {/* Item Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.itemName}>{menuItem.name}</Text>
            <Text style={styles.restaurantName}>{restaurant?.name}</Text>
            <Text style={styles.itemDescription}>{menuItem.description}</Text>
            <Text style={styles.itemPrice}>${menuItem.price.toFixed(2)}</Text>
          </View>
          
          {/* Options */}
          {menuItem.options && menuItem.options.length > 0 && (
            <View style={styles.optionsContainer}>
              {menuItem.options.map((option) => (
                <View key={option.id} style={styles.optionSection}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionTitle}>{option.name}</Text>
                    {option.required && (
                      <Text style={styles.requiredBadge}>Required</Text>
                    )}
                  </View>
                  
                  {option.choices.map((choice) => (
                    <TouchableOpacity
                      key={choice.id}
                      style={[
                        styles.choiceItem,
                        isChoiceSelected(option.id, choice.id) && styles.choiceItemSelected
                      ]}
                      onPress={() => handleOptionSelect(option.id, choice.id, option.multiple)}
                    >
                      <View style={styles.choiceContent}>
                        <Text style={styles.choiceName}>{choice.name}</Text>
                        {choice.price > 0 && (
                          <Text style={styles.choicePrice}>+${choice.price.toFixed(2)}</Text>
                        )}
                      </View>
                      
                      <View style={[
                        styles.checkbox,
                        isChoiceSelected(option.id, choice.id) && styles.checkboxSelected
                      ]}>
                        {isChoiceSelected(option.id, choice.id) && (
                          <View style={styles.checkboxInner} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}
          
          {/* Special Instructions */}
          <View style={styles.specialInstructionsContainer}>
            <Text style={styles.specialInstructionsTitle}>Special Instructions</Text>
            <TextInput
              style={styles.specialInstructionsInput}
              placeholder="Add notes (allergies, special requests, etc.)"
              placeholderTextColor={Colors.light.secondaryText}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              maxLength={200}
            />
          </View>
          
          {/* Quantity */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityTitle}>Quantity</Text>
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => setQuantity(prev => prev + 1)}
              onDecrement={() => setQuantity(prev => Math.max(1, prev - 1))}
            />
          </View>
        </ScrollView>
        
        {/* Add to Cart Button */}
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>${calculateTotalPrice().toFixed(2)}</Text>
          </View>
          
          <Button
            title="Add to Cart"
            onPress={handleAddToCart}
            style={styles.addButton}
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
  itemImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    color: Colors.light.secondaryText,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  optionsContainer: {
    padding: 16,
  },
  optionSection: {
    marginBottom: 24,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginRight: 8,
  },
  requiredBadge: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  choiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  choiceItemSelected: {
    backgroundColor: `${Colors.light.primary}10`,
    borderColor: Colors.light.primary,
    borderWidth: 1,
  },
  choiceContent: {
    flex: 1,
  },
  choiceName: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 2,
  },
  choicePrice: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: Colors.light.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  specialInstructionsContainer: {
    padding: 16,
  },
  specialInstructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  specialInstructionsInput: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  quantityContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.light.secondaryText,
    marginRight: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  addButton: {
    flex: 1,
    marginLeft: 16,
  },
});