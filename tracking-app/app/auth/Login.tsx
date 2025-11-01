import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../Firebase/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onLogin = async () => {
    setErr(null);
    if (!email || !password) {
      setErr("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)/explore");
    } catch (e: any) {
      const msg =
        e?.code === "auth/invalid-email"
          ? "That email looks invalid."
          : e?.code === "auth/user-not-found" || e?.code === "auth/wrong-password"
          ? "Incorrect email or password."
          : "Could not sign in. Please try again.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {
    setErr(null);
    if (!email) {
      setErr("Enter your email to reset your password.");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setErr("Password reset email sent check your inbox.");
    } catch (e: any) {
      setErr("Could not send reset email. Double-check your address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#001220", "#001C33", "#002B40"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.card}
      >
        <Text style={styles.title}>Log-In!</Text>
        <Text style={styles.subtitle}>Welcome back, Log-in to continue tracking</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#8FA9BF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <View style={{ width: "100%" }}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#8FA9BF"
            secureTextEntry={hide}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setHide((v) => !v)} style={styles.showBtn}>
            <Text style={styles.showText}>{hide ? "Show" : "Hide"}</Text>
          </TouchableOpacity>
        </View>

        {err ? <Text style={styles.error}>{err}</Text> : null}

        <TouchableOpacity style={[styles.cta, loading && styles.ctaDisabled]} onPress={onLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Log In</Text>}
        </TouchableOpacity>

        <View style={styles.linkRow}>
          <TouchableOpacity onPress={onResetPassword}>
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/auth/Signup")}>
            <Text style={styles.link}>Create account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Text style={styles.footer}>© 2025 GeoTrace</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#E0F7FA" },
  subtitle: { color: "#A7C7E7", marginBottom: 8 },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#E8F2F7",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  showBtn: { position: "absolute", right: 12, top: 12, padding: 6 },
  showText: { color: "#5AC8FA", fontWeight: "600" },
  error: { color: "#FF6B6B", marginTop: 4, marginBottom: 4 },
  cta: {
    marginTop: 6,
    backgroundColor: "#00C896",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#00C896",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaDisabled: { opacity: 0.7 },
  ctaText: { color: "#001C2A", fontWeight: "800", fontSize: 16, letterSpacing: 0.3 },
  linkRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  link: { color: "#5AC8FA", textDecorationLine: "underline" },
  footer: { position: "absolute", bottom: 28, color: "#5C8EAA" },
});
