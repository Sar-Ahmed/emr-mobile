import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Avatar, DataTable, Subheading, Title } from "react-native-paper";

const profileDetails = {
  profilePic: require("../../assets/images/Mike.jpg"),
  name: "Mike Figurski",
  mspNum: "#23873",
};

const basicInfo = {
  role: "Provider",
  email: "figurskimike@gmail.com",
  phone: "+1 2503003284",
};

type StyledDataTableCellProps = {
  children: React.ReactNode;
};

const StyledDataTableCell: React.FC<StyledDataTableCellProps> = ({
  children,
}) => (
  <DataTable.Cell>
    <Text style={styles.tableText}>{children}</Text>
  </DataTable.Cell>
);

export default function Settings() {
  return (
    <View style={styles.container}>
      <View style={styles.profileInfoContainer}>
        <Avatar.Image source={profileDetails.profilePic} size={80} />
        <View style={styles.profileData}>
          <Title style={styles.username}>
            {profileDetails.name.toUpperCase()}
          </Title>
          <Subheading style={{ color: "gray", fontWeight: "bold" }}>
            {profileDetails.mspNum}
          </Subheading>
        </View>
      </View>
      <DataTable style={styles.table}>
        <DataTable.Row>
          <StyledDataTableCell>Role</StyledDataTableCell>
          <StyledDataTableCell>{basicInfo.role}</StyledDataTableCell>
        </DataTable.Row>
        <DataTable.Row>
          <StyledDataTableCell>Email</StyledDataTableCell>
          <StyledDataTableCell>{basicInfo.email}</StyledDataTableCell>
        </DataTable.Row>
        <DataTable.Row>
          <StyledDataTableCell>Phone</StyledDataTableCell>
          <StyledDataTableCell>{basicInfo.phone}</StyledDataTableCell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  profileData: {
    marginLeft: 20,
  },
  username: {
    fontWeight: "bold",
    color: "black",
    fontSize: 30,
  },
  table: {
    marginTop: 20,
  },
  tableText: {
    color: "black",
  },
});
