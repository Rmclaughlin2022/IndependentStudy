import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { db } from "../app/firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore";

export default function useLocationTracker(userId) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, 
          distanceInterval: 5, 
        },
        async (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            timestamp: new Date().toISOString(),
          };
          setLocation(coords);
          await setDoc(doc(db, "deviceLocations", userId), coords);
        }
      );

      return () => subscriber.remove();
    })();
  }, [userId]);

  return location;
}
