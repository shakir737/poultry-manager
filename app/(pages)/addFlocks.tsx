import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { POULTRY_TYPES, Units } from "@/constants/constants";
import { addFlock, getFlock, updateFlock } from "@/utils/storage";
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

interface editMode {
  name: string;
  quantity: string;
   type: string ;
   unit: string;
   weight: string ;
   size: string ;
   startDate: string;
   notes: string ;

}
export default function page() {
  const params = useLocalSearchParams();
  const {item, itemId } = params
  const [number, setNumber] = useState(0);
   const [editMode, setEditMode] = useState<editMode>({
     name: "",
    quantity: "",
    type: "",
    unit: "",
    weight: "",
    size: "",
    startDate: new Date().toISOString().split("T")[0],
    notes: "",
})
//  const [name, setName] = useState(editMode.name);
  const [type, setType] = useState(editMode.type === "" ?  POULTRY_TYPES.BROILER : editMode.type);
  const [unit, setUnit] = useState(editMode.unit ==="" ? Units[0] : editMode.unit )

//  const [quantity, setQuantity] = useState(
//      editMode.quantity 
//    );
//    const [weight, setWeight] = useState(editMode.weight );
//    const [size, setSize] = useState(editMode.size );
//    const [startDate, setStartDate] = useState(
//      editMode.startDate 
//    );
//    const [notes, setNotes] = useState(editMode?.notes);
const fetchData = async () => {
          try {
          
         
            const response = await getFlock(itemId)
           setEditMode(response)

            
          } catch (error) {
            console.error("Error fetching data:", error);
          }
 };
  const handleInputChange = (key: keyof editMode, value: string) => {
    setEditMode(prevData => ({ ...prevData, [key]: value }));
  };
 useEffect(() => {
       
        if(itemId){
          fetchData()
          setNumber(1)
        }
      
      }, []); // Empty dependency array for effect to run once on mount
 useEffect(() => {
       if(number < 2) {
        if(itemId){
          fetchData()
          setNumber(number + 1)
        }
       }
      }, [editMode]);

 

  const handleSave = async () => {
    if (!editMode.name || !editMode.quantity) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const flockData = {
      name: editMode.name,
      unit: unit,
      type : type,
      quantity: parseInt(editMode.quantity),
      weight: editMode.weight,
      size: editMode.size,
      startDate : editMode.startDate,
      notes: editMode.notes,
    };

    if (itemId) {
       await updateFlock(itemId, flockData);
      Alert.alert("Success", "Flock updated successfully");
    } else {
      await addFlock(flockData);
      Alert.alert("Success", "Flock added successfully");
    }

    router.push("/(tabs)/flocks")
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Header />
      </View>
      <View style={styles.form}>
          <View style={{alignContent: "center", alignItems: "center", padding: 5, backgroundColor: COLORS.background}}>
                   <Text style={{backgroundColor: COLORS.white, padding: 5, borderRadius: 10, fontSize: 16, color: COLORS.primary}}> {itemId ? "Update Flock" : "Add Flock"} </Text>
                </View>
        <Text style={styles.label}>
          Flock Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={editMode.name}
           onChangeText={text => handleInputChange('name', text)}
           placeholderTextColor={COLORS.primary}
          placeholder="Enter flock name"
        />

        <Text style={styles.label}>
          Type <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.categoryContainer}>
          {Object.values(POULTRY_TYPES).map((poultryType) => (
            <TouchableOpacity
              key={poultryType}
              style={[
                styles.categoryButton,
                       type === poultryType && styles.categoryButtonActive,
              ]}
              onPress={() => setType(poultryType)}
            >
              <Text
                style={[
                   styles.categoryButtonText,
                       type === poultryType && styles.categoryButtonTextActive,
                ]}
              >
                {poultryType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>
          Quantity <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={(editMode.quantity)?.toString()}
          onChangeText={text => handleInputChange("quantity", text)}
          placeholder="Enter quantity"
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

        <Text style={styles.label}>Average Weight</Text>
        <TextInput
          style={styles.input}
          value={editMode.weight}
         onChangeText={text => handleInputChange("weight", text)}
          placeholder="Enter average weight"
          placeholderTextColor={COLORS.primary}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Size</Text>
        <TextInput
          style={styles.input}
          value={editMode.size}
        onChangeText={text => handleInputChange("size", text)}
        placeholderTextColor={COLORS.primary}
          placeholder="Enter size (e.g., Small, Medium, Large)"
        />

        <Text style={styles.label}>Start Date</Text>
        <TextInput
          style={styles.input}
          value={editMode.startDate}
          onChangeText={text => handleInputChange("startDate", text)}
          placeholderTextColor={COLORS.primary}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={editMode.notes}
         onChangeText={text => handleInputChange("notes", text)}
          placeholder="Enter any additional notes"
          multiline
          placeholderTextColor={COLORS.primary}
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {"Add Flock"}
          </Text>
        </TouchableOpacity>
        <View style={styles.margin}></View>
         <View style={styles.margin}></View>
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
  typeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: "#fff",
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
  margin: {
    marginBottom: 70
  }
});
