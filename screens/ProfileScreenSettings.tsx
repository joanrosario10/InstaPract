
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const ProfileScreenSettings: React.FC = () => {
  const [profilePicUri, setProfilePicUri] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("+91");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [altPhone, setAltPhone] = useState<string>("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showAltCountryPicker, setShowAltCountryPicker] = useState(false);

  useEffect(() => {
    // Load stored data
    const loadData = async () => {
      try {
        const countryCode =
          (await AsyncStorage.getItem("countryCode")) || "+91";
        const country = (await AsyncStorage.getItem("country")) || "";
        const state = (await AsyncStorage.getItem("state")) || "";
        const city = (await AsyncStorage.getItem("city")) || "";
        const phoneNumber = (await AsyncStorage.getItem("phone")) || "";
        const altPhoneNumber = (await AsyncStorage.getItem("altPhone")) || "";

        setSelectedCountryCode(countryCode);
        setSelectedCountry(country);
        setSelectedState(state);
        setSelectedCity(city);
        setPhone(phoneNumber);
        setAltPhone(altPhoneNumber);
      } catch (error) {
        console.error("Failed to load data from AsyncStorage", error);
      }
    };

    loadData();
  }, []);

  const handleProfilePicSelect = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setProfilePicUri(uri);
    }
  };

  const handleUpdate = async () => {
    try {
      await AsyncStorage.setItem("countryCode", selectedCountryCode);
      await AsyncStorage.setItem("country", selectedCountry);
      await AsyncStorage.setItem("state", selectedState);
      await AsyncStorage.setItem("city", selectedCity);
      await AsyncStorage.setItem("phone", phone);
      await AsyncStorage.setItem("altPhone", altPhone);

      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Success",
        text2: "You have successfully updated your profile.",
      });
    } catch (error) {
      console.error("Failed to save data to AsyncStorage", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "Failed to update your profile.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Profile</Text>

        {/* Profile Picture */}
        <View style={styles.profilePicContainer}>
          <TouchableOpacity
            style={styles.profilePicPlaceholder}
            onPress={handleProfilePicSelect}
          >
            <Image
              source={
                profilePicUri
                  ? { uri: profilePicUri }
                  : require("../assets/images/imge2.png")
              }
              style={styles.profilePic}
            />
            <Text style={styles.addProfilePicText}>
              Add your Profile Picture
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Contact Details</Text>

        {/* Name */}
        <View style={styles.inputContainer}>
          <Text>First Name</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text>Last Name</Text>
          <TextInput style={styles.input} />
        </View>

        {/* Address */}
        <View style={styles.inputContainer}>
          <Text>Address</Text>
          <TextInput style={styles.input} multiline />
        </View>

        {/* Country */}
        <View style={styles.inputContainer}>
          <Text>Country</Text>
          <TextInput
            style={styles.input}
            value={selectedCountry}
            onChangeText={setSelectedCountry}
            placeholder="Enter Country"
          />
        </View>

        {/* State */}
        <View style={styles.inputContainer}>
          <Text>State</Text>
          <TextInput
            style={styles.input}
            value={selectedState}
            onChangeText={setSelectedState}
            placeholder="Enter State"
          />
        </View>

        {/* City */}
        <View style={styles.inputContainer}>
          <Text>City</Text>
          <TextInput
            style={styles.input}
            value={selectedCity}
            onChangeText={setSelectedCity}
            placeholder="Enter City"
          />
        </View>

        {/* Zipcode */}
        <View style={styles.inputContainer}>
          <Text>Zipcode</Text>
          <TextInput style={styles.input} keyboardType="numeric" />
        </View>

        {/* Mobile Number */}
        <View style={styles.inputContainer}>
          <Text>Mobile Number</Text>
          <View style={styles.phoneContainer}>
            <TouchableOpacity
              onPress={() => setShowCountryPicker(true)}
              style={styles.countryButton}
            >
              <Text style={styles.countryButtonText}>
                {selectedCountryCode || "Select Country"}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* Alternative Mobile Number */}
        <View style={styles.inputContainer}>
          <Text>Alternative Mobile Number</Text>
          <View style={styles.phoneContainer}>
            <TouchableOpacity
              onPress={() => setShowAltCountryPicker(true)}
              style={styles.countryButton}
            >
              <Text style={styles.countryButtonText}>
                {selectedCountryCode || "Select Country"}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              keyboardType="phone-pad"
              value={altPhone}
              onChangeText={setAltPhone}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Login Credentials</Text>

        {/* User Name / Email ID */}
        <View style={styles.inputContainer}>
          <Text>User Name / Email ID</Text>
          <TextInput style={styles.input} />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text>Password</Text>
          <TextInput style={styles.input} secureTextEntry />
        </View>

        {/* Re-type Password */}
        <View style={styles.inputContainer}>
          <Text>Re-type Password</Text>
          <TextInput style={styles.input} secureTextEntry />
        </View>

        {/* Update Button */}
        <View style={styles.inputContainer}>
          <Button title="Update" onPress={handleUpdate} />
        </View>

        {/* Country Picker Modals */}
        {/* Add your CountryPicker components here if needed */}
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  profilePicContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePicPlaceholder: {
    alignItems: "center",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  addProfilePicText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007bff",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  countryButtonText: {
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
  },
});

export default ProfileScreenSettings;
