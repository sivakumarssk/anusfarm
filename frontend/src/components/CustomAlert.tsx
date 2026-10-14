
// import React from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";

// type CustomAlertProps = {
//   visible: boolean;
//   title: string;
//   message?: string;
//   onClose: () => void;
//   buttonText?: string;
// };

// export default function CustomAlert({
//   visible,
//   title,
//   message = "",
//   onClose,
//   buttonText = "OK",
// }: CustomAlertProps) {
//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       statusBarTranslucent
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.alertBox}>
//           <View style={styles.iconCircle}>
//             <Text style={styles.iconText}>!</Text>
//           </View>

//           <Text style={styles.title}>{title}</Text>

//           {message.length > 0 && (
//             <Text style={styles.message}>{message}</Text>
//           )}

//           <TouchableOpacity
//             style={styles.button}
//             activeOpacity={0.8}
//             onPress={onClose}
//           >
//             <Text style={styles.buttonText}>{buttonText}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 25,
//   },
//   alertBox: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 24,
//     alignItems: "center",
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//   },
//   iconCircle: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#E8F5E9",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 14,
//   },
//   iconText: {
//     fontFamily: "Inter-Bold",
//     fontSize: 26,
//     color: "#0A8A2A",
//   },
//   title: {
//     fontFamily: "Inter-Bold",
//     fontSize: 20,
//     color: "#111111",
//     textAlign: "center",
//   },
//   message: {
//     fontFamily: "Inter-Regular",
//     fontSize: 14,
//     color: "#666666",
//     textAlign: "center",
//     lineHeight: 22,
//     marginTop: 12,
//   },
//   button: {
//     width: "100%",
//     backgroundColor: "#0A8A2A",
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 22,
//   },
//   buttonText: {
//     fontFamily: "Inter-SemiBold",
//     fontSize: 15,
//     color: "#FFFFFF",
//   },
// });

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type CustomAlertProps = {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  buttonText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

export default function CustomAlert({
  visible,
  title,
  message = "",
  onClose,
  buttonText = "OK",
  cancelText,
  onConfirm,
}: CustomAlertProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>!</Text>
          </View>

          <Text style={styles.title}>{title}</Text>

          {!!message && (
            <Text style={styles.message}>{message}</Text>
          )}

          <View style={styles.buttonRow}>
            {cancelText && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                cancelText && styles.flexButton,
              ]}
              onPress={onConfirm || onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  alertBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  iconText: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: "#0A8A2A",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#111111",
    textAlign: "center",
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#555555",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginTop: 22,
  },
  button: {
    backgroundColor: "#0A8A2A",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  flexButton: {
    flex: 1,
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    color: "#FFFFFF",
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontFamily: "Inter-SemiBold",
    color: "#333333",
    fontSize: 14,
  },
});