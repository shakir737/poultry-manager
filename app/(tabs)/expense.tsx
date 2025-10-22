import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { formatCurrency, formatDate } from "@/constants/constants";
import { deleteExpense, getExpenses, getFlocks } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
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
export default function page() {
  const [expenses, setExpenses] = useState([]);
  const [flocks, setFlocks] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const loadData = async () => {
    const expensesData = await getExpenses();
    const flocksData = await getFlocks();
    setExpenses(expensesData);

    const total = expensesData.reduce(
      (sum: number, exp: { amount: any; }) => sum + parseFloat(exp.amount || 0),
      0
    );
    setTotalExpenses(total);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

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
     <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
              />
            }
            // contentContainerStyle={s}
          >
    <View style={styles.container}>
       <Header />

  {  expenses.length > 0 ? 
      expenses.map((item: any) => (
  <View key={item.id} style={styles.card}>
    <Text style={{width: "auto", color: COLORS.primary,}}>{item.flockId}</Text>
      <View style={styles.cardHeader}>
        <View>

          <Text style={styles.category}>{item.resource}</Text>
          <Text style={styles.flockName}>
            Per Unit Price
          </Text>
            <Text style={styles.flockName}>
            Quantity
          </Text>
          <Text style={styles.date}>Total Amount</Text>
        </View>
        <View>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
           <Text style={styles.flockName}>
            {item.perUnitPrice} /{item.unit}
          </Text>
            <Text style={styles.flockName}>
            {item.quantity} {item.unit}
          </Text>
           <Text style={{color: COLORS.primary}}>{formatCurrency(item.amount)}</Text>
        </View>
        
      </View>

     

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
      : (
        <View style={styles.emptyContainer}>
                   <Text style={styles.emptyText}>No Expense yet</Text>
                   <Text style={styles.emptySubtext}>
                     Tap the + button to add your first Expense
                   </Text>
                 </View>
      )
     }

     
    </View>
    </ScrollView>
     <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(pages)/addExpense")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
     <View style={styles.fab2}>
        <View>
           <Text style={styles.fab3}>Total Expenses</Text>
        </View>
         <View>
           <Text style={styles.summaryValue}>{formatCurrency(totalExpenses)}</Text>
         </View>
       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  }, header: {
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
  summaryCard: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.primary,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    flex: 1,
    fontSize: 12,
    color: COLORS.primary,
    justifyContent: "flex-end"
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
    borderTopColor: COLORS.primary,
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
    color: COLORS.primary,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.primary,
  },
  fab: {
    position: "absolute",
    right: 10,
    bottom: 60,
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
    bottom: 20,
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
    marginBottom: -20,
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
