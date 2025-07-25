import Colors from '@/constants/colors';
import { Restaurant } from '@/types/index';
import { useRouter } from 'expo-router';
import { Clock, DollarSign, Star } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RestaurantCardProps {
  restaurant: Restaurant;
  featured?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, featured = false }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  if (featured) {
    return (
      <TouchableOpacity 
        style={styles.featuredContainer} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Image source={{ uri: restaurant.image }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredName}>{restaurant.name}</Text>
            <View style={styles.featuredDetails}>
              <View style={styles.featuredDetail}>
                <Star size={14} color="#FFF" />
                <Text style={styles.featuredDetailText}>{restaurant.rating}</Text>
              </View>
              <View style={styles.featuredDetail}>
                <Clock size={14} color="#FFF" />
                <Text style={styles.featuredDetailText}>{restaurant.deliveryTime}</Text>
              </View>
              <View style={styles.featuredTag}>
                <Text style={styles.featuredTagText}>{restaurant.cuisine}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <View style={styles.tags}>
          {restaurant.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.details}>
          <View style={styles.detail}>
            <Star size={14} color={Colors.light.primary} />
            <Text style={styles.detailText}>{restaurant.rating}</Text>
          </View>
          <View style={styles.detail}>
            <Clock size={14} color={Colors.light.secondaryText} />
            <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
          </View>
          <View style={styles.detail}>
            <DollarSign size={14} color={Colors.light.secondaryText} />
            <Text style={styles.detailText}>
              {restaurant.deliveryFee === 0 
                ? 'Free Delivery' 
                : `$${restaurant.deliveryFee.toFixed(2)}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: Colors.light.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: Colors.light.secondaryText,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: Colors.light.secondaryText,
    marginLeft: 4,
  },
  featuredContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 16,
  },
  featuredName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  featuredDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  featuredTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredTagText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});

export default RestaurantCard;