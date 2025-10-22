import { COLORS } from "@/constants/color";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function footer() {
  return (
      <View style={{flex:1, gap: 20, paddingLeft: 37, justifyContent: "space-between", height: 80, paddingTop: 12, width: "auto", flexDirection: "row", backgroundColor: COLORS.white , position: "absolute", bottom: 0 }}>
        <View style={{}}> 
              <TouchableOpacity
                      
                        onPress={() => router.push("/(tabs)/home")}
                      >
                        
                     
             <View style={{alignContent: "center", justifyContent: "center", paddingLeft: 5}}>
               <Ionicons name="home" size={25} color={COLORS.primary} />
             </View>
              </TouchableOpacity>
             <View>
              <Text style={{ fontSize: 12, color: COLORS.primary}}>Home</Text>
             </View>
        </View>
        <View style={{paddingLeft:42}}>
        <View style={{}}> 
              <TouchableOpacity
                      
                        onPress={() => router.push("/(tabs)/flocks")}
                      >
                        
                     
             <View style={{alignContent: "center", justifyContent: "center", paddingLeft: 5}}>
               <Ionicons name="book" size={25} color={COLORS.primary} />
             </View>
              </TouchableOpacity>
             <View>
              <Text style={{ fontSize: 12, color: COLORS.primary}}>Flocks</Text>
             </View>
        </View>
        </View>
        <View style={{paddingLeft:35}}>
             <View style={{}}> 
              <TouchableOpacity
                      
                        onPress={() => router.push("/(tabs)/expense")}
                      >
                        
                     
             <View style={{alignContent: "center", justifyContent: "center", paddingLeft: 7}}>
              <AntDesign name="calculator" size={25} color={COLORS.primary} />
             </View>
              </TouchableOpacity>
             <View>
              <Text style={{ fontSize: 12, color: COLORS.primary}}>Expense</Text>
             </View>
        </View>
        </View>
        <View style={{paddingLeft:32 , paddingRight:50}}>
            <View style={{}}> 
              <TouchableOpacity
                      
                        onPress={() => router.push("/(tabs)/expense")}
                      >
                        
                     
             <View style={{alignContent: "center", justifyContent: "center", paddingLeft: 5}}>
              <AntDesign name="user" size={25} color={COLORS.primary} />
             </View>
              </TouchableOpacity>
             <View>
              <Text style={{ fontSize: 12, color: COLORS.primary}}>Profile</Text>
             </View>
        </View>
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

