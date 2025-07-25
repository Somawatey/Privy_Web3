import Colors from '@/constants/colors';
import { Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
  onChange?: (text: string) => void;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search for restaurants or food...',
  onSearch,
  value,
  onChange,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(value || '');
  const [isFocused, setIsFocused] = useState(autoFocus);
  
  const handleChangeText = (text: string) => {
    setQuery(text);
    if (onChange) onChange(text);
  };
  
  const handleClear = () => {
    setQuery('');
    if (onChange) onChange('');
  };
  
  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };
  
  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused
    ]}>
      <Search size={20} color={Colors.light.secondaryText} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.secondaryText}
        value={query}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <X size={18} color={Colors.light.secondaryText} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  containerFocused: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;