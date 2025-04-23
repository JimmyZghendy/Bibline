"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Phone, X, ChevronRight, Check } from "react-native-feather";

const { width } = Dimensions.get("window");

// Mock function to simulate sending a verification code
const sendVerificationCode = (phoneNumber: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, always succeed
      resolve(true);
    }, 1500);
  });
};

// Mock function to verify the code
const verifyCode = (phoneNumber: string, code: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, any 6-digit code is valid
      resolve(code.length === 6);
    }, 1500);
  });
};

interface LoginPopupProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: (phoneNumber: string) => void;
  theme: any; // Theme object from the app
}

const LoginPopup: React.FC<LoginPopupProps> = ({
  visible,
  onClose,
  onLoginSuccess,
  theme,
}) => {
  const [step, setStep] = useState(1); // 1: Phone number, 2: Verification code
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeInputs, setCodeInputs] = useState<Array<string>>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const codeInputRefs = useRef<Array<TextInput | null>>([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setStep(1);
      setPhoneNumber("");
      setVerificationCode("");
      setError("");
      setCodeInputs(["", "", "", "", "", ""]);
      setIsLoading(false);

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSendCode = async () => {
    // Basic validation
    if (phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const success = await sendVerificationCode(phoneNumber);
      if (success) {
        setStep(2);
      } else {
        setError("Failed to send verification code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const code = codeInputs.join("");
    if (code.length !== 6) {
      setError("Please enter a valid verification code");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const success = await verifyCode(phoneNumber, code);
      if (success) {
        // Show success animation before closing
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => {
            onLoginSuccess(phoneNumber);
          }, 500);
        });
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeInputChange = (text: string, index: number) => {
    // Update the code input array
    const newCodeInputs = [...codeInputs];
    newCodeInputs[index] = text;

    // Only allow numbers
    if (text && !/^[0-9]$/.test(text)) {
      return;
    }

    setCodeInputs(newCodeInputs);
    setVerificationCode(newCodeInputs.join(""));

    // Auto-focus next input if current input is filled
    if (text.length === 1 && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (e: any, index: number) => {
    // Handle backspace - move to previous input
    if (e.nativeEvent.key === "Backspace" && index > 0 && !codeInputs[index]) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCloseModal = () => {
    // Animate out before closing
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Animated.View
            style={[
              styles.overlay,
              {
                backgroundColor: "rgba(0,0,0,0.5)",
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableWithoutFeedback onPress={handleCloseModal}>
              <View style={styles.overlayTouch} />
            </TouchableWithoutFeedback>

            <Animated.View
              style={[
                styles.modalContent,
                {
                  backgroundColor: theme.card,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {step === 1 ? "Login with Phone" : "Verify Code"}
                </Text>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                >
                  <X stroke={theme.text} width={24} height={24} />
                </TouchableOpacity>
              </View>

              {step === 1 ? (
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>
                    Phone Number
                  </Text>
                  <View
                    style={[
                      styles.phoneInputContainer,
                      {
                        borderColor: error
                          ? "#ff4d4f"
                          : theme.border || "#e2e8f0",
                      },
                    ]}
                  >
                    <Phone
                      stroke={theme.text}
                      width={20}
                      height={20}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.phoneInput, { color: theme.text }]}
                      placeholder="Enter your phone number"
                      placeholderTextColor={theme.text + "80"}
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      maxLength={15}
                    />
                  </View>
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: theme.primary || "#7c3aed" },
                      isLoading && styles.disabledButton,
                    ]}
                    onPress={handleSendCode}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Send Code</Text>
                        <ChevronRight stroke="#fff" width={20} height={20} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>
                    Verification Code
                  </Text>
                  <Text
                    style={[
                      styles.verificationText,
                      { color: theme.text + "99" },
                    ]}
                  >
                    Enter the 6-digit code sent to {phoneNumber}
                  </Text>

                  <View style={styles.codeInputContainer}>
                    {codeInputs.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (codeInputRefs.current[index] = ref)}
                        style={[
                          styles.codeInput,
                          {
                            borderColor: error
                              ? "#ff4d4f"
                              : theme.border || "#e2e8f0",
                            color: theme.text,
                            backgroundColor:
                              theme.card === theme.background
                                ? theme.background + "20"
                                : theme.background,
                          },
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) =>
                          handleCodeInputChange(text, index)
                        }
                        onKeyPress={(e) => handleCodeKeyPress(e, index)}
                      />
                    ))}
                  </View>

                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: theme.primary || "#7c3aed" },
                      isLoading && styles.disabledButton,
                    ]}
                    onPress={handleVerifyCode}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Verify</Text>
                        <Check stroke="#fff" width={20} height={20} />
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={() => {
                      setStep(1);
                      setError("");
                    }}
                  >
                    <Text
                      style={[
                        styles.resendText,
                        { color: theme.primary || "#7c3aed" },
                      ]}
                    >
                      Change phone number
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  errorText: {
    color: "#ff4d4f",
    marginBottom: 16,
  },
  verificationText: {
    marginBottom: 20,
    fontSize: 14,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
    marginTop: 16,
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default LoginPopup;
