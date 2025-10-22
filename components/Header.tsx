import { COLORS } from "@/constants/color";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function header() {
  return (
      <View style={{flex:1 ,marginBottom: 7, flexDirection: "row", backgroundColor: COLORS.primary , alignItems: "center", paddingLeft: 10}}>
        <View>
             <AntDesign name="menu" size={24} color={COLORS.white} />
        </View>
        <View style={styles.header}>
        <Text style={styles.title}>Poultry Farm Dashboard</Text>
        <Text style={styles.subtitle}>Track your farm's performance</Text>
      </View>
      <View>
         <AntDesign name="bell" size={24} color={COLORS.white} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  header: {
     backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: "center",
    marginLeft: 5
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 10,
    paddingTop: 10
   
  },
  subtitle: {
     fontWeight: "bold",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  message: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
  },
});

