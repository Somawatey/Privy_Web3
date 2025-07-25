import CategoryFilter from '@/components/CategoryFilter';
import MenuItem from '@/components/MenuItem';
import Colors from '@/constants/colors';
import { menuItems } from '@/mocks/menuItems';
import { restaurants } from '@/mocks/restaurants';
import { useCartStore } from '@/store/cartStore';
import { MenuItem as MenuItemType } from '@/types/index';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, Clock, DollarSign, MapPin, ShoppingBag, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { items, totalItems } = useCartStore();
  
  const restaurant = restaurants.find(r => r.id === id);
  const restaurantMenu = menuItems.filter(item => item.restaurantId === id);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get unique categories from menu items
  const categories = [...new Set(restaurantMenu.map(item => item.category))];
  
  // Filter menu items by selected category
  const filteredMenu = selectedCategory
    ? restaurantMenu.filter(item => item.category === selectedCategory)
    : restaurantMenu;
  
  // Group menu items by category for display
  const menuByCategory: Record<string, MenuItemType[]> = {};
  
  restaurantMenu.forEach(item => {
    if (!menuByCategory[item.category]) {
      menuByCategory[item.category] = [];
    }
    menuByCategory[item.category].push(item);
  });
  
  const handleMenuItemPress = (item: MenuItemType) => {
    router.push(`/menu-item/${item.id}`);
  };
  
  const handleViewCart = () => {
    router.push('/cart');
  };
  
  if (!restaurant) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: restaurant.name,
          headerTransparent: true,
          headerTintColor: '#FFFFFF',
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Restaurant Header Image */}
          <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
          
          {/* Restaurant Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            
            <View style={styles.tagsContainer}>
              {restaurant.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Star size={16} color={Colors.light.primary} />
                <Text style={styles.detailText}>{restaurant.rating}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Clock size={16} color={Colors.light.secondaryText} />
                <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <DollarSign size={16} color={Colors.light.secondaryText} />
                <Text style={styles.detailText}>
                  {restaurant.deliveryFee === 0 
                    ? 'Free Delivery' 
                    : `$${restaurant.deliveryFee.toFixed(2)}`}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.addressContainer}>
              <MapPin size={16} color={Colors.light.primary} />
              <Text style={styles.addressText}>{restaurant.address}</Text>
              <ChevronDown size={16} color={Colors.light.secondaryText} />
            </TouchableOpacity>
          </View>
          
          {/* Menu Categories */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          
          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {selectedCategory ? (
              // Show filtered menu items
              <>
                <Text style={styles.categoryTitle}>{selectedCategory}</Text>
                {filteredMenu.map(item => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onPress={handleMenuItemPress}
                  />
                ))}
              </>
            ) : (
              // Show all menu items grouped by category
              Object.entries(menuByCategory).map(([category, items]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {items.map(item => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      onPress={handleMenuItemPress}
                    />
                  ))}
                </View>
              ))
            )}
          </View>
        </ScrollView>
        
        {/* Cart Button */}
        {totalItems > 0 && (
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={handleViewCart}
          >
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
            <ShoppingBag size={20} color="#FFFFFF" />
            <Text style={styles.cartButtonText}>View Cart</Text>
          </TouchableOpacity>
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
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.light.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: Colors.light.secondaryText,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginLeft: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    marginHorizontal: 8,
  },
  menuContainer: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  cartButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    elevation: 4,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
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
});