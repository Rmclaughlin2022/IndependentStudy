import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function useLocationTracker(userId) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location access is required.");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        const timestamp = new Date().toISOString();

        const newLocation = { latitude, longitude, timestamp };
        setLocation(newLocation);

        await setDoc(doc(db, "locations", userId), newLocation);
        console.log("✅ Location saved:", newLocation);
      } catch (error) {
        console.error("Error getting/saving location:", error);
      }
    })();
  }, [userId]);

  return location;
}

