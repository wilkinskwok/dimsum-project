import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Button, Modal } from 'react-native';
import DimSumMenu from '../components/DimSumMenu';
import Icon from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage';


const OrderPage = () => {
  const [orderItems, setOrderItems] = useState([]); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Calculate the total quantity
  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  //handler for user clicking "+" or "-" button in the order page
  const handleOrderItem = (item, qty) => {    
    // Check if the item already exists in the orderItems array
    const itemIndex = orderItems.findIndex((firstItems) => firstItems.DimSumName === item.DimSumName);    
    const updatedOrderItems = [...orderItems];   

    if (itemIndex === -1 && qty === -1) {
      //if the item does not exist and customer still presses the "-" button, exit this module
      return
    }       

    if (itemIndex === -1 && qty > 0 ) {
      // If the item does not exist and customer want to add a new item, then add it to the orderItems array with a quantity of 1  
      setOrderItems((orderItems) => [...orderItems, { ...item, quantity: 1 }]);            
    } else if ( updatedOrderItems.length > 0 && updatedOrderItems[itemIndex].quantity >= 0){
        // If the item already exists, update its quantity by newQuantity which can be 1 or -1   
        const newQty = updatedOrderItems[itemIndex].quantity + qty  ;
        if (newQty >= 0) {
          //if the new quantity is 1 or above, update the new quantity
          updatedOrderItems[itemIndex].quantity = newQty
          setOrderItems(updatedOrderItems);        
        } else {
          // if the new quanitty is zero or less, delete the item record in the orderItems array
          const deleteOrderItems = orderItems.filter((item) => item.quantity > 0);
          setOrderItems(deleteOrderItems)
        }          
    }    
  }

  //handler for user clicking "Submit order" button
  const handleOrderSubmit = () => {
    //delete record with zero quantity before order submit
    const deleteOrderItems = orderItems.filter((item) => item.quantity > 0);
    setOrderItems(deleteOrderItems)
    setIsModalVisible(true); // Show the modal with the order summary    
  };

  //handler for user closing the order summary modal page
  const handleCloseModal = async () => {

    try {
      await AsyncStorage.setItem('shoppingCart', JSON.stringify(orderItems));
      setIsModalVisible(false); // Close the modal when the user taps outside or dismiss button
      setOrderItems([]) // empty the order array when user finished the order
      //console.log(orderItems)
    } catch (error) {
      // Handle error
      console.error('Error saving shopping cart:', error);
    }
    
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Place Your Order</Text>
      <FlatList
        data={DimSumMenu}
        keyExtractor={(item) => item.DimSumStyle}
        showsVerticalScrollIndicator = {false}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.dimSumStyle}>{item.DimSumStyle}</Text>
            <FlatList
              data={item.Item}
              keyExtractor={(item) => item.DimSumName}
              horizontal
              
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.dimSumItem}>
                  <Image style={styles.image} source={{ uri: item.PhotoPath }} />
                  <Text style={styles.dimSumName}>{item.DimSumName}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleOrderItem(item, -1)}
                    >
                    <Icon name="circle-with-minus" size={25} color="blue" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {orderItems.find((orderItem) => orderItem.DimSumName === item.DimSumName)?.quantity || 0}
                    </Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleOrderItem(item, 1)}
                    >                      
                    <Icon name="circle-with-plus" size={25} color="blue" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            {/* Modal for Order Summary */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalHeading}>Order Summary:</Text>
                  {orderItems.map((item) => (
                    <View key={item.DimSumName} style={styles.modalItem}>
                      <Image style={styles.modalItemImage} source={{ uri: item.PhotoPath }} />
                      <Text>{item.DimSumName}</Text>
                      <Text>Quantity: {item.quantity}</Text>
                    </View>
                  ))}
                  <Button title="Confirm Order" onPress={handleCloseModal} />
                </View>
              </View>
            </Modal>
          </View>
        )}
      />
      <Button title="Submit Order" onPress={handleOrderSubmit} disabled={totalQuantity <= 0} />     
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
  dimSumStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dimSumItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  dimSumName: {
    marginTop: 8,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,    
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalItemImage: {
    width: 30,
    height: 30,
    marginRight: 8,
  },  
});

export default OrderPage;
