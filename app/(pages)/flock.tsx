
import { homeStyles } from "@/assets/styles/home.styles";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { calculateAge, formatCurrency, formatDate } from "@/constants/constants";
import { deleteExpense, getActivities, getExpensesByFlock, getFlock } from "@/utils/storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
interface Expense {
    id: string
    title: string
}
export default function page  () {
  const params = useLocalSearchParams();
  const {item, itemId } = params
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState<any[]>([])
  const [flock, setFlock] = useState({
    name: "",
   quantity: "",
   type: "",
   weight: "",
   size: "",
   startDate: "",
   notes: "",
  });
  const [expense, setExpense] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [deathCount, setDeathCount] = useState(0)
  const [actualQuantity, setActualQuantity] = useState(0);

  const loadData = async () => {
   const data = await getFlock(itemId);
   const expense = await getExpensesByFlock(itemId);
   const activities = await getActivities();
   const total = expense.reduce(
      (sum: number, exp: { amount: any; }) => sum + parseFloat(exp.amount || 0),
      0
    );
     const ActivitiesByFlock = activities.filter((activity: any) => activity.flockId === itemId)
     const activtiyByFlock = activities.filter((activity: any) => activity.flockId === itemId)
      .reduce(
       (sum: number, exp: { died: any; }) => sum + parseFloat(exp.died || 0),
      0
     )
  
   setActivities(ActivitiesByFlock);  
   setDeathCount(activtiyByFlock);
   setTotalExpenses(total);
   setExpense(expense)
   setFlock(data);
   setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // await sleep(2000);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
    calculateDeathCount();
  }, []);

  
  useEffect(() => {

    calculateDeathCount();
  }, [deathCount]);

   const calculateDeathCount = () => {
    
      const count = parseFloat(flock.quantity) - deathCount ;
      setActualQuantity(count);
   }

   const handleDelete = (id: string, category: string) => {
     Alert.alert(
       "Delete Expense",
       `Are you sure you want to delete this ${category} expense?`,
       [
         { text: "Cancel", style: "cancel" },
         {
           text: "Delete",
           style: "destructive",
           onPress: async () => {
             await deleteExpense(id);
             loadData();
           },
         },
       ]
     );
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
        <Text style={homeStyles.sectionTitle}>Flock Detail</Text>

        <View style={homeStyles.breakdownCard}>
          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>Name </Text>
            <Text style={homeStyles.breakdownValue}>
          { !loading ?
          flock.name: ""
        }</Text>
          </View>

          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>Age</Text>
            <Text style={homeStyles.breakdownValue}>{calculateAge(flock.startDate)}</Text>
          </View>

          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>Avg. Weight At Start</Text>
            <Text style={homeStyles.breakdownValue}> { !loading ?
          flock.weight: ""
        }</Text>
          </View>
          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>Total Quantity</Text>
            <Text style={homeStyles.breakdownValue}> { Number.isNaN(actualQuantity)  ?
            flock.quantity :  actualQuantity 
        }</Text>
          </View>
          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>Avg. Weight Now</Text>
            <Text style={homeStyles.breakdownValue}>{ activities.length > 0 ?
            activities[activities.length - 1].totalWeight : flock.weight
          }</Text>
          </View>
        </View>
      </View>
      <View style={homeStyles.quickActions}>
        <Text style={homeStyles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={homeStyles.actionButton}
          onPress={() =>  router.push({pathname: "/(pages)/flockTracker"
            , params: { flockId
              : itemId}})}
        >
          <Text style={homeStyles.actionButtonText}>Track Flack</Text>
        </TouchableOpacity>
      </View>
       {
         expense.map((item: any) => (
          
     <View key={item.id} style={styles.card}>
       <View style={styles.cardHeader}>
         <View>
           <Text style={styles.category}>{item.category}</Text>
           <Text style={styles.flockName}>
             {item.flockId}
           </Text>
           <Text style={styles.date}>{formatDate(item.date)}</Text>
         </View>
         <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
       </View>
 
       {item.description && (
         <Text style={styles.description}>{item.description}</Text>
       )}
 
       <View style={styles.cardFooter}>
         <TouchableOpacity
           style={styles.editButton}
           onPress={() =>  router.push({pathname: "/(pages)/addExpense", params: { itemId: item.id}})}
         >
           <Text style={styles.editButtonText}>Edit</Text>
         </TouchableOpacity>
 
         <TouchableOpacity
           style={styles.deleteButton}
           onPress={() => handleDelete(item.id, item.category)}
         >
           <Text style={styles.deleteButtonText}>Delete</Text>
         </TouchableOpacity>
       </View>
     </View>
         ))
       } 
      
      </ScrollView>
      
             <View style={styles.fab2}>
               <View>
                  <Text style={styles.fab3}>Total Expenses</Text>
               </View>
                <View>
                  <Text style={styles.summaryValue}>{formatCurrency(totalExpenses)}</Text>
                </View>
               <TouchableOpacity
               style={styles.fab}
               onPress={() =>  router.push({pathname: "/(pages)/addExpense"
            , params: { flockId
              : itemId}})}
             >
               <Text style={styles.fabText}>+</Text>
               
             </TouchableOpacity>
             
             </View> 
             <Footer />
       <View style={{marginBottom: 50}}></View>
    </View>
    
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summaryCard: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  list: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    marginLeft: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  category: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  flockName: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: COLORS.primary,
  },
  amount: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  description: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 10,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 60,
    gap: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
   fab2: {
    position: "absolute",
    bottom: 60,
    right: 10,
    flex: 1,
    letterSpacing: 10,
    marginLeft: 20,
    gap: 20,
    padding:2,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    
  },
  fab3: {
    alignItems: "flex-start",
    fontSize: 12,
    color: COLORS.white,
    justifyContent: "flex-start"
  }
});
