import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width, height } = Dimensions.get("window");

type RootStackParamList = {
  ProfileScreen: undefined;
  LoginScreen: undefined;
  ProfileScreenSettings: undefined; // Add this line
};

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProfileScreen"
>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = () => {
    console.log("Logout clicked");
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  const handleProfileImagePress = () => {
    navigation.navigate("ProfileScreenSettings"); // Navigate to ProfileScreenSettings
  };

  const user = {
    profile_picture:
      "https://uae-saas-api.instapract.ae/web/images/profileimages/361696706_attachement_1551682091.png",
    display_name: "Michael Allwyn",
    id: "b6d368b0-852d-4ea1-8b8b-2f5168fc7e10",
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfileImagePress}>
        <Image
          source={{
            uri: user.profile_picture,
          }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <Text style={styles.userName}>{user.display_name}</Text>
      <Text style={styles.userId}>User ID: {user.id}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    padding: width * 0.05,
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    marginBottom: height * 0.02,
  },
  userName: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.01,
  },
  userId: {
    fontSize: width * 0.04,
    color: "#666",
    marginBottom: height * 0.05,
  },
  logoutButton: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    backgroundColor: "#FF5C5C",
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFF",
    fontSize: width * 0.04,
  },
});

export default ProfileScreen;
