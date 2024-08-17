import React, { useState } from "react";
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
import Toast from "react-native-toast-message"; // Import Toast
import { NavigationProps } from "../types"; // Import the navigation types
import doctorListData from "../data/doctorListData.json";
import doctorAvailabilityData from "../data/doctorAvailabilityData.json";
import { Ionicons } from "@expo/vector-icons";

// Define TypeScript interfaces for your data
interface Doctor {
  id: string;
  name: string;
  profile_picture: string;
  specialty: { name: string }[];
}

interface AvailabilitySlot {
  day: string;
  start_time: string;
  end_time: string;
}

interface DoctorAvailability {
  doctor_id: string;
  available_slots: AvailabilitySlot[];
}

// Props for FlatList item
interface DoctorListItemProps {
  item: Doctor;
}

const { width, height } = Dimensions.get("window");

const DoctorsScreen: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProps>(); // Use the defined type

  const showToast = (message: string, type: "success" | "info" | "error") => {
    Toast.show({
      type: type,
      position: "bottom",
      text1: message,
    });
  };

  const toggleFavorite = (doctorId: string) => {
    const isFavorite = favorites.includes(doctorId);
    setFavorites((prevFavorites) =>
      isFavorite
        ? prevFavorites.filter((id) => id !== doctorId)
        : [...prevFavorites, doctorId]
    );
    showToast(
      isFavorite ? "Removed from favorites" : "Added to favorites",
      isFavorite ? "info" : "success"
    );
  };

  const renderDoctor = ({ item }: { item: Doctor }) => {
    // Find availability for the doctor
    const availability = doctorAvailabilityData.data.find(
      (a: DoctorAvailability) => a.doctor_id === item.id
    );

    return (
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
          {availability ? (
            <View style={styles.availabilityContainer}>
              {availability.available_slots.length > 0 ? (
                availability.available_slots.map((slot, index) => (
                  <Text key={index} style={styles.slot}>
                    {slot.day}: {slot.start_time} - {slot.end_time}
                  </Text>
                ))
              ) : (
                <Text>No available slots</Text>
              )}
            </View>
          ) : (
            <Text>No availability data</Text>
          )}
        </View>
      </View>
    );
  };

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
              onPress={() => navigation.navigate("ProfileScreen")} // Use the defined type
            >
              <Ionicons name="person-outline" size={24} color={"black"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.title}>List of Available Doctors</Text>
      <FlatList
        data={doctorListData.data}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: height * 0.02,
    backgroundColor: "#FFF",
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    borderRadius: 20,
    width: "100%",
    height: height * 0.12,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.2,
  },
  headerInfo: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    marginRight: width * 0.03,
  },
  textInfo: {
    alignItems: "flex-start",
  },
  userInfo: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#2A9FBC",
  },
  userId: {
    fontSize: width * 0.03,
    color: "#666",
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.02,
  },
  doctorList: {
    flexGrow: 1,
  },
  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: width * 0.04,
    marginBottom: height * 0.01,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    marginRight: width * 0.05,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  doctorName: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
  },
  doctorSpecialty: {
    fontSize: width * 0.04,
    color: "#666",
  },
  availabilityContainer: {
    marginTop: height * 0.01,
  },
  slot: {
    fontSize: width * 0.04,
    color: "#333",
  },
  favoriteButton: {
    padding: width * 0.02,
  },
  favoriteIcon: {
    fontSize: width * 0.05,
    color: "#FF5C5C", // Heart icon color
  },
});

export default DoctorsScreen;
