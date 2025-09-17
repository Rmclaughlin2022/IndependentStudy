import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Ryan's Tracking App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
