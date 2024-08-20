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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import UUID from "react-native-uuid"; // Import react-native-uuid

type RootStackParamList = {
  DoctorListScreen: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DoctorListScreen"
>;

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: "https://uae-saas-api.instapract.ae/web/api/default",
  headers: {
    "Content-Type": "application/json",
    APPID: "Gem3s12345",
  },
});

// Interceptor to add token to requests
api.interceptors.request.use(
  async (config) => {
    const authToken = await AsyncStorage.getItem("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh token logic here, if applicable
        // Example:
        // const { data } = await api.post("/refresh-token");
        // await AsyncStorage.setItem("authToken", data.accessToken);
        // return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.removeItem("authToken");
        // Redirect to login or show a message
        // navigation.navigate("LoginScreen");
      }
    }
    return Promise.reject(error);
  }
);

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
    const deviceId = UUID.v4();
    const osId = "b93a9204-ee21-4cf9-8a94-cf5eeabf7301";
    const roleId = "143f37f2-ca38-0ab1-2489-1e47113655fc";
    const language = "da315627-3ece-2016-c628-b61dc5ee9be0";

    const loginPayload = {
      username: email,
      password: password,
      device_id: deviceId,
      os_id: osId,
      role_id: roleId,
      language: language,
    };

    try {
      const response = await api.post("/login", loginPayload);
      const data = response.data;

      if (data.success) {
        const token = data.data.access_token; // Correctly access the access_token

        if (token) {
          // Store the valid token and user profile in AsyncStorage
          await AsyncStorage.setItem("authToken", token);

          const userProfile = {
            profile_picture: data.data.PatientProfile.profile_picture || "",
            display_name:
              `${data.data.PatientProfile.first_name} ${data.data.PatientProfile.last_name}` ||
              "User",
            id: data.data.PatientProfile.id || "",
          };

          await AsyncStorage.setItem(
            "userProfile",
            JSON.stringify(userProfile)
          );
          await AsyncStorage.setItem("patientUserId", data.data.User.id); // Store User ID

          // Handle "Remember Me" feature
          if (rememberMe) {
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("password", password);
            await AsyncStorage.setItem("rememberMe", "true");
          } else {
            await AsyncStorage.removeItem("email");
            await AsyncStorage.removeItem("password");
            await AsyncStorage.removeItem("rememberMe");
          }

          // Navigate to the next screen
          navigation.navigate("DoctorListScreen");
        } else {
          console.error("No access token found in response.");
          setLoginError("Failed to retrieve access token.");
        }
      } else {
        console.error("Login failed:", data.msg);
        setLoginError(data.msg || "Invalid username or password");
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      setLoginError("An error occurred. Please try again.");
    }
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
