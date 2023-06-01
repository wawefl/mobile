import React, { FunctionComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";

import { colors } from "../colors";

interface CalendarCardProps {
  name: string;
  dateStart: string;
  dateEnd: string;
}

const CalendarCard: FunctionComponent<CalendarCardProps> = (props) => {
  const dateStart = moment(props.dateStart);
  const dateEnd = moment(props.dateEnd);

  const hour = (date: any) => {
    return date.format("h:mm");
  };

  return (
    <View style={styles.card}>
      <Text style={styles.hours}>
        {hour(dateStart)} - {hour(dateEnd)}
      </Text>
      <Text style={styles.name}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 1,
    borderRadius: 25,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: colors.secondary,
    color: colors.white,
  },
  hours: {
    color: colors.white,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});

export default CalendarCard;
