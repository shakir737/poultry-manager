import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { EXPENSE_CATEGORIES, Units } from "@/constants/constants";
import { addActivity, addExpense, getExpenses, getResources, updateActivity } from "@/utils/storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

 interface Activity {
  category: string;
  resource: string;
  unit: string
  totalWeight: string;
  quantity: string;
  date: string;
  died: string;
 }
export default function page() {
   const params = useLocalSearchParams();
    const [editMode, setEditMode] = useState<Activity>({
        category: "",
        resource: "",
        unit: "",
        totalWeight: "",
        quantity: "",
        date: new Date().toISOString().split("T")[0],
        died: "",
   })
  const [category, setCategory] = useState(
   editMode.category === "" ?  EXPENSE_CATEGORIES[0] : editMode.category
  );
const [unit, setUnit] = useState(editMode.unit ==="" ? Units[0] : editMode.unit )
   const [resource, setResource] = useState(editMode.resource);
   const [resources, setResources] =useState<any>([])
   const [expense, setExpense] = useState<any>([]);
   const [resourceData, setResourceData] = useState<any>([]);
   const [amount, setAmount] = useState(0);
   const { itemId, flockId } = params
    
  useEffect(() => {
    loadResource();
    refreshData();
    loadExpense()
  }, []);
 
    useEffect(() => {
    refreshData();
    },[category])
  
  
     useEffect(() => {
    loadExpense();
    calculateAmount();
    },[editMode.quantity, resource])


   const loadExpense = async () => {
      const expense = await getExpenses();
      const result: any  = expense.filter((expense: any) =>  expense.resource === resource);
      setExpense(result);
    }

  const refreshData = async () => {
    const result = resourceData.filter((resource: any) => resource.category === category )
   
    setResources(result);
  }

  const loadResource = async () => {
   
     const resourceData = await getResources();
     setResourceData(resourceData);
     setResources(resourceData);
    
  };

  const handleInputChange = (key: keyof Activity, value: string) => {
    setEditMode(prevData => ({ ...prevData, [key]: value }));
  };
  
 const calculateAmount = async () => {
    if(expense.length > 0){
    const amount = parseFloat(editMode.quantity) * parseFloat(expense[0].perUnitPrice);
    // console.log(amount);
    setAmount(amount);
    }
   }

  const handleSave = async () => {
    if (!editMode.quantity || !editMode.totalWeight) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const ExpenseData = {
      flockId: flockId,
      category: category,
      resource: resource,
      unit: unit,
      perUnitPrice: expense[0].perUnitPrice,
      totalWeight: editMode.totalWeight,
      quantity: editMode.quantity,
      date: editMode.date,
      died: editMode.died,
      amount: amount
    };
    const ActivityData = {
      flockId: flockId,
      category: category,
      resource: resource,
      unit: unit,
      totalWeight: editMode.totalWeight,
      quantity: editMode.quantity,
      date: editMode.date,
      died: editMode.died,
 
    }; 


    if (itemId) {
       await updateActivity(itemId, ActivityData);
       Alert.alert("Success", "Resource updated successfully");
      } else {
       await addActivity(ActivityData);
       await addExpense(ExpenseData);
       Alert.alert("Success", "Activity added successfully");
     }
    router.push({pathname: "/(pages)/flockTracker"
               , params: { flockId : flockId}})
    
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Header />
      </View>
      <View style={styles.form}>
        <View style={{alignContent: "center", alignItems: "center", padding: 5, backgroundColor: COLORS.background}}>
           <Text style={{backgroundColor: COLORS.white, padding: 5, borderRadius: 10, fontSize: 16, color: COLORS.primary}}> {itemId ? "Update Activity" : "Add Activity"} </Text>
        </View>
          <Text style={styles.label}>
                    Category <Text style={styles.required}>*</Text>
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.categoryContainer}>
                      {EXPENSE_CATEGORIES.map((cat: any) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryButton,
                            category === cat && styles.categoryButtonActive,
                          ]}
                          onPress={() => setCategory(cat)}
                        >
                          <Text
                            style={[
                              styles.categoryButtonText,
                              category === cat && styles.categoryButtonTextActive,
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>

                 
                         <Text style={styles.label}>
                           Resource <Text style={styles.required}>*</Text>
                         </Text>
                         { resources.length > 0 ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                           <View style={styles.categoryContainer}>
                             {resources.map((cat: any) => (
                               <TouchableOpacity
                                 key={cat.id}
                                 style={[
                                   styles.categoryButton,
                                   resource === cat.name && styles.categoryButtonActive,
                                 ]}
                                 onPress={() => setResource(cat.name)}
                               >
                                 <Text
                                   style={[
                                     styles.categoryButtonText,
                                     resource === cat.name && styles.categoryButtonTextActive,
                                   ]}
                                 >
                                   {cat.name}
                                 </Text>
                               </TouchableOpacity>
                             ))}
                           </View>
                         </ScrollView>
                          ): (
                           <View><Text style={{color: COLORS.primary, backgroundColor: COLORS.white, padding:1}}>No Resources Are Added Against This Category. Please Add Resource First</Text></View>
                          )}

                   <Text style={styles.label}>
        Quantity Of Resource <Text style={styles.required}>*</Text>
                </Text>
         <TextInput
            style={styles.input}
            placeholder="Quantity Of Resource"
            value={editMode.quantity}
            onChangeText={text => handleInputChange("quantity", text)}
            keyboardType="numeric"
             placeholderTextColor={COLORS.primary}
          />

                 <Text style={styles.label}>
                   Today Avg. Weight<Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={editMode.totalWeight}
                   onChangeText={text => handleInputChange('totalWeight', text)}
                  placeholder="Enter Total Avg. Weight in kg"
                   placeholderTextColor={COLORS.primary}
                   keyboardType="numeric"
                />

                 <Text style={styles.label}>
                          Unit <Text style={styles.required}>*</Text>
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View style={styles.categoryContainer}>
                            {Units.map((cat: any) => (
                              <TouchableOpacity
                                key={cat}
                                style={[
                                  styles.categoryButton,
                                  unit === cat && styles.categoryButtonActive,
                                ]}
                                onPress={() => setUnit(cat)}
                              >
                                <Text
                                  style={[
                                    styles.categoryButtonText,
                                    unit === cat && styles.categoryButtonTextActive,
                                  ]}
                                >
                                  {cat}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </ScrollView>

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={editMode.date}
         onChangeText={text => handleInputChange("date", text)}
           placeholderTextColor={COLORS.primary}
          placeholder="YYYY-MM-DD"
        />
        

           <Text style={styles.label}>
        Total No. of Died or Loss <Text style={styles.required}>*</Text>
                </Text>
         <TextInput
            style={styles.input}
            placeholder="Number of died or loss"
            value={editMode.died}
            onChangeText={text => handleInputChange("died", text)}
            keyboardType="numeric"
             placeholderTextColor={COLORS.primary}
          />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {itemId ? "Update Resource" : "Add Resource"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 15,
  },
  required: {
    color: "#f44336",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    color: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  flockContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  flockButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 100,
    alignItems: "center",
  },
  flockButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: "#2196F3",
  },
  flockButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  flockButtonTextActive: {
    color: "#fff",
  },
  noFlocks: {
    fontSize: 14,
    color: "#f44336",
    fontStyle: "italic",
    marginTop: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: "#2196F3",
  },
  categoryButtonText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
