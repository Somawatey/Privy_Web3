import { useUserStore } from '@/store/userStore'; // Adjust path if needed
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const LoginScreen = () => {
  const login = useUserStore(state => state.login);
  const isLoggedIn = useUserStore(state => state.isLoggedIn);
  const navigation = useNavigation();

  const handleLogin = () => {
    login();
    router.push('/');
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Home' }], // or your app's main screen
    // });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Please log in to continue</Text>

      <Button title="Login with Mock Data" onPress={handleLogin} />

      {isLoggedIn && <Text style={styles.success}>You are logged in!</Text>}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  success: {
    marginTop: 20,
    color: 'green',
    textAlign: 'center',
  },
});
