import LocationItem from '@/components/LocationItem';
import Colors from '@/constants/colors';
import useLocation from '@/hooks/useLocation';
import { useWeatherStore } from '@/store/weatherStore';
import { Github, Info, MapPin, Thermometer, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const {
    temperatureUnit,
    setTemperatureUnit,
    savedLocations,
    removeSavedLocation,
    fetchWeatherForLocation,
  } = useWeatherStore();
  
  const { requestPermission } = useLocation();
  
  const handleTemperatureUnitChange = () => {
    setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius');
  };
  
  const handleLocationPermission = async () => {
    await requestPermission();
  };
  
  const handleClearSavedLocations = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to clear all saved locations?')) {
        savedLocations.forEach(location => {
          removeSavedLocation(location.id);
        });
      }
    } else {
      Alert.alert(
        'Clear Saved Locations',
        'Are you sure you want to clear all saved locations?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              savedLocations.forEach(location => {
                removeSavedLocation(location.id);
              });
            },
          },
        ]
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Thermometer size={20} color={Colors.light.primary} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Temperature Unit</Text>
            </View>
            <View style={styles.settingControl}>
              <Text style={styles.unitLabel}>°C</Text>
              <Switch
                value={temperatureUnit === 'fahrenheit'}
                onValueChange={handleTemperatureUnitChange}
                trackColor={{ false: '#CBD5E1', true: Colors.light.primary }}
                thumbColor="#FFFFFF"
              />
              <Text style={styles.unitLabel}>°F</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLocationPermission}>
            <View style={styles.settingInfo}>
              <MapPin size={20} color={Colors.light.primary} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Location Permission</Text>
            </View>
            <View style={styles.settingControl}>
              <Text style={styles.actionText}>Update</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {savedLocations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Locations</Text>
              <TouchableOpacity onPress={handleClearSavedLocations}>
                <Trash2 size={18} color={Colors.light.error} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.locationsList}>
              {savedLocations.map(location => (
                <LocationItem
                  key={location.id}
                  location={location}
                  onSelect={fetchWeatherForLocation}
                  onRemove={removeSavedLocation}
                  isSaved
                />
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutItem}>
            <Info size={20} color={Colors.light.primary} style={styles.aboutIcon} />
            <View>
              <Text style={styles.aboutTitle}>Weather App</Text>
              <Text style={styles.aboutDescription}>
                A beautiful weather app built with React Native and Expo.
                Data provided by OpenWeatherMap.
              </Text>
            </View>
          </View>
          
          <View style={styles.aboutItem}>
            <Github size={20} color={Colors.light.primary} style={styles.aboutIcon} />
            <View>
              <Text style={styles.aboutTitle}>Version</Text>
              <Text style={styles.aboutDescription}>1.0.0</Text>
            </View>
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitLabel: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  locationsList: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aboutItem: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aboutIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  aboutDescription: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    lineHeight: 20,
  },
});