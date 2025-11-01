import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function StartScreen() {
  const handleStart = () => {
    router.push("/auth/Signup"); 
  };

  const handleSignIn = () => {
    router.push("/auth/Login");
  };

  return (
    <LinearGradient
      colors={["#001220", "#001C33", "#002B40"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/NewGeoTraceLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          Track. Connect. Locate. in real time.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <LinearGradient
          colors={["#00C896", "#1E90FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Start Tracking</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignIn}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© 2025 GeoTrace Technologies</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 100,
  },
  logo: {
    width: 320,
    height: 320,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#E0F7FA",
    marginBottom: 10,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#A7C7E7",
    textAlign: "center",
    maxWidth: 280,
  },
  button: {
    width: "75%",
    borderRadius: 40,
    overflow: "hidden",
    shadowColor: "#00C896",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  signInText: {
    color: "#5AC8FA",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    color: "#5C8EAA",
    fontSize: 14,
  },
});
