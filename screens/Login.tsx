import React, { FC, FunctionComponent, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

import config from "../config";

const LoginScreen: FunctionComponent = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    console.log(await AsyncStorage.getItem("userId"));
    console.log(isLoggedIn);
    if (isLoggedIn === "true") {
      // @ts-ignore
      navigation.navigate("Home");
    }
  };

  const signIn = async () => {
    try {
      const response = await axios.post(
        `${config.backendUrl}/admin/auth/login`,
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 201) {
        // Connexion réussie
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("userId", response.data.admin.id.toString());
        await AsyncStorage.setItem("token", response.data.token);
        // @ts-ignore
        navigation.navigate("Home");
        // Enregistrez le token d'authentification dans l'application
      } else {
        // Échec de la connexion
        await AsyncStorage.setItem("isLoggedIn", "false");
        // Gérez les erreurs et informez l'utilisateur de l'échec de la connexion
      }

      // Traitement de la réponse de la requête ici
      console.log(response.data);

      // Continuer avec les actions après la connexion réussie
    } catch (error) {
      // Traitement des erreurs ici
      await AsyncStorage.setItem("isLoggedIn", "false");
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        keyboardType="visible-password"
      />
      <Button title="Login" onPress={() => signIn()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default LoginScreen;
