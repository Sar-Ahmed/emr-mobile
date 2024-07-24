import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

type RootStackParamList = {
  Login: undefined;
  DashboardTabNavigation: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DashboardTabNavigation"
>;

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [missingField, setMissingField] = useState<string[]>([]);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    let missing = [];
    if (!username) {
      missing.push("username");
    } else if (!password) {
      missing.push("password");
    }
    setMissingField(missing);
    if (missing.length === 0) {
      Alert.alert("Welcome", "Login Successful", [
        {
          text: "OK",
          onPress: () => navigation.navigate("DashboardTabNavigation"),
        },
      ]);
    } else {
      Alert.alert("Login error", `Please fill all the fields!`);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/vistacan-logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>VISTACAN EMR</Text>
      <View style={styles.buttonContainer}></View>
      <TextInput
        style={[
          styles.input,
          missingField.includes("username")
            ? styles.inputBorderError
            : styles.inputBorder,
        ]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[
          styles.input,
          missingField.includes("password")
            ? styles.inputBorderError
            : styles.inputBorder,
        ]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
  },
  logo: {
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputBorder: {
    borderColor: "#ccc",
  },
  inputBorderError: {
    borderColor: "red",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
