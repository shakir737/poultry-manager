import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { EXPENSE_CATEGORIES, Units } from "@/constants/constants";
import { addResource, deleteResource, getResource, updateResource } from "@/utils/storage";
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

 interface Resource {
  name: string;
  category: string;
  date: string;
  description: string;
 }
export default function page() {
   const params = useLocalSearchParams();
   const { itemId } = params
    const [editMode, setEditMode] = useState<Resource>({
        category: "",
        name: "",
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
    EXPENSE_CATEGORIES[0]
  );
  const [unit, setUnit] = useState(Units[0])
  const [amount, setAmount] = useState( "");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadResource();
    
  }, []);
 
    const handleDelete = (id: string) => {
      Alert.alert(
        "Delete Expense",
        `Are you sure you want to delete this ${category} expense?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteResource(id);
              loadResource();
            },
          },
        ]
      );
    };
   
  const loadResource = async () => {
   
    if(itemId){
      const response = await getResource(itemId)
      setEditMode(response)
    }
    // if (!selectedFlock && flocksData.length > 0) {
    //   setSelectedFlock(flocksData[0].id);
    // }
  };

  const handleInputChange = (key: keyof Resource, value: string) => {
    setEditMode(prevData => ({ ...prevData, [key]: value }));
  };
  const handleSave = async () => {
    if (!editMode.name) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const resourceData = {
      category: category,
      name: editMode.name,
      date: editMode.date,
      description: editMode.description,
    };

    if (itemId) {
      await updateResource(itemId, resourceData);
      Alert.alert("Success", "Resource updated successfully");
     } else {
      await addResource(resourceData);
      Alert.alert("Success", "Resource added successfully");
    }
    router.push("/(tabs)/home")
    
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Header />
      </View>
      <View style={styles.form}>
        <View style={{alignContent: "center", alignItems: "center", padding: 5, backgroundColor: COLORS.background}}>
           <Text style={{backgroundColor: COLORS.white, padding: 5, borderRadius: 10, fontSize: 16, color: COLORS.primary}}> {itemId ? "Update Resource" : "Add Resource"} </Text>
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
                  Resource Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={editMode.name}
                   onChangeText={text => handleInputChange('name', text)}
                  placeholder="Enter resource name"
                   placeholderTextColor={COLORS.primary}
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
