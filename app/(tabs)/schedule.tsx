import { StyleSheet, View, Text } from "react-native";
import { Calendar, CalendarList } from "react-native-calendars";

export default function Schedule() {
  return (
    <View style={styles.container}>
      <Calendar 
      style={{width: 500}}
      onDayPress={day => {
        console.log('selected day', day);
      }}
      onMonthChange={month => {
        console.log('month changed', month);
      }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
});
