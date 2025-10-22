import Header from "@/components/Header";
import { COLORS } from "@/constants/color";
import { calculateAge } from "@/constants/constants";
import { deleteFlock, getFlocks } from "@/utils/storage";
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

export default function flocks() {
  const [flocks, setFlocks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const loadFlocks = async () => {
    const data = await getFlocks();
    setFlocks(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadFlocks();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFlocks();
    setRefreshing(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete Flock",
      `Are you sure you want to delete "${name}"? This will also delete all related expenses.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteFlock(id);
            loadFlocks();
          },
        },
      ]
    );
  };



  return (
    <View style={styles.container}>
      <View>
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
          <Header />
          <View>
            {
              flocks.length > 0 ? (
                flocks.map((item: any) => (
             <TouchableOpacity key={item.id}
      style={styles.card}
       onPress={() =>  router.push({pathname: "/(pages)/flock", params: { itemId: item.id}})}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.flockName}>{item.name}</Text>
          <Text style={styles.flockType}>{item.type}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.quantity}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{calculateAge(item.startDate)}</Text>
        </View>

        {item.weight && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Avg Weight:</Text>
            <Text style={styles.infoValue}>{item.weight}{item.unit}</Text>
          </View>
        )}

        {item.size && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Size:</Text>
            <Text style={styles.infoValue}>{item.size}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.editButton}
       onPress={() =>  router.push({pathname: "/(pages)/addFlocks", params: { itemId: item.id}})}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No flocks yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first flock
            </Text>
          </View>
              )
            }
          </View>
          <View style={{marginBottom: 0}}></View>
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(pages)/addFlocks")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  flockName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  flockType: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardBody: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 10,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.primary,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    gap: 10,
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
    right: 20,
    bottom: 20,
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
});
