import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import useLocationTracker from "../hooks/useLocationTracker";

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
}

export default function ExploreScreen() {
  const userId = "User_2"; 
  useLocationTracker(userId);

  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "locations"), (snapshot) => {
      const updated: LocationData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LocationData, "id">),
      }));
      setLocations(updated);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const initialLat = locations[0]?.latitude ?? 37.78825;
  const initialLng = locations[0]?.longitude ?? -122.4324;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: initialLat,
          longitude: initialLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            title={`${loc.id}`}
            description={
              loc.timestamp
                ? new Date(loc.timestamp).toLocaleString()
                : "No timestamp"
            }
            pinColor={loc.id === userId ? "blue" : "red"} 
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

