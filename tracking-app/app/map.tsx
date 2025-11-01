import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../Firebase/firebaseConfig";
import { router } from "expo-router";

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  userId?: string;
}

export default function MapScreen() {
  const user = auth.currentUser;
  const userId = user?.uid ?? null;

  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      Alert.alert("Not Logged In", "Please log in to view the map.");
      router.replace("/auth/Login");
      return;
    }

    const q = query(collection(db, "locations"), where("userId", "==", userId));
    const unSub = onSnapshot(q, (snapshot) => {
      const updated: LocationData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LocationData, "id">),
      }));
      setLocations(updated);
      setLoading(false);
    });

    return () => unSub();
  }, [userId]);

  const initialRegion = useMemo(() => {
    const lat = locations[0]?.latitude ?? 35.4955;
    const lng = locations[0]?.longitude ?? -97.5410;
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [locations]);

  if (!userId) return null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={`📍 ${new Date(
              loc.timestamp ?? Date.now()
            ).toLocaleString()}`}
            pinColor="blue"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#001220" },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
