import { View, Text, StyleSheet, FlatList } from "react-native";
import AdminLayout from "../components/AdminLayout";

const products = [
  { id: "1", name: "Milk Packet", stock: 100 },
  { id: "2", name: "Curd", stock: 50 },
  { id: "3", name: "Ghee", stock: 20 },
];

export default function Stock() {
  return (
    <AdminLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Stock</Text>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Stock Left: {item.stock}</Text>
            </View>
          )}
        />
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});