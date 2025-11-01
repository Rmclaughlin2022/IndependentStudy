import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../Firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignupScreen() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSignup = async () => {
    setErr(null);
    if (!displayName || !email || !password) {
      setErr("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: displayName.trim() });

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: displayName.trim(),
        createdAt: serverTimestamp(),
      });

      router.replace("/(tabs)/explore");
    } catch (e: any) {
      const msg =
        e?.code === "auth/email-already-in-use"
          ? "An account with this email already exists."
          : e?.code === "auth/invalid-email"
          ? "That email looks invalid."
          : e?.code === "auth/weak-password"
          ? "Please choose a stronger password (min 6 characters)."
          : "Could not create account. Please try again.";
      setErr(msg);
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
        <Text style={styles.title}>Sign-Up</Text>
        <Text style={styles.subtitle}>Create your account to start tracking!</Text>

        <TextInput
          placeholder="Display name"
          placeholderTextColor="#8FA9BF"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />

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

        <TouchableOpacity style={[styles.cta, loading && styles.ctaDisabled]} onPress={onSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Create Account</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/Login")}>
          <Text style={styles.switchText}>Already have an account? Log-in</Text>
        </TouchableOpacity>
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
  switchText: { color: "#5AC8FA", textAlign: "center", marginTop: 12, textDecorationLine: "underline" },
  footer: { position: "absolute", bottom: 28, color: "#5C8EAA" },
});
