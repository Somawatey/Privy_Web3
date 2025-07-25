import Colors from '@/constants/colors';
import { Location } from '@/types/weather';
import { MapPin, Star, StarOff } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LocationItemProps {
  location: Location;
  onSelect: (location: Location) => void;
  onSave?: (location: Location) => void;
  onRemove?: (locationId: string) => void;
  isSaved?: boolean;
}

const LocationItem: React.FC<LocationItemProps> = ({
  location,
  onSelect,
  onSave,
  onRemove,
  isSaved = false,
}) => {
  const handleSaveToggle = () => {
    if (isSaved && onRemove) {
      onRemove(location.id);
    } else if (onSave) {
      onSave(location);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onSelect(location)}
    >
      <View style={styles.iconContainer}>
        <MapPin size={20} color={Colors.light.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationCountry}>{location.country}</Text>
      </View>
      {(onSave || onRemove) && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveToggle}
        >
          {isSaved ? (
            <Star size={20} color={Colors.light.secondary} fill={Colors.light.secondary} />
          ) : (
            <StarOff size={20} color={Colors.light.secondaryText} />
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  locationCountry: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  saveButton: {
    padding: 8,
  },
});

export default LocationItem;