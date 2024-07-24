import { View, Text } from "react-native";

export default function Settings() {
  return (
    <View>
      <Text>Sara</Text>
    </View>
    //   <View style={styles.container}>

    //     <View style={styles.profileInfoContainer}>
    //         <Image source={profileDetails.profilePic} style={styles.profileImage} />
    //         <Text >{profileDetails.name.toUpperCase()}</Text>
    //     </View>
    //   </View>
  );
}
const profileDetails = {
  name: "Mike Figurski",
  profilePic: require("../../assets/images/Mike.jpg"),
  email: "figurskimike@gmail.com",
};
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 20,
//       backgroundColor: "#fff",
//     },
//     profileInfoContainer: {
//         flexDirection: 'row'
//     },
//     username: {
//         fontWeight: 'bold',
//     },
//     profileImage: {
//         width: 100,
//         height:100,
//         borderRadius: 100
//     }

//   });
