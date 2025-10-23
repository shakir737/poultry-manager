
import { homeStyles } from "@/assets/styles/home.styles";
import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { getCurrentUser, getUsers } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


export default function page  () {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUSer] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);

  const loadData = async () => {
  const user = await getCurrentUser();
  const users = await getUsers();
  setUsers(users);
  setUSer(user);
  };

  const loadCategoryData = async (category: any) => {
    
  };

  const handleCategorySelect = async (category: any) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // await sleep(2000);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

   const handleDelete = (id: string) => {
      Alert.alert(
        "Delete Activity",
        `Are you sure you want to delete this Activity?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              // await deleteActivity(id);
              
            },
          },
        ]
      );
    //  router.push({pathname: "/(pages)/flockTracker"
    //          , params: { flockId : flockId}})
    };
   

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
       <Header />  
      <View style={homeStyles.section}>
        <Text style={homeStyles.sectionTitle}>Profile</Text>

        <View style={homeStyles.breakdownCard}>
          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>User Name:</Text>
            <Text style={homeStyles.breakdownValue}>{user.name}</Text>
          </View>

          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>Company Name:</Text>
            <Text style={homeStyles.breakdownValue}>{user.companyName}</Text>
          </View>

          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>User Email:</Text>
            <Text style={homeStyles.breakdownValue}>{user.email}</Text>
          </View>
          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>User ID:</Text>
            <Text style={homeStyles.breakdownValue}>{user.id}</Text>
          </View>
       

      </View>
       {/* --- DAILY LOG --- */}
              <View style={{flex:1, flexDirection: "row", justifyContent: "space-between"}}>
                 <Text style={styles.subheader}>Users List</Text>
                 <TouchableOpacity  onPress={() =>  router.push({pathname: "/(pages)/addActivity"
                  , params: { adminId : user.id}})}>
                  <Text style={{backgroundColor: COLORS.white, padding: 5, borderRadius: 20, fontSize: 20,fontWeight: '600', marginTop: 20, marginBottom: 10, color: COLORS.primary}}>+</Text>
                 </TouchableOpacity>
              </View>
    {
                users.length > 0 ? (
                 <View>
                    { users.map((item: any) => (
                      <View key={item.id} style={styles.listItem}>
                         <Text style={styles.listText}>{item.name}</Text>
                         <Text style={styles.listText}>{item.email}</Text>
                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                          <Text style={{color: COLORS.white, backgroundColor: COLORS.primary, padding: 7, borderRadius: 20}}>-</Text>
                        </TouchableOpacity>
                       </View>
                    ))}
                 </View>
                ) : (
                    <View></View>
                )
            }
             </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({ 
    listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  listText: {
    fontSize: 14,
    color: COLORS.primary,
  },
   header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: COLORS.primary,
  },
})