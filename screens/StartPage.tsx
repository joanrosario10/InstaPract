import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types"; 

const { width, height } = Dimensions.get("window");

const StartPage: React.FC = () => {
  const navigation = useNavigation<RootStackParamList>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.semicircleContainer}>
        <View style={styles.semicircle} />
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Instapract{"\n"}
          User Centric{"\n"}
          Teleconsulting,{"\n"}
          Expert Opinion{"\n"}
          Platform.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  semicircleContainer: {
    width: width,
    height: height * 0.6, 
    justifyContent: "center",
    alignItems: "center",
  },
  semicircle: {
    width: width,
    height: height * 0.3, 
    backgroundColor: "#007BFF", 
    borderTopLeftRadius: width / 2,
    borderTopRightRadius: width / 2,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
    position: "absolute",
    bottom: -180,
  },
  overlay: {
    position: "absolute",
    bottom: -120,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.9, 
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#007BFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  textContainer: {
    position: "absolute",
    left: 20,
    top: 50,
    width: width * 0.6,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  text: {
    marginTop: 95,
    fontSize: 35,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "auto",
  },
});

export default StartPage;
