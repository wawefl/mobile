import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/Login";
import HomeScreen from "./screens/Home";
// Importez les autres écrans dont vous avez besoin

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerBackVisible: false, // Masque le bouton de retour
          }}
        />
        {/* Ajoutez d'autres écrans ici */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
