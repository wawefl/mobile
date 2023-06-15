import React, { FunctionComponent, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Avatar } from "react-native-elements";

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

interface Grade {
  id: number;
  email: string;
  name: string;
  level: number;
}

const HomeScreen: FunctionComponent = () => {
  const navigation = useNavigation();
  const [finish, setFinish] = useState<boolean>();

  const [user, setUser] = useState<User>();
  const [grade, setGrade] = useState<Grade>();

  const [lessons, setLessons] = useState<LessonByDate[]>();
  const [diffDate, setDiffDate] = useState<any>();
  const [closerToday, setCloserToday] = useState<string>();

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

      const grade = (
        await axios.get(`${config.backendUrl}/commun/grade/${user.gradeId}`)
      ).data;

      setGrade(grade);

      const resLesson = (
        await axios.post(`${config.backendUrl}/student/lesson`, {
          where: { gradeId: user.gradeId },
          orderBy: [
            {
              dateStart: "asc",
            },
          ],
        })
      ).data;

      const eventItems: any[string] = [];

      resLesson.forEach((event: Lesson) => {
        const dateString: string = event.dateStart.split("T")[0];
        if (!eventItems[dateString]) {
          eventItems[dateString] = [];
        }
        eventItems[dateString].push(event);
      });

      Object.keys(eventItems).forEach((date) => {
        eventItems[date].sort(
          (a: { dateStart: string }, b: { dateStart: string }) => {
            const dateA = new Date(a.dateStart);
            const dateB = new Date(b.dateStart);

            // Trie eventItems [date]
            return dateA.valueOf() - dateB.valueOf();
          }
        );
      });

      const today = new Date();

      const lessonsArray = Object.keys(eventItems)
        .map((date) => {
          const diff = Math.abs(new Date(date).valueOf() - today.valueOf());
          if (diffDate === undefined || diffDate > diff) {
            setDiffDate((prevDiff: number | undefined) =>
              prevDiff === undefined || prevDiff > diff ? diff : prevDiff
            );
            // Obtient la date la plus proche d'aujourd'hui
            setCloserToday(date);
          }

          return {
            date,
            lessons: eventItems[date],
          };
        })
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          // Trie pour l'heure de la journée
          return dateA.valueOf() - dateB.valueOf();
        });

      setLessons(lessonsArray);
      setFinish(true);
    };

    getLessons();
  }, []);

  const profile = async () => {
    // @ts-ignore
    navigation.navigate("Profile");
  };

  return (
    <View>
      <View style={{ height: "20%" }}>
        <View style={styles.containerHeader}>
          <Text style={styles.hi}>Hello {user?.firstName} 👋</Text>
          <Avatar
            rounded
            title={
              user ? user?.firstName.charAt(0) + user?.lastName.charAt(0) : "WM"
            }
            containerStyle={{
              backgroundColor: "silver",
              marginRight: 20,
            }}
            onPress={() => profile()}
          />
        </View>

        <Text style={styles.titlePlanning}>
          Planing {grade?.name} ({grade?.level})
        </Text>
      </View>

      <View style={{ height: "80%" }}>
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
                        key={index}
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
            <>
              {finish ? (
                <View>
                  <Text>No Lesson!</Text>
                </View>
              ) : (
                <View>
                  <Text>Loading...</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerDate: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
  },
  hi: {
    fontSize: 25,
    fontWeight: "300",
    marginTop: 5,
    marginBottom: 10,
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
    paddingLeft: 5,
    paddingRight: 5,
  },
  titlePlanning: {
    fontSize: 27,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default HomeScreen;
