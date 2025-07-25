import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const wallet = [
  { label: 'Ethereum (ETH)', value: 'ETH', rate: 2633 },
  { label: 'Bitcoin (BTC)', value: 'BTC', rate: 104941 },
  { label: 'Tether (USDT)', value: 'USDT', rate: 1 },
  { label: 'Binance Coin (BNB)', value: 'BNB', rate: 665 },
  { label: 'Solana (SOL)', value: 'SOL', rate: 153 },
];

export default function PaymentProgress() {
    const {id, amount, wallet} = useLocalSearchParams();
    return (
        <>
            <Stack.Screen options={{title: "Payment"}}/>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Payment in Progress</Text>
                <Text style={styles.subtext}>Great! We've detected your transaction on the blockchain and will now wait until the payment has been fully processed.</Text>
                <View style={styles.card}>
                    <View style={styles.details}>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Status {' '}</Text>
                            <Text style={styles.rowValue}>In Progress</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Payment of {' '}</Text>
                            <Text style={styles.rowValue}>{amount} {wallet}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Total Amount {' '}</Text>
                            <Text style={styles.rowValue}></Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Reference {' '}</Text>
                            <Text style={styles.rowValue}>{id}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Transaction Hash</Text>
                            <Text style={styles.rowValue}>0xa3c9f8e12...6d2</Text>
                        </View>
                    </View>
                </View>
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
    fontSize: 18,
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
})
