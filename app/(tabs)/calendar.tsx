import { StyleSheet, View, Text } from "react-native";

export default function Calendar() {
  return (
    <View style={styles.container}>
      <Text>Calender Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
});
