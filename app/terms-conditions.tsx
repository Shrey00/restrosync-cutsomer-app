import React from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@rneui/themed";
const TermsAndConditions = () => {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Eatsinn Terms and Conditions</Text>

        <Text style={styles.section}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By using the Eatsinn app, you agree to abide by these Terms and
          Conditions. If you do not agree, please do not use our services.
        </Text>

        <Text style={styles.section}>2. Service Scope</Text>
        <Text style={styles.paragraph}>
          Eatsinn is operated as a cloud kitchen managing multiple food brands
          under one roof. Orders can be placed for delivery or pickup through
          the app.
        </Text>

        <Text style={styles.section}>3. Orders and Payments</Text>
        <Text style={styles.paragraph}>
          - All orders are subject to availability and confirmation.
        </Text>
        <Text>
          - Payments must be made through the app's supported payment methods.
        </Text>
        <Text>- Additional fees such as delivery charges may apply.</Text>

        <Text style={styles.section}>4. Cancellations and Refunds</Text>
        <Text style={styles.paragraph}>
          Cancellations are subject to our policy. Refunds, if applicable, will
          be processed within 7 working days.
        </Text>

        <Text style={styles.section}>5. Liability</Text>
        <Text style={styles.paragraph}>
          Eatsinn is not liable for delays, incorrect orders, or any issues
          arising from third-party services.
        </Text>

        <Text style={styles.section}>6. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          Eatsinn reserves the right to modify these terms at any time.
          Continued use of the app implies acceptance of the updated terms.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
});

export default TermsAndConditions;
