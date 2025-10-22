import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { EXPENSE_CATEGORIES, Units } from "@/constants/constants";
import { addExpense, getExpense, getExpenses, getFlock, getResources, updateExpense } from "@/utils/storage";
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

 interface Expense {
  resource: string;
  category: string;
  quantity: string;
  unit: string;
  amount: string;
  date: string;
  description: string;
 }
  interface Expense1 {
  resource: string;
  category: string;
  quantity: string;
  unit: string;
  amount: string;
  date: string;
  description: string;
  perUnitPrice?: number;
 }
export default function page() {
   const params = useLocalSearchParams();
   const { itemId, flockId } = params
    const [editMode, setEditMode] = useState<Expense>({
        resource: "",
        category: "",
        quantity: "",
        unit: "",
        amount: "",
       date: new Date().toISOString().split("T")[0],
       description: "",
   })
  const [flock, setFlock] = useState(
    {
      id: "",
      name: "",
    }
  );
  const [selectedFlock, setSelectedFlock] = useState( "");
  const [category, setCategory] = useState(
   editMode.category === "" ?  EXPENSE_CATEGORIES[0] : editMode.category
  );
  const [unit, setUnit] = useState(editMode.unit ==="" ? Units[0] : editMode.unit )
  const [amount, setAmount] = useState( "");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
 
  const [description, setDescription] = useState("");
  const [resources, setResources] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [expense, setExpense] = useState<any[]>([]);
   const [resource, setResource] = useState(
    editMode.resource
  )
  useEffect(() => {
    loadFlocks();
    refreshData();
    loadExpense()
  }, []);
 
  useEffect(() => {
  refreshData();
  },[category])


   useEffect(() => {
  loadExpense();
  calculateAmount();
  },[editMode.quantity])

  const calculateAmount = async () => {
    if(expense.length > 0){
    const amount = parseFloat(editMode.quantity) * parseFloat(expense[0].perUnitPrice);
    // console.log(amount);
    setEditMode({...editMode, amount: amount.toString()});
    }
   
  }

  const loadExpense = async () => {
    const expense = await getExpenses();
    const result: any  = expense.filter((expense: any) =>  expense.resource === resource);
    setExpense(result);
  }
const refreshData = async () => {
  const result = resourceData.filter((resource: any) => resource.category === category )
 
  setResources(result);
}

  const loadFlocks = async () => {
    const flockData = await getFlock(flockId);
    const resourceData = await getResources();
    setResourceData(resourceData);
    setResources(resourceData);
    if(itemId){
      const response = await getExpense(itemId)
      setEditMode(response)
    }
    setFlock(flockData);
    // if (!selectedFlock && flocksData.length > 0) {
    //   setSelectedFlock(flocksData[0].id);
    // }
  };

  const handleInputChange = (key: keyof Expense, value: string) => {
    setEditMode(prevData => ({ ...prevData, [key]: value }));
  };
  const handleSave = async () => {
    if (!editMode.amount) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    const perUnitPrice = parseFloat(editMode.amount) / parseFloat(editMode.quantity)
   
    const expenseData = {
      flockId:
       flockId ?  flock.id : "General",
      category: category,
      resource: resource,
      unit: unit,
      quantity: parseFloat(editMode.quantity),
      amount: parseFloat(editMode.amount),
      date: editMode.date,
      description: editMode.description,
      perUnitPrice: perUnitPrice
    };

    if (itemId) {
      await updateExpense(itemId, expenseData);
      Alert.alert("Success", "Expense updated successfully");
     } else {
      await addExpense(expenseData);
      Alert.alert("Success", "Expense added successfully");
    }

    router.push("/(tabs)/expense")

  };


  return (
    <ScrollView style={styles.container}>
      <View>
        <Header />
      </View>
      <View style={styles.form}>
          <View style={{alignContent: "center", alignItems: "center", padding: 5, backgroundColor: COLORS.background}}>
                   <Text style={{backgroundColor: COLORS.white, padding: 5, borderRadius: 10, fontSize: 16, color: COLORS.primary}}> {itemId ? "Update Expense" : "Add Expense"} </Text>
                </View>
        <Text style={styles.label}>
          Select Flock <Text style={styles.required}>*</Text>
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.flockContainer}>
            {flockId ? (
              <View>
             
              <TouchableOpacity
                key={flock.id}
                style={[
                  styles.flockButton,
                  selectedFlock === flock.id && styles.flockButtonActive,
                ]}
                onPress={() => setSelectedFlock(flock.id)}
              >
                <Text
                  style={[
                   
                    styles.flockButtonTextActive,
                  ]}
                >
                  {flock.name}
                </Text>
              </TouchableOpacity>
              </View>
             
            ): (
               <View>
                 <TouchableOpacity
                style={[
                  styles.flockButton,
                  styles.flockButtonActive,
                ]}
                onPress={() => setSelectedFlock("General")}
              >
                <Text
                  style={[
                    styles.flockButtonText,
                    styles.flockButtonTextActive,
                  ]}
                >
                  General
                </Text>
              </TouchableOpacity>
               </View>
            )}
            
          </View>
        </ScrollView>

        {/* {flocks.length === 0 && (
          <Text style={styles.noFlocks}>
            No flocks available. Please add a flock first.
          </Text>
        )} */}

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
          Quantity <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={(editMode.quantity).toString()}
         onChangeText={text => handleInputChange("quantity", text)}
          placeholder="Enter Quantity"
          placeholderTextColor={COLORS.primary}
          keyboardType="decimal-pad"
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
       
        <Text style={styles.label}>
          Amount (₹) <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={(editMode.amount).toString()}
         onChangeText={text => handleInputChange("amount", text)}
          placeholder="Enter amount"
          placeholderTextColor={COLORS.primary}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={editMode.date}
         onChangeText={text => handleInputChange("date", text)}
           placeholderTextColor={COLORS.primary}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={editMode.description}
          onChangeText={text => handleInputChange("description", text)}
          placeholder="Enter description (optional)"
          multiline
          placeholderTextColor={COLORS.primary}
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {itemId ? "Update Expense" : "Add Expense"}
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
