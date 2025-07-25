import React from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface ReceiveModalProps {
  visible: boolean;
  onClose: () => void;
  walletAddress: string | undefined;
  onCopy: () => void;
  tokenSymbol: string | undefined;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ visible, onClose, walletAddress, onCopy, tokenSymbol }) => (
  <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Receive</Text>
        <Text style={styles.receiveLabel}>Wallet Address:</Text>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          {walletAddress ? (
            <QRCode value={walletAddress} size={140} />
          ) : null}
        </View>
        <View style={styles.addressDisplayContainer}>
          <Text style={styles.fullAddress} selectable={true}>{walletAddress}</Text>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.copyButton} onPress={onCopy}>
            <Text style={styles.copyButtonText}>Copy Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    gap: 10, // Or use marginRight on first button if gap is unsupported
    justifyContent: 'space-between',
    padding: 10,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#1e293b' },
  receiveLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#1e293b' },
  addressDisplayContainer: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 16 },
  fullAddress: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', lineHeight: 18, color: '#1e293b' },
  copyButton: { flex: 1,width: '48%', backgroundColor: '#6366F1', borderRadius: 8, paddingVertical: 20, alignItems: 'center', marginBottom: 16 },
  copyButtonText: { color: '#fff', fontWeight: '600' },
  receiveNote: { fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  closeButton: {flex: 1, width: '48%', backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 20, alignItems: 'center', marginBottom: 16 },
  closeButtonText: { color: '#64748b', fontWeight: '800', borderRadius: 8 },
});

export default ReceiveModal;