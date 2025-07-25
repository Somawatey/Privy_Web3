import CategoryFilter from '@/components/CategoryFilter';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import Colors from '@/constants/colors';
import { restaurants } from '@/mocks/restaurants';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';
import { ChevronRight, MapPin } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoggedIn, login } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Auto-login for demo purposes
  useEffect(() => {
    if (!isLoggedIn) {
      login();
    }
  }, [isLoggedIn, login]);
  
  const featuredRestaurants = restaurants.filter(r => r.featured);
  
  // Get unique cuisines for category filter
  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
  
  // Filter restaurants by selected category
  const filteredRestaurants = selectedCategory
    ? restaurants.filter(r => r.cuisine === selectedCategory)
    : restaurants;
  
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const handleSearch = () => {
    router.push('/search');
  };
  
  const handleViewAll = () => {
    setSelectedCategory(null);
    router.push('/search');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {isLoggedIn ? `Hi, ${user?.name?.split(' ')[0]}` : 'Welcome'}
            </Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={Colors.light.primary} />
              <Text style={styles.location}>
                {isLoggedIn && user?.addresses?.length
                  ? user.addresses.find(a => a.isDefault)?.street || 'Select address'
                  : 'Select address'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBarContainer} 
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <SearchBar 
            onSearch={() => {}} 
            placeholder="Search for restaurants or food..."
          />
        </TouchableOpacity>
        
        {/* Featured Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
          </View>
          
          <FlatList
            data={featuredRestaurants}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item }) => (
              <View style={styles.featuredItem}>
                <RestaurantCard restaurant={item} featured />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        
        {/* Categories */}
        <CategoryFilter
          categories={cuisines}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        {/* All Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory ? `${selectedCategory} Restaurants` : 'All Restaurants'}
            </Text>
            <TouchableOpacity onPress={handleViewAll}>
              <View style={styles.viewAllContainer}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={Colors.light.primary} />
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.restaurantsList}>
            {filteredRestaurants.slice(0, 6).map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginLeft: 4,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredItem: {
    width: 300,
    marginRight: 8,
  },
  restaurantsList: {
    paddingHorizontal: 16,
  },
});