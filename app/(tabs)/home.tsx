
import { homeStyles } from "@/assets/styles/home.styles";
import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { POULTRY_TYPES } from "@/constants/constants";
import { deleteResource, getExpenses, getFlocks, getResources } from "@/utils/storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function page  () {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resources, setResources] = useState([])
  const [stats, setStats] = useState({
    totalFlocks: 0,
    totalResources: 0,
    totalBirds: 0,
    totalExpenses: 0,
    broilers: 0,
    layer: 0,
    hens: 0,
  });
  
  const loadStats = async () => {
    const flocks = await getFlocks();
    const expenses = await getExpenses();
    const resource =  await getResources();
    
    const totalBirds = flocks.reduce(
      (sum: number, flock: any) => sum + (flock.quantity || 0),
      0
    );
    const totalExpenses = expenses.reduce(
      (sum: number, exp: any) => sum + parseFloat(exp.amount || 0),
      0
    );

    const broilers = flocks
      .filter((f: any) => f.type === POULTRY_TYPES.BROILER)
      .reduce((sum: number, f:any) => sum + (f.quantity || 0), 0);
    const layer = flocks
      .filter((f: any) => f.type === POULTRY_TYPES.LAYER)
      .reduce((sum: number, f: any) => sum + (f.quantity || 0), 0);
    const hens = flocks
      .filter((f: any) => f.type === POULTRY_TYPES.HEN)
      .reduce((sum: number, f: any) => sum + (f.quantity || 0), 0);
    
     const stock = resource.map( (resource: any) => {
       const generalExpense = expenses.filter((expense: any) => expense.resource === resource.name && expense.flockId === "General")
       .reduce((sum: number, f: any) => sum + (f.quantity || 0), 0)
       const Expense = expenses.filter((expense: any) => expense.resource === resource.name && expense.flockId !== "General")
        .reduce((sum: number, f: any) => sum + (f.quantity || 0), 0)
       const result = generalExpense - Expense;

     
        return {...resource, result};
     } )
     
    
     setResources(stock);
    setStats({
      totalFlocks: flocks.length,
      totalResources: resource.length,
      totalBirds,
      totalExpenses,
      broilers,
      layer,
      hens,
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

    const handleDelete = (id: string) => {
      Alert.alert(
        "Delete Resource",
        `Are you sure you want to delete this Resource?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteResource(id);
              loadStats();
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

          { stats.totalFlocks > 0 ? (
            <View style={homeStyles.statsContainer}>
            <View style={homeStyles.statCard}>
              <View style={homeStyles.statMultiCard}>
                 <Text style={homeStyles.statLabel}>Total Flocks</Text>
                 <Text style={homeStyles.statValue}>{stats.totalFlocks}</Text>
                 <Text style={homeStyles.statLabel}>+100 in this week</Text>
               </View>
           </View>
             <View style={homeStyles.statCard}>
           <View style={homeStyles.statMultiCard}>
           <Text style={homeStyles.statLabel}>Total Birds</Text>
          <Text style={homeStyles.statValue}>{stats.totalBirds}</Text>
          <Text style={homeStyles.statLabel}>+50 in last week</Text>
          </View>
        </View>
        </View>
          ) : (
             <View style={{marginTop: 5}}>
             <TouchableOpacity onPress={() => router.push("/(pages)/addFlocks")}><Text style={{backgroundColor: COLORS.white, padding: 5, borderRadius: 5, color: COLORS.primary}}>Please Click here OR Add Button To Add your First Flock</Text></TouchableOpacity> 
           </View>
          )}
        {
          resources.length > 0 ? (
            <View style={homeStyles.section}>
        <Text style={homeStyles.sectionTitle}>Resources Stock</Text>
        <View style={homeStyles.breakdownCard}>
      {         
        resources.map((resource: any) => (
         <View key={resource.id} style={homeStyles.breakdownRow}>
         <View>
            <Text style={homeStyles.breakdownValue}>{resource.category}</Text>
            <Text style={homeStyles.breakdownLabel}>{resource.name}</Text>
            {/* <Text style={homeStyles.breakdownValue}>{resource.id}</Text> */}
           <Text style={{color: COLORS.primary}}>Current Stock: {resource.result} KG</Text>
          </View>
          {
            resource.result === 0 ? (
             <View> 
            <TouchableOpacity onPress={() => handleDelete(resource.id)}>
                <Text  style={{color: COLORS.primary}}>Delete</Text>
            </TouchableOpacity></View>
            ) : (
              <View></View>
            )
          }
           
           </View>
        ))
      }
         
        </View>
      </View>
          )  : (
             <View style={{marginTop: 5}} >
             <TouchableOpacity onPress={() => router.push("/(pages)/addResource")}><Text style={{backgroundColor: COLORS.white, padding: 5, borderRadius: 5, color: COLORS.primary}}>Click here OR Add Button To Add your First Resource</Text></TouchableOpacity> 
           </View>
          )}
      <View style={homeStyles.section}>
        <Text style={homeStyles.sectionTitle}>Poultry Breakdown</Text>

        <View style={homeStyles.breakdownCard}>
          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>🐔 Broilers</Text>
            <Text style={homeStyles.breakdownValue}>{stats.broilers}</Text>
          </View>

          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>🐣 Layer</Text>
            <Text style={homeStyles.breakdownValue}>{stats.layer}</Text>
          </View>

          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>🐓 Hens</Text>
            <Text style={homeStyles.breakdownValue}>{stats.hens}</Text>
          </View>
        </View>
      </View>
      <View style={homeStyles.quickActions}>
        <Text style={homeStyles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={homeStyles.actionButton}
          onPress={() => router.push("/(pages)/addFlocks")}
        >
          <Text style={homeStyles.actionButtonText}>+ Add New Flock</Text>
        </TouchableOpacity>

         <TouchableOpacity
          style={homeStyles.actionButton}
          onPress={() => router.push("/(pages)/addResource")}
        >
          <Text style={homeStyles.actionButtonText}>+ Add New Resource</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={homeStyles.actionButton}
          onPress={() => router.push("/(pages)/addExpense")}
        >
          <Text style={homeStyles.actionButtonText}>+ Add Expense</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

