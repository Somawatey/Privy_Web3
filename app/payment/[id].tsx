import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Stack, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useEffect, useState } from 'react';

const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1200px-QR_Code_Example.svg.png';

export default function TransferScreen() {
  const router = useRouter();
  const { id, amount, wallet, transferWallet } = useLocalSearchParams();

  const copyToClipboard = async (text: GLFloat) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Copied to clipboard.');
  };
  const copyAddress = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Copied to clipboard');
  }

  function shortenAddress(): string {
    const text = typeof transferWallet === 'string' ? transferWallet : '';
    if (text.length < 12) return text;
    return `${text.slice(0, 10)}.....${text.slice(-5)}`;
  }

  const COUNTDOWN_TIME = 14.10
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format as HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };


  const handleContinue = () => {
    router.push({
      pathname: '/payment/progress/[id]',
      params:{
        id,
        amount,
        wallet,
        transferWallet,
      }
    })
  }
  return (
      <>
          <Stack.Screen options={{title: "Payment"}}/>
          <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.title}>Pay with {wallet}</Text>
              <Text style={styles.subtext}>To complete this payment for {id}, send the amount due to the {wallet} address below.</Text>
              <View style={styles.card}>
                  <Image source={{uri: imageUrl}} style={styles.image}/>
                  <Text style={styles.wallet}>0xa3c9f8e12d5b7c3f64a28b7d9c81a0e4f7c9b6d2</Text>
                  <Text style={styles.qrText}>Please make sure to only send {wallet} to this address.</Text>
                  <View style={styles.details}>
                      <View style={styles.row}>
                          <Text style={styles.rowLabel}>Amount Due {' '}</Text>
                          <Text style={styles.rowValue}>{amount} {wallet}
                            <Pressable onPress={() => copyToClipboard(amount)} style={{ marginLeft: 8 }}>
                              <Ionicons name="copy-outline" size={20} color="#354fde" />
                            </Pressable>
                          </Text>
                      </View>
                      <View style={styles.row}>
                          <Text style={styles.rowLabel}>{wallet} Address {' '}</Text>
                          <Text style={styles.rowValue}>{shortenAddress()}
                            <Pressable onPress={() => copyAddress(transferWallet)} style={{ marginLeft: 8 }}>
                                <Ionicons name="copy-outline" size={20} color="#354fde" />
                            </Pressable>
                          </Text>
                      </View>
                      <View style={styles.row}>
                          <Text style={styles.rowLabel}>Time Left To Pay {' '}</Text>
                          <Text style={styles.rowValue}>{timeLeft > 0 ? formatTime(timeLeft) : "Expired"}</Text>
                      </View>
                  </View>
              </View>
              <TouchableOpacity style={styles.continue} onPress={handleContinue}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
          </ScrollView>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  subtext: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginInline: 20,
    marginBottom: 14,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    width: 240, 
    height: 240,
    resizeMode: 'contain',
    marginInline: 50,
  },
  wallet:{
    textAlign: 'center',
    fontSize: 15,
    color: 'gray',
    marginInline: 20,
  },
  qrText: {
    textAlign: 'center',
    fontSize: 10,
    color: 'gray',
    marginInline: 20,
  },
  details: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowLabel:{
    fontSize: 14,
    color: 'black',
  },
  rowValue:{
    fontSize: 14,
    color: '#444',
    textAlign: 'right',
  },
  continue: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBlock: 4,
    marginTop: 25,
    width: '100%'
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
