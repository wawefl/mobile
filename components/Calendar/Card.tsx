import React, { FunctionComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";

import { colors } from "../colors";
import { Icon } from "react-native-elements";

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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Text style={styles.hours}>
          {hour(dateStart)} - {hour(dateEnd)}
        </Text>
        <Icon
          name="more-horizontal"
          type="feather"
          color={colors.white}
          style={styles.more}
        />
      </View>
      <Text style={styles.name}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 1,
    borderRadius: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: colors.secondary,
    color: colors.white,
  },
  hours: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "300",
  },
  name: {
    fontSize: 17,
    fontWeight: "500",
    color: colors.white,
  },
  more: {
    marginTop: -5,
  },
});

export default CalendarCard;
