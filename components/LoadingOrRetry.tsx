import { RotateCcw } from 'lucide-react-native'; // Assuming RotateCcw is an icon component
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LoadingOrRetryProps {
  isLoading: boolean;
  onRetry: () => void;
}

const LoadingOrRetry: React.FC<LoadingOrRetryProps> = ({ isLoading, onRetry }) => (
  <View >
    {isLoading ? (
      <ActivityIndicator size="small" color="#fff" />
    ) : (
      <TouchableOpacity onPress={onRetry}>
        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: '500' }}>
          <RotateCcw color="#ffffff" style={styles.icon} />
        </Text>
      </TouchableOpacity>
    )}
  </View>
);
const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});


export default LoadingOrRetry;