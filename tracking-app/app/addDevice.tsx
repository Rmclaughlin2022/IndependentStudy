import React from "react";
import { Button, View, Text } from "react-native";
import { useBLE, requestPermissions } from "./hooks/useBLE"; 
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddDeviceScreen() {
  const { scanForDevices, allDevices, connectToDevice, connectedDevice } = useBLE();

  const handleConnectPress = async () => {
    console.log("Connect button pressed");
    const isAuthorized = await requestPermissions();
    console.log("Permissions granted?", isAuthorized);

    if (!isAuthorized) {
      console.log("Bluetooth permissions not granted");
      return;
    }

    console.log("Starting scan...");
    scanForDevices();
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Button title="Connect" onPress={handleConnectPress} />

      {connectedDevice && (
        <Text style={{ marginTop: 16 }}>
          Connected to: {connectedDevice.name ?? connectedDevice.id}
        </Text>
      )}

      {allDevices.map((d) => (
        <View key={d.id} style={{ marginTop: 8 }}>
          <Text onPress={() => connectToDevice(d)}>
            {d.name ?? "Unnamed"} ({d.id})
          </Text>
        </View>
      ))}
    </SafeAreaView>
  );
}
