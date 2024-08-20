import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Doctor {
  id: string;
  name: string;
  profile_picture: string;
  specialty: { name: string }[];
}

interface DoctorListResponse {
  success: boolean;
  msg: string;
  data: Doctor[];
}

const { width, height } = Dimensions.get("window");

const DoctorsScreen: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigation = useNavigation();

  const showToast = (message: string, type: "success" | "info" | "error") => {
    Toast.show({
      type: type,
      position: "bottom",
      text1: message,
    });
  };

  const fetchDoctors = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const patientUserId = await AsyncStorage.getItem("patientUserId");

      if (!authToken || !patientUserId) {
        showToast(
          "Auth token or patient user ID is missing. Please log in again.",
          "error"
        );
        return;
      }

      const response = await axios.post<DoctorListResponse>(
        "https://uae-saas-api.instapract.ae/web/api/doctor/doc-list",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            APPID: "Gem3s12345",
          },
        }
      );

      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        showToast("Failed to fetch doctors: " + response.data.msg, "error");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const toggleFavorite = async (doctorId: string) => {
    try {
      const isFavorite = favorites.includes(doctorId);
      if (isFavorite) {
        await removeFromFavorites(doctorId);
      } else {
        await addToFavorites(doctorId);
      }
      setFavorites((prevFavorites) =>
        isFavorite
          ? prevFavorites.filter((id) => id !== doctorId)
          : [...prevFavorites, doctorId]
      );
      showToast(
        isFavorite ? "Removed from favorites" : "Added to favorites",
        isFavorite ? "info" : "success"
      );
    } catch (error) {
      showToast("An error occurred while updating favorites", "error");
    }
  };

  const addToFavorites = async (doctorId: string) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const patientUserId = await AsyncStorage.getItem("patientUserId");

      if (!authToken || !patientUserId || !doctorId) {
        showToast(
          "Missing required information. Please check your credentials.",
          "error"
        );
        return;
      }

      const response = await axios.post(
        "https://uae-saas-api.instapract.ae/web/api/patient/add-my-providers",
        {
          PatientMyProviders: {
            doctor_user_id: doctorId,
            is_deleted: "no",
            patient_user_id: patientUserId,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            APPID: "Gem3s12345",
          },
        }
      );

      if (!response.data.success) {
        showToast("Error adding to favorites: " + response.data.msg, "error");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const removeFromFavorites = async (doctorId: string) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const patientUserId = await AsyncStorage.getItem("patientUserId");

      if (!authToken || !patientUserId || !doctorId) {
        showToast(
          "Missing required information. Please check your credentials.",
          "error"
        );
        return;
      }

      const response = await axios.post(
        "https://uae-saas-api.instapract.ae/web/api/patient/add-my-providers",
        {
          PatientMyProviders: {
            doctor_user_id: doctorId,
            is_deleted: "yes",
            patient_user_id: patientUserId,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            APPID: "Gem3s12345",
          },
        }
      );

      if (!response.data.success) {
        showToast(
          "Error removing from favorites: " + response.data.msg,
          "error"
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error: any) => {
    if (error.response) {
      showToast("An error occurred while updating favorites", "error");
    } else if (error.request) {
      showToast("No response from the server", "error");
    } else {
      showToast("An error occurred while setting up the request", "error");
    }
  };

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      <Image
        source={{ uri: item.profile_picture }}
        style={styles.doctorImage}
      />
      <View style={styles.doctorInfo}>
        <View style={styles.doctorHeader}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            style={styles.favoriteButton}
          >
            <Text style={styles.favoriteIcon}>
              {favorites.includes(item.id) ? "♥" : "♡"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.doctorSpecialty}>
          {item.specialty[0]?.name || "N/A"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo1.png")}
          style={styles.logo}
        />
        <View style={styles.headerInfo}>
          <View style={styles.profileSection}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileScreen")}
            >
              <Ionicons name="person-outline" size={24} color={"black"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.title}>List of Available Doctors</Text>
      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.doctorList}
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.01,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.2,
    resizeMode: "contain",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileSection: {
    marginLeft: width * 0.05,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: height * 0.02,
  },
  doctorList: {
    paddingBottom: height * 0.1,
  },
  doctorCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginVertical: height * 0.01,
    padding: width * 0.02,
    alignItems: "center",
  },
  doctorImage: {
    width: width * 0.2,
    height: height * 0.1,
    borderRadius: 8,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: width * 0.02,
  },
  doctorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  favoriteButton: {
    padding: width * 0.02,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#555",
  },
});

export default DoctorsScreen;
