import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

export default function App() {
  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCYdUkSzvfwSZzsVyL71PYms44fUeo19CM",
    authDomain: "ostoslista-9b6e9.firebaseapp.com",
    databaseURL:
      "https://ostoslista-9b6e9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ostoslista-9b6e9",
    storageBucket: "ostoslista-9b6e9.appspot.com",
    messagingSenderId: "852763179296",
    appId: "1:852763179296:web:53b24b38fb81d63a1aff45",
    measurementId: "G-L9FJ8T85Y5",
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [product, setProduct] = useState({
    purchase: "",
    amount: "",
  });
  const [items, setItems] = useState([]);

  const saveItem = () => {
    const { purchase, amount } = product;

    if (purchase && amount) {
      push(ref(database, "items/"), {
        purchase: purchase,
        amount: amount,
      });

      setProduct({ purchase: "", amount: "" });
    }
  };

  const deleteItem = (id) => {
    remove(ref(database, `items/${id}`));
  };

  useEffect(() => {
    const itemsRef = ref(database, "items/");

    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const itemRef = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setItems(itemRef);
      } else {
        setItems([]);
      }
    });
  }, [database]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <TextInput
        style={styles.input}
        placeholder="Purchase"
        onChangeText={(text) => setProduct({ ...product, purchase: text })}
        value={product.purchase}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        onChangeText={(text) => setProduct({ ...product, amount: text })}
        value={product.amount}
      />
      <Button onPress={saveItem} title="Save" />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemListText}>
              {item.purchase}, {item.amount}
            </Text>
            <Text style={styles.bought} onPress={() => deleteItem(item.id)}>
              Delete
            </Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 200,
  },
  item: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  itemListText: {
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 300,
  },
  bought: {
    color: "blue",
    marginLeft: 10,
  },
});
