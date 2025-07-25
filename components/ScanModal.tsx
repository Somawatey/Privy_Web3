// ScanModal.tsx
import { Feather } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    AppState,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScanModalProps = {
  visible: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
};

export default function ScanModal({ visible, onClose, onScan }: ScanModalProps) {
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [loading, setLoading] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  // Ask camera permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      qrLock.current = false;
    }, [])
  );

  const decodeQRCodeFromUri = async (uri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);

    try {
      const response = await fetch("https://api.qrserver.com/v1/read-qr-code/", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const json = await response.json();
      const qrText = json[0]?.symbol[0]?.data || null;
      return qrText;
    } catch (e) {
      console.error("QR decode API error", e);
      return null;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (!uri) return;
      setLoading(true);
      const qrText = await decodeQRCodeFromUri(uri);
      setLoading(false);

      if (qrText) {
        onScan(qrText);
        onClose();
      } else {
        Alert.alert("QR Code Error", "Failed to read QR code.");
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: "#f9fafb",
        }}
      >
        {Platform.OS === "android" ? <StatusBar hidden /> : null}

        {hasPermission === null ? (
          <View style={styles.centered}>
            <Text style={{ color: "#666", fontFamily: "Hanuman" }}>
              Requesting camera permission...
            </Text>
          </View>
        ) : hasPermission === false ? (
          <View style={styles.centered}>
            <Text style={{ color: "red", fontFamily: "Hanuman" }}>
              Camera permission denied
            </Text>
          </View>
        ) : (
          <>
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={({ data }) => {
                if (data && !qrLock.current) {
                  qrLock.current = true;
                  setTimeout(() => {
                    onScan(data);
                    onClose();
                  }, 300);
                }
              }}
            />

            {/* Square Frame Overlay - Centered */}
            <View style={styles.frameOverlay}>
              <View style={styles.frameBox}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
              </View>
            </View>

            {/* Torch Toggle */}
            <TouchableOpacity
              onPress={() => setTorchOn(!torchOn)}
              style={styles.flashButton}
            >
              <Feather
                name={torchOn ? "zap-off" : "zap"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </>
        )}

        {/* Upload and Close Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Feather
              name="arrow-left"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <Feather name="upload" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Upload QR</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        <Modal transparent visible={loading}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#1e9b99" />
              <Text style={{ marginLeft: 15, fontSize: 16 }}>
                Scanning QR code...
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const cornerSize = 40;
const borderWidth = 4;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: "100%",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffffcc",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Hanuman",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBox: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  flashButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#6366F1",
    padding: 12,
    borderRadius: 50,
    zIndex: 10,
  },
  frameOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  frameBox: {
    width: 250,
    height: 250,
    position: "relative",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: borderWidth,
    borderLeftWidth: borderWidth,
    borderColor: "#fff",
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: borderWidth,
    borderRightWidth: borderWidth,
    borderColor: "#fff",
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: borderWidth,
    borderLeftWidth: borderWidth,
    borderColor: "#fff",
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: borderWidth,
    borderRightWidth: borderWidth,
    borderColor: "#fff",
  },
});