import {
  StyleSheet,
  View,
  Text,
} from "react-native";

export default function Dashboard() {

  return (
    <View style={styles.container}>
     <Text>Dashboard Screen</Text>
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
