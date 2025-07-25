import { TokenInfo } from '@/app/(tabs)';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


interface SendModalProps {
  visible: boolean;
  onClose: () => void;
  tokenInfo: TokenInfo | null;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  transferAmount: string;
  setTransferAmount: (value: string) => void;
  onSend: () => void;
  isTransferring: boolean;
}

const SendModal: React.FC<SendModalProps> = ({
  visible,
  onClose,
  tokenInfo,
  recipientAddress,
  setRecipientAddress,
  transferAmount,
  setTransferAmount,
  onSend,
  isTransferring,
}) => (
  <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Send {tokenInfo?.symbol || 'Token'}</Text>
        <Text style={styles.availableBalance}>
          Available: {tokenInfo?.balanceFormatted || '0'} {tokenInfo?.symbol || ''}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Recipient Address (0x...)"
          value={recipientAddress}
          onChangeText={setRecipientAddress}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder={`Amount (${tokenInfo?.symbol || 'Token'})`}
          value={transferAmount}
          onChangeText={(text) => {
            const filteredText = text
              .replace(/[^0-9.]/g, '')
              .replace(/(\..*?)\./g, '$1')
              .replace(/^0+(?=\d)/, '');
            setTransferAmount(filteredText);
          }}
          keyboardType="decimal-pad"
          placeholderTextColor="#999"
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.sendButton]} onPress={onSend} disabled={isTransferring}>
            {isTransferring ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#1e293b' },
  availableBalance: { fontSize: 14, color: '#00000', textAlign: 'center', marginBottom: 16, backgroundColor: '#f3f4f6', padding: 8, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, backgroundColor: '#fff' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f1f5f9' },
  cancelButtonText: { color: '#64748b', fontWeight: '600' },
  sendButton: { backgroundColor: '#6366F1' },
  sendButtonText: { color: '#fff', fontWeight: '600' },
});

export default SendModal;