import LoginWithEmail from '@/components/loginWithEmail';
import { PrivyProvider } from '@privy-io/expo';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <PrivyProvider
        appId="cmc3pnouw005xi80mphidwltv"
        clientId="client-WY6MsAcVRuXotDSUmDvAN3Q5FHFztfaQE67KoAKZmHd9M"
        config={{
          embedded: {
            ethereum: {
              createOnLogin: 'users-without-wallets',
            },
          },
          // You can still include email login methods if needed
          loginMethods: ['email'],
        }}
      >
        <View style={styles.container}>
          <LoginWithEmail />
        </View>
      </PrivyProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
});

// import Colors from '@/constants/colors';
// import { useAuthStore } from '@/store/auth';
// import { LogOut } from 'lucide-react-native';
// import React, { useEffect } from 'react';
// import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import LoginScreen from '../auth/login';

// export default function ProfileScreen() {
//   const { user, token, logout, isLoading, setIsLoading } = useAuthStore();
//   useEffect(() => {
//     if (!token) {
//       setIsLoading(false);
//     }
//   }, [token]);
//   const handleLogout = () => {
//     Alert.alert(
//       'Log Out',
//       'Are you sure you want to log out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Log Out', style: 'destructive', onPress: () => logout() }
//       ]
//     );
//   };
//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }
  

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       {token !== null ?
//         (
//           <>
//             <View style={styles.welcomeCard}>
//               <Text style={styles.welcomeTitle}>
//                 Welcome, {user?.name || 'User'}!
//               </Text>
//               <Text style={styles.welcomeSubtitle}>
//                 You've successfully logged in to the app.
//               </Text>
//             </View>

//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Your Account</Text>
//               <View style={styles.card}>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Name</Text>
//                   <Text style={styles.infoValue}>{user?.name}</Text>
//                 </View>
//                 <View style={styles.divider} />
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Email</Text>
//                   <Text style={styles.infoValue}>{user?.email}</Text>
//                 </View>
//                 <View style={styles.divider} />
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>User ID</Text>
//                   <Text style={styles.infoValue}>{user?.id}</Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>What's Next?</Text>
//               <View style={styles.card}>
//                 <Text style={styles.cardText}>
//                   This is a simple authentication demo with login and registration functionality.
//                   In a real app, you would connect to a backend API for authentication.
//                 </Text>
//               </View>
//               {/* Logout Button */}
//               <TouchableOpacity
//                 style={styles.logoutButton}
//                 onPress={handleLogout}
//               >
//                 <LogOut size={20} color={Colors.light.error} />
//                 <Text style={styles.logoutText}>Log Out</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         )
//         :
//         (
//           <>
//            <View style={styles.section}>
//             <LoginScreen />
//            </View>
//           </>
//         )
//       }
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   content: {
//     padding: 16,
//   },
//   welcomeCard: {
//     backgroundColor: Colors.primary,
//     borderRadius: 16,
//     padding: 24,
//     marginBottom: 24,
//   },
//   welcomeTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.white,
//     marginBottom: 8,
//   },
//   welcomeSubtitle: {
//     fontSize: 16,
//     color: Colors.white,
//     opacity: 0.9,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: 12,
//   },
//   card: {
//     backgroundColor: Colors.white,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: Colors.lightText,
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: 14,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: Colors.border,
//   },
//   cardText: {
//     fontSize: 14,
//     color: Colors.text,
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   button: {
//     marginTop: 8,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     marginHorizontal: 16,
//     marginBottom: 24,
//     backgroundColor: Colors.light.card,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: Colors.light.error,
//   },
//   logoutText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.light.error,
//     marginLeft: 8,
//   },
// });