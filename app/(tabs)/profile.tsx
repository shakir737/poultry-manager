
import { homeStyles } from "@/assets/styles/home.styles";
import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";


export default function page  () {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
  
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

      <View style={homeStyles.statsContainer}>

        <View style={homeStyles.statCard}>
          
          <View style={homeStyles.statMultiCard}>
          <Text style={homeStyles.statLabel}>Total Flocks</Text>
          <Text style={homeStyles.statValue}>1</Text>
          <Text style={homeStyles.statLabel}>+100 in this week</Text>
          </View>
         
        </View>

        <View style={homeStyles.statCard}>
           <View style={homeStyles.statMultiCard}>
           <Text style={homeStyles.statLabel}>Total Birds</Text>
          <Text style={homeStyles.statValue}>1000</Text>
          <Text style={homeStyles.statLabel}>+50 in last week</Text>
          </View>
        </View>
      </View>
        <View style={homeStyles.statsContainer}>
        <View style={homeStyles.statCard}>
           <View style={homeStyles.statMultiCard}>
          <Text style={homeStyles.statLabel}>Feed Stock</Text>
          <Text style={homeStyles.statValue}>1</Text>
          <Text style={homeStyles.statLabel}>Stock is low</Text>
          </View>
        </View>

        <View style={homeStyles.statCard}>
           <View style={homeStyles.statMultiCard}>
           <Text style={homeStyles.statLabel}>Health Alerts</Text>
          <Text style={homeStyles.statValue}>3</Text>
          <Text style={homeStyles.statLabel}>Need Attention</Text>
          </View>
        </View>
      </View>
      <View style={homeStyles.section}>
        <Text style={homeStyles.sectionTitle}>Poultry Breakdown</Text>

        <View style={homeStyles.breakdownCard}>
          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>🐔 Broilers</Text>
            <Text style={homeStyles.breakdownValue}>1000</Text>
          </View>

          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>🐣 Chicks</Text>
            <Text style={homeStyles.breakdownValue}>0</Text>
          </View>

          <View style={homeStyles.breakdownRow}>
            <Text style={homeStyles.breakdownLabel}>🐓 Hens</Text>
            <Text style={homeStyles.breakdownValue}>0</Text>
          </View>
        </View>
      </View>
      <View style={homeStyles.quickActions}>
        <Text style={homeStyles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={homeStyles.actionButton}
          onPress={() => router.push("/(auth)/sign-up")}
        >
          <Text style={homeStyles.actionButtonText}>+ Add New Flock</Text>
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

