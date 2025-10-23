import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { COLORS } from '@/constants/color';
import { deleteActivity, getActivities, getExpenses, getFlock } from '@/utils/storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
// --- CONSTANTS ---

// --- DATA CALCULATION LOGIC ---
const calculateFlockStats = (data: any) => {
  if (data.length < 2) {
    return {
      totalDays: data.length,
      totalFeed: 0,
      totalWeightGained: 0,
      avgDailyGain: 0,
      fcr: 'N/A',
    };
  }

  // Sort data by date just in case it was entered out of order
  const sortedData = [...data].sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());

  // 1. Total Feed Consumed
  const totalFeed = sortedData.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
 

  // 2. Total Weight Gained
  // Weight gained is the difference between the final and initial total flock weight.
  const initialWeight = parseFloat(sortedData[0].totalWeight);
  const finalWeight = parseFloat(sortedData[sortedData.length - 1].totalWeight);
  const totalWeightGained = finalWeight - initialWeight;

  // 3. Average Daily Gain (ADG)
  const totalDays = sortedData.length;
  const avgDailyGain = totalWeightGained / (totalDays - 1); // ADG over the full period

  // 4. Feed Conversion Ratio (FCR)
  let fcr = 'N/A';
  if (totalWeightGained > 0) {
    fcr = (totalFeed / totalWeightGained).toFixed(2);
  } else if (totalWeightGained < 0) {
    fcr = 'Loss';
  } else {
    fcr = '0 (No gain)';
  }

  return {
    totalDays: totalDays,
    totalFeed: totalFeed.toFixed(2),
    totalWeightGained: totalWeightGained.toFixed(2),
    avgDailyGain: avgDailyGain.toFixed(3),
    fcr: fcr,
  };
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 3, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '0.5',
    strokeWidth: '0.5',
    stroke: '#ffa726',
  },
};

export default function FlockTracker() {
  const [flockData, setFlockData] = useState([]);
  const [expenseByFlock, setExpenseByFlock] = useState([])
  const [flock, setFlock] =  useState(
    {
   id: "",
   name: "",
   quantity: "",
   type: "",
   weight: "",
   size: "",
   startDate: "",
   notes: "",
    }
  );
  const [totalDeaths, setTotalDeaths] = useState(0);
   const params = useLocalSearchParams();
   const [activity, setActivity] = useState([])
   const {flockId } = params;
  const [date, setDate] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [feedConsumed, setFeedConsumed] = useState('');
  const [stats, setStats] = useState(calculateFlockStats([]));
  const [totalExpense, setTotalExpense] = useState(0);
  const [mortalityRation, setMortalityRatio] = useState(0);
  // Load data from AsyncStorage on component mount
  useEffect(() => {
    loadFlockData();
    calculateData();
  }, []);

  // Recalculate stats whenever flockData changes
  useEffect(() => {
    setStats(calculateFlockStats(flockData));
    loadFlockData();
    calculateData()
  }, [flockData]);

  const calculateData = async () => {
    const expenses = await getExpenses();
    const expense = expenses.filter((exp: any) => exp.flockId === flockId)
   .reduce(
       (sum: number, exp: { amount: any; }) => sum + parseFloat(exp.amount || 0), 0);

   const totalDeaths = flockData.reduce(
      (sum: number, exp: { died: any; }) => sum + parseFloat(exp.died || 0), 0);
  
   const Mortality = totalDeaths / parseFloat(flock.quantity) * 100;
   
   setMortalityRatio(Mortality);
   setTotalExpense(expense);
  

  }
  // Load Function
  const loadFlockData = async () => {
    try {
      const activities = await getActivities();
      const flock = await getFlock(flockId);
      const activityByFlock = activities.filter((activity: any) => activity.flockId === flockId)
     
      setFlock(flock);
      setFlockData(activityByFlock);
      
    } catch (e) {
      console.error('Failed to load data from storage', e);
    }
  };
   const dataValues = flockData.map((item: any) => item.totalWeight);
  //  setActivity(dataValues)
const data = {
  labels: ['0', '7', '14', '21', '28', '35', '42','49'],


  datasets: [
    {
      data: [0.042, 0.055, 0.071,0.090, 0.112, 0.138, 0.168, 0.202, 0.240, 0.283,
        0.330, 0.382, 0.440, 0.503, 0.570, 0.639, 0.711, 0.786, 0.864, 0.945,
        1.029, 1.116, 1.205, 1.296, 1.390, 1.486, 1.583, 1.682, 1.783, 1.886,
        1.989, 2.094, 2.200, 2.306, 2.413, 2.521, 2.629, 2.738, 2.846, 2.954,
        3.060, 3.170, 3.278, 3.384, 3.490], // Data for Dataset 1
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // purple
    },
    {
      data: dataValues, // Data for Dataset 2
      color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // red/pink
    
    },
  ],
  // Optional: add a legend for the datasets
  legend: ['Standard growth', 'Our flock growth'],
};


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
             await deleteActivity(id);
             
           },
         },
       ]
     );
    router.push({pathname: "/(pages)/flockTracker"
            , params: { flockId : flockId}})
   };
  

  return (
    <View style={{flex: 1, backgroundColor: COLORS.background}}>
      <ScrollView>
         <Header /> 
         <View style={styles.container}>

        {/* --- RESULTS SUMMARY --- */}
        <View style={{alignItems: "center", backgroundColor: COLORS.background}}>
                           <Text style={{backgroundColor: COLORS.white, padding: 5, borderRadius: 10, fontSize: 16, color: COLORS.primary}}>{flock.name}</Text>
          </View>
        <Text style={styles.subheader}>Performance Summary ({stats.totalDays} Days)</Text>
        <View style={styles.summaryBox}>
          <SummaryItem label="Total Feed Consumed" value={`${stats.totalFeed} kg`}/>
          <SummaryItem label="Total Weight Gained" value={`${stats.totalWeightGained} kg`} />
          <SummaryItem label="Average Daily Gain (ADG)" value={`${stats.avgDailyGain} kg/day`} />
          <SummaryItem label="Feed Conversion Ratio (FCR)" value={stats.fcr} highlight={stats.fcr !== 'N/A' && stats.fcr !== 'Loss' && parseFloat(stats.fcr) <= 2.0 ? '#4CAF50' : '#FBC02D'} />
          <SummaryItem label="The Mortality Rate" value={`${mortalityRation}`} />
          <SummaryItem label="Total Expense Against This Flock" value={`${totalExpense}/RS`} />
        </View>
      <View style={{marginRight: 10}}>
      <Text style={styles.subheader}>6-Week Data Comparison</Text>
      <View >
       <LineChart
        data={data}
        width={screenWidth - 20} // Subtract padding
        height={220}
        chartConfig={chartConfig}
        bezier // for a smooth, curved line
        style={{marginRight: 25, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: COLORS.primary,}}
      
      />
      </View>
    </View>
        {/* --- DAILY LOG --- */}
        <View style={{flex:1, flexDirection: "row", justifyContent: "space-between"}}>
           <Text style={styles.subheader}>Daily Activity Log</Text>
           <TouchableOpacity  onPress={() =>  router.push({pathname: "/(pages)/addActivity"
            , params: { flockId : flockId}})}>
            <Text style={{backgroundColor: COLORS.white, padding: 5, borderRadius: 20, fontSize: 20,fontWeight: '600', marginTop: 20, marginBottom: 10, color: COLORS.primary}}>+</Text>
           </TouchableOpacity>
        </View>
        {
            flockData.length > 0 ? (
             <View>
                { flockData.map((item: any) => (
                  <View key={item.id} style={styles.listItem}>
                     <Text style={styles.listText}>📅 {item.date}</Text>
                     <Text style={styles.listText}>⚖️ {item.totalWeight} kg</Text>
                     <Text style={styles.listText}>🍚 {item.quantity} kg</Text>
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
        <View style={{marginBottom:60}}></View>
         <View style={{marginBottom:60}}></View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const SummaryItem = ({ label, value, highlight }: { label:any, value:any, highlight?: any}) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryLabel}>{label}:</Text>
    <Text style={[styles.summaryValue, highlight && { backgroundColor: highlight, paddingHorizontal: 5, borderRadius: 3, fontWeight: 'bold' }]}>{value}</Text>
  </View>
);

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
    paddingTop: 20, // Adjust for status bar
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

  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  input: {
    height: 45,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  summaryBox: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomColor: '#CFD8DC',
    borderBottomWidth: 0.5,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.primary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
  },
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.primary,
    fontStyle: 'italic',
  }
});