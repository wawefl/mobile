import React, {
  FunctionComponent,
  StrictMode,
  useEffect,
  useState,
} from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollViewComponent,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import config from "../config";
import CalendarDate from "../components/Calendar/Date";
import CalendarCard from "../components/Calendar/Card";

type Lesson = {
  dateEnd: string;
  dateStart: string;
  gradeId: number;
  id: number;
  name: string;
};

type LessonByDate = {
  date: string;
  lessons: Lesson[];
};

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  password: string;
}

const HomeScreen: FunctionComponent = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState<User>();
  const [lessons, setLessons] = useState<LessonByDate[]>();

  const check = async () => {
    console.log(await AsyncStorage.getItem("userId"));
    console.log(await AsyncStorage.getItem("isLoggedIn"));
    console.log(await AsyncStorage.getItem("token"));
  };

  useEffect(() => {
    const getLessons = async () => {
      const user = (
        await axios.get(
          `${config.backendUrl}/student/student/${await AsyncStorage.getItem(
            "userId"
          )}`
        )
      ).data;
      setUser(user);

      const resLesson = (
        await axios.post(`${config.backendUrl}/student/lesson`, {
          where: { gradeId: user.gradeId },
        })
      ).data;

      const eventItems = [];

      resLesson.forEach((event: Lesson) => {
        const dateString = event.dateStart.split("T")[0];
        if (!eventItems[dateString]) {
          eventItems[dateString] = []; // Create an empty array for each date if it doesn't exist
        }
        eventItems[dateString].push(event); // Push the event into the corresponding date array
      });

      Object.keys(eventItems).forEach((date) => {
        eventItems[date].sort((a, b) => {
          const dateA = new Date(a.dateStart);
          const dateB = new Date(b.dateStart);
          return dateA - dateB;
        });
      });

      // Convert the object into an array of items
      const lessonsArray = Object.keys(eventItems)
        .map((date) => ({
          date,
          lessons: eventItems[date],
        }))
        .sort((a, b) => {
          // Convert the date strings to Date objects for comparison
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          // Compare the dates and return the comparison result
          return dateA - dateB;
        });

      setLessons(lessonsArray);
      console.log(lessons);
    };

    getLessons();
  }, []);

  const logout = async () => {
    AsyncStorage.removeItem("userId");
    AsyncStorage.removeItem("isLoggedIn");
    AsyncStorage.removeItem("token");
    await axios.post(`${config.backendUrl}/admin/auth/logout`, null);
    // @ts-ignore
    navigation.navigate("Login");
  };

  const profile = async () => {
    // @ts-ignore
    navigation.navigate("Profile");
  };

  return (
    <View>
      <Text>Hello {user?.firstName} 👋</Text>
      <Button title="Check" onPress={() => check()} />
      <Button title="Logout" onPress={() => logout()} />
      <Button title="Profile" onPress={() => profile()} />
      <ScrollView>
        {lessons && lessons.length > 0 ? (
          <View>
            {lessons.map((lesson, index) => (
              <View key={index} style={styles.containerDate}>
                <View style={{ width: "20%" }}>
                  <CalendarDate date={lesson.date}></CalendarDate>
                </View>
                <View style={{ width: "80%", paddingRight: 4 }}>
                  {lesson.lessons.map((lesson, index) => (
                    <CalendarCard
                      name={lesson.name}
                      dateStart={lesson.dateStart}
                      dateEnd={lesson.dateEnd}
                    ></CalendarCard>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerDate: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default HomeScreen;
