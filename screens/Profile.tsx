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

  return (
    <View>
      <Text>Profile</Text>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
      <Text>
        {grade?.name} ({grade?.level})
      </Text>

      <Button
        title="Home"
        onPress={() => {
          home();
        }}
      />
    </View>
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

export default ProfileScreen;
