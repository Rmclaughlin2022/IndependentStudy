import React, { useEffect, useState}  from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";

interface Tdata {
  name: string;
  age: string;
  email: string;
  password: string;
  steps: number;
  date: string; 
}

export default function App() {
  const [data, setData] = useState<Tdata[]>([]);

  async function addSample(): Promise<void> {
    await addDoc(collection(db, "trackingData"), {
      steps: Math.floor(Math.random() * 10000),
      date: new Date().toISOString(),
    });
    fetchData();
  }


  async function fetchData(): Promise<void> {
    const snapshot = await getDocs(collection(db, "trackingData"));
    const items: Tdata[] = snapshot.docs.map((doc) => doc.data() as Tdata);
    setData(items);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Add Steps" onPress={addSample} />
      {data.map((item, i) => (
        <Text key={i}>
          {item.date}: {item.steps} steps
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});