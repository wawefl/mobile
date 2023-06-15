import React, { FC, FunctionComponent, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Pressable,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import config from "../config";

import { colors } from "../components/colors";

const LoginScreen: FunctionComponent = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      // @ts-ignore
      navigation.navigate("Home");
    }
  };

  const signIn = async () => {
    try {
      const response = await axios.post(
        `${config.backendUrl}/student/auth/login`,
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 201) {
        // Connexion réussie
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem(
          "userId",
          response.data.student.id.toString()
        );
        await AsyncStorage.setItem("token", response.data.token);
        // @ts-ignore
        navigation.navigate("Home");
      } else {
        // Échec de la connexion
        await AsyncStorage.setItem("isLoggedIn", "false");
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: "Email or password are wrong",
        });
      }
    } catch (error) {
      // Traitement des erreurs ici
      await AsyncStorage.setItem("isLoggedIn", "false");
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: "Email or password are wrong",
      });
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo_black.png")} style={styles.logo} />
      <SafeAreaView style={{ width: "80%", alignItems: "center" }}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          keyboardType="visible-password"
        />
        <Pressable style={styles.button} onPress={() => signIn()}>
          <Text style={styles.textButton}>Login</Text>
        </Pressable>
      </SafeAreaView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  logo: {
    width: 150,
    height: 150,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 200,
    color: colors.white,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    fontSize: 20,
    color: colors.white,
  },
});

export default LoginScreen;
