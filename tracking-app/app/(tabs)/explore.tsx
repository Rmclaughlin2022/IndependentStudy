import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList, TouchableOpacity,} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../../Firebase/firebaseConfig";
import useLocationTracker from "../hooks/useLocationTracker";
import { router } from "expo-router";

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  userId?: string;
}

interface DeviceData {
  id: string;          
  name?: string;      
  deviceId?: string;   
  userId?: string;    
  lastLat?: number;
  lastLng?: number;
  lastUpdated?: string;
}

export default function ExploreScreen() {
  const user = auth.currentUser;
  const userId = user?.uid ?? null;

  useLocationTracker(userId);

  const [locations, setLocations] = useState<LocationData[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(true);

  // If not logged in, go to login
  useEffect(() => {
    if (!userId) {
      Alert.alert("Not Logged In", "Please log in to continue.");
      router.replace("/auth/Login");
    }
  }, [userId]);

  // Subscribe to user locations
  useEffect(() => {
    if (!userId) return;

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

  useEffect(() => {
    if (!userId) return;

    const dq = query(collection(db, "devices"), where("userId", "==", userId));
    const unSub = onSnapshot(dq, (snapshot) => {
      const list: DeviceData[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<DeviceData, "id">),
      }));
      setDevices(list);
      setLoadingDevices(false);
    });

    return () => unSub();
  }, [userId]);

  if (!userId) return null;

  const initialRegion = useMemo(() => {
    const lat = locations[0]?.latitude ?? 35.4955;
    const lng = locations[0]?.longitude ?? -97.5410; // OCU default
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [locations]);

  const openMap = () => router.push("/map");
  const addDevice = () => router.push("/addDevice"); 

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.outlineBtn} onPress={openMap}>
            <Text style={styles.outlineBtnText}>Open Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={addDevice}>
            <Text style={styles.primaryBtnText}>Add Device</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="small" color="#00C896" />
          </View>
        ) : (
          // mini map
          <MapView style={styles.miniMap} initialRegion={initialRegion}>
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
        )}
        <View style={styles.cardFooter}>
          <Text style={styles.cardTitle}>Recent Locations</Text>
          <TouchableOpacity onPress={openMap}>
            <Text style={styles.link}>View full map</Text>
          </TouchableOpacity>
        </View>
      </View>

{/* Device list */}
      <View style={[styles.card, { flex: 1 }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Connected Devices</Text>
          <TouchableOpacity onPress={addDevice}>
            <Text style={styles.link}>Add</Text>
          </TouchableOpacity>
        </View>

        {loadingDevices ? (
          <View style={styles.center}>
            <ActivityIndicator size="small" color="#00C896" />
          </View>
        ) : devices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No devices yet</Text>
            <Text style={styles.emptyText}>
              Tap “Add” or the “Add Device” button above to connect one.
            </Text>
          </View>
        ) : (
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.deviceRow}>
                <View>
                  <Text style={styles.deviceName}>
                    {item.name ?? "Unnamed Device"}
                  </Text>
                  {item.deviceId ? (
                    <Text style={styles.deviceMeta}>ID: {item.deviceId}</Text>
                  ) : null}
                </View>
                {item.lastLat != null && item.lastLng != null ? (
                  <Text style={styles.deviceMeta}>
                    {item.lastLat.toFixed(4)}, {item.lastLng.toFixed(4)}
                  </Text>
                ) : (
                  <Text style={styles.deviceMeta}>No location yet</Text>
                )}
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const PAD = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001220",
    padding: PAD,
    gap: PAD,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#E0F7FA", fontSize: 24, fontWeight: "800" },
  headerButtons: { flexDirection: "row", gap: 10 },
  outlineBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  outlineBtnText: { color: "#A7C7E7", fontWeight: "600" },
  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#00C896",
    shadowColor: "#00C896",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryBtnText: { color: "#001C2A", fontWeight: "800" },
  card: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  miniMap: { width: "100%", height: 180 },
  cardFooter: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  cardTitle: { color: "#E0F7FA", fontSize: 16, fontWeight: "700" },
  link: { color: "#5AC8FA", textDecorationLine: "underline" },
  center: { padding: 20, alignItems: "center", justifyContent: "center" },
  emptyState: { padding: 16, gap: 4 },
  emptyTitle: { color: "#E0F7FA", fontWeight: "700" },
  emptyText: { color: "#A7C7E7" },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 12,
  },
  deviceRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deviceName: { color: "#E0F7FA", fontSize: 16, fontWeight: "700" },
  deviceMeta: { color: "#A7C7E7", fontSize: 12 },
});
