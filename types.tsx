import { StackNavigationProp } from "@react-navigation/stack";

export type NavigationProps = StackNavigationProp<
  RootStackParamList,
  "DoctorsScreen"
>;

// Define RootStackParamList with your screen names
export type RootStackParamList = {
  navigate(arg0: string): void;
  DoctorsScreen: { userProfile: any };
  ProfileScreenSettings: undefined;
  LoginScreen: { userProfile: any };
  DoctorListScreen: { userProfile: any };
  ProfileScreen: { userProfile: any };
};
