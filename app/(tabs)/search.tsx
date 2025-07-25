import CategoryFilter from '@/components/CategoryFilter';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import Colors from '@/constants/colors';
import { restaurants } from '@/mocks/restaurants';
import { FilterOptions, Restaurant } from '@/types/index';
import { Filter } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cuisine: [],
    price: [],
    rating: null,
    sortBy: 'popular'
  });
  
  // Get unique cuisines for category filter
  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
  
  useEffect(() => {
    handleSearch(searchQuery);
  }, [selectedCategory]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let results = [...restaurants];
      
      // Filter by search query
      if (query) {
        results = results.filter(
          restaurant =>
            restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(query.toLowerCase()) ||
            restaurant.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }
      
      // Filter by category
      if (selectedCategory) {
        results = results.filter(restaurant => restaurant.cuisine === selectedCategory);
      }
      
      setFilteredRestaurants(results);
      setLoading(false);
    }, 500);
  };
  
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  const handleFilterPress = () => {
    // In a real app, this would open a filter modal
    console.log('Open filter modal');
  };
  
  const renderHeader = () => (
    <>
      <CategoryFilter
        categories={cuisines}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : filteredRestaurants.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No restaurants found</Text>
          <Text style={styles.noResultsSubtext}>
            Try a different search term or category
          </Text>
        </View>
      ) : (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'result' : 'results'}
          </Text>
        </View>
      )}
    </>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            onSearch={handleSearch}
            value={searchQuery}
            onChange={setSearchQuery}
            autoFocus
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Filter size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredRestaurants}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBarWrapper: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    textAlign: 'center',
  },
  resultsHeader: {
    marginVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
});