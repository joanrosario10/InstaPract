import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import loginData from "../data/loginData.json";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  DoctorListScreen: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DoctorListScreen"
>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("email");
        const savedPassword = await AsyncStorage.getItem("password");
        const savedRememberMe = await AsyncStorage.getItem("rememberMe");

        if (savedRememberMe === "true") {
          setRememberMe(true);
          if (savedEmail) setEmail(savedEmail);
          if (savedPassword) setPassword(savedPassword);
        }
      } catch (error) {
        console.error("Error loading credentials:", error);
      }
    };

    loadCredentials();
  }, []);

  const handleLogin = async () => {
    console.log("Entered Email:", email);
    console.log("Entered Password:", password);

    setTimeout(async () => {
      const user = loginData.data.User;

      if (email === user.email && password === "Test@123") {
        console.log("Login Successful:", user);
        setLoginError("");

        try {
          if (rememberMe) {
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("password", password);
            await AsyncStorage.setItem("rememberMe", "true");
          } else {
            await AsyncStorage.removeItem("email");
            await AsyncStorage.removeItem("password");
            await AsyncStorage.removeItem("rememberMe");
          }
          const token = "dummy-auth-token";
          await AsyncStorage.setItem("authToken", token);

          navigation.navigate("DoctorListScreen");
        } catch (error) {
          console.error("Error handling credentials:", error);
        }
      } else {
        setLoginError("Invalid username or password");
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Icon
            name={passwordVisible ? "visibility" : "visibility-off"}
            size={24}
            color="#2A9FBC"
          />
        </TouchableOpacity>
      </View>
      {loginError ? <Text style={styles.error}>{loginError}</Text> : null}
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setRememberMe(!rememberMe)}
        >
          {rememberMe && <View style={styles.checkboxChecked} />}
        </TouchableOpacity>
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2A9FBC",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 12,
  },
  passwordToggle: {
    position: "absolute",
    right: 10,
    top: 12,
    height: 40,
    justifyContent: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    width: 16,
    height: 16,
    backgroundColor: "#2A9FBC",
    borderRadius: 2,
  },
});

export default LoginScreen;
