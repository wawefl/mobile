import React, { FunctionComponent } from "react";
// import styled from "styled-components/native";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";

import { colors } from "../colors";

// const ButtonView = styled.TouchableOpacity`
//   align-items: center;
//   background-color: ${colors.primary};
//   width: 100%;
//   padding: 20px;
//   border-radius: 20px;
// `;

interface CalendarDateProps {
  date: string;
}

const CalendarDate: FunctionComponent<CalendarDateProps> = (props) => {
  const date = moment(props.date);
  const displayDate = () => {
    return moment(props.date).format("LL");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.day}>{date.date()}</Text>
      <Text style={styles.month}>{date.format("MMM")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingRight: 20,
    marginRight: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#000000",
    height: 80,
  },
  day: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 4,
  },
  month: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 4,
  },
});

export default CalendarDate;
