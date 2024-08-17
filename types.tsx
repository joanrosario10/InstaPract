import { StackNavigationProp } from "@react-navigation/stack";

export type NavigationProps = StackNavigationProp<
  RootStackParamList,
  "DoctorsScreen"
>;

// Define RootStackParamList with your screen names
export type RootStackParamList = {
  navigate(arg0: string): void;
  DoctorsScreen: undefined;
  ProfileScreen: undefined;
  // Add other screens here
};
