
# Instapract

Instapract is an Instagram-like application built using Expo and React Native. The app features user authentication, dynamic photo uploads, and a navigation system to manage various screens within the app.

## Features

- **User Authentication**: Users can log in using their email and password.
- **Password Visibility Toggle**: Users can toggle the visibility of their password.
- **Remember Me**: Option to remember login credentials using AsyncStorage.
- **Dynamic Photo Uploads**: Users can upload and view photos.
- **Navigation**: Navigation between different screens such as Login and DoctorList using React Navigation.
- **Responsive Design**: Designed to work on iOS and  Android

## Getting Started

To get a local copy of the project up and running, follow these steps:

### Prerequisites

- Node.js
- Expo CLI

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/joanrosario10/Instapract.git
   cd Instapract
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the app:**

   ```sh
   expo start
   ```

   This command will start the development server and open the Expo DevTools in your browser.

### Configuration

#### Expo Configuration

Ensure that the `app.json` or `app.config.js` file is correctly set up:

- **Scheme**: Set the scheme to your desired value. For example:

  ```json
  "scheme": "instapract"
  ```

- **Icons and Splash Screens**: Place your icon and splash screen images in the specified paths.

### Testing

To test the app on a physical device or simulator, use the Expo Go app available on the App Store or Google Play Store, or run it on a local simulator/emulator.

### Deployment

For production builds, follow the Expo documentation on [building and deploying your app](https://docs.expo.dev/build/).

### Additional Notes

- **AsyncStorage** is used for saving user credentials and authentication tokens.
- **React Navigation** handles the app's navigation logic.
- **MaterialIcons** is used for icons in the UI.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)



