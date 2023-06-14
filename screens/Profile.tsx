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
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

import config from "../config";
import { Avatar, Icon } from "react-native-elements";

import { colors } from "../components/colors";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  password: string;
  gradeId: number;
}

interface Grade {
  id: number;
  email: string;
  name: string;
  level: number;
}

const ProfileScreen: FunctionComponent = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState<User>();
  const [grade, setGrade] = useState<Grade>();

  useEffect(() => {
    const getUser = async () => {
      const user = (
        await axios.get(
          `${config.backendUrl}/student/student/${await AsyncStorage.getItem(
            "userId"
          )}`
        )
      ).data;

      const grade = (
        await axios.get(`${config.backendUrl}/commun/grade/${user.gradeId}`)
      ).data;

      setGrade(grade);
      setUser(user);
    };

    getUser();
  }, []);

  const home = () => {
    // @ts-ignore
    navigation.navigate("Home");
  };

  const logout = async () => {
    AsyncStorage.removeItem("userId");
    AsyncStorage.removeItem("isLoggedIn");
    AsyncStorage.removeItem("token");
    await axios.post(`${config.backendUrl}/student/auth/logout`, null);
    // @ts-ignore
    navigation.navigate("Login");
  };

  return (
    <View style={{ height: "100%", paddingLeft: 5 }}>
      <View style={styles.containerHeader}>
        <Avatar
          rounded
          title={
            user ? user?.firstName.charAt(0) + user?.lastName.charAt(0) : "WM"
          }
          containerStyle={{
            backgroundColor: "silver",
            marginRight: 20,
            marginTop: 10,
            alignSelf: "flex-end",
          }}
        />
      </View>
      {/* <Text style={styles.title}>Profile</Text> */}
      <Text style={styles.firstName}>{user?.firstName}</Text>
      <Text style={styles.lastName}>{user?.lastName}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.grade}>
        {grade?.name} ({grade?.level})
      </Text>

      {/* <Button
        title="Home"
        onPress={() => {
          home();
        }}
      /> */}

      <TouchableOpacity style={styles.logout} onPress={() => logout()}>
        <Image
          source={require("../assets/logout.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerHeader: {},
  firstName: {
    fontSize: 48,
    fontWeight: "500",
  },
  lastName: {
    fontSize: 40,
    fontWeight: "500",
  },
  email: {
    marginTop: 5,
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "300",
  },
  grade: {
    marginTop: 30,
    fontSize: 20,
  },
  logout: {
    position: "absolute",
    bottom: 20,
    right: 4,
    alignSelf: "flex-end",
    backgroundColor: colors.gray,
    borderRadius: 50,
    padding: 10,
  },
});

export default ProfileScreen;
