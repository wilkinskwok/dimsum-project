import React, { useState,  useEffect  } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation  } from '@react-navigation/native';

const YourOrder = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(false);
  const navigation = useNavigation();

  const fetchShoppingCart = async () => {
    try {      
      const cartData = await AsyncStorage.getItem('shoppingCart');
      const parsedData = JSON.parse(cartData);
      if (parsedData) {
        setOrderItems(parsedData);
        console.log(parsedData);
        setDataAvailable(true);        
      } else {       
        setDataAvailable(false);
      }
    } catch (error) {
      // Handle error
      console.error('Error fetching shopping cart:', error);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image style={styles.orderItemImage} source={{ uri: item.PhotoPath }} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemDetails} >{item.DimSumName}</Text>
        <Text>Quantity: {item.quantity}</Text>
      </View>
    </View>
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchShoppingCart();
    }, [])
  );

  useEffect(() => {
    fetchShoppingCart();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Order</Text>
      {dataAvailable ? (
      <FlatList
          data={orderItems}
          keyExtractor={(item) => item.DimSumName}          
          renderItem={renderOrderItem}              
        />
      ) : (
        <Text style={styles.emptyOrderText}>Your order is empty. Pleae place order.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyOrderText: {
    flex: 1,
    marginTop: 8,
    fontSize: 20,
  },
  orderItemImage: {
    width: 80,
    height: 80,
    marginRight: 8,
  },  
  itemDetails: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 1,
    marginBottom: 10,
  },

});

export default YourOrder;
