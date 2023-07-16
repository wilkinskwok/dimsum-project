// BillPage.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const BillPage = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(false);

  

  const fetchShoppingCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('shoppingCart');
      const parsedData = JSON.parse(cartData);
      if (parsedData) {
        setOrderItems(parsedData);
        setDataAvailable(true)
      }
    } catch (error) {
      console.error('Error fetching shopping cart:', error);
    }
  };

  const handleConfirmPayment = () => {    
    setIsModalVisible(true);
  };

  const handleFinishedPayment = async () => {
    try {
      setIsModalVisible(false)      
      await AsyncStorage.clear();
      setDataAvailable(false)
      navigation.navigate('Home'); // Navigate to the HomeScreen
      console.log('handleFinishedPayment')
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }
  
  // Generate the order details string for the QR code
  const orderDetails = JSON.stringify(orderItems);

  useFocusEffect(
      React.useCallback(() => {
        fetchShoppingCart();
      }, [])
    );

  return (
    <View style={styles.container}>
      {dataAvailable ? (  
        <>      
          <Text style={styles.heading}>Bill Payment</Text>
          <View style={styles.QRCodeContainer}>
            <QRCode style={styles.QRCodeContainer} value={orderDetails} size={200} />
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
                <Text style={styles.confirmButtonText}>Confirm Payment</Text>
          </TouchableOpacity>      

          <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text> Thank you for your payment </Text>
              <TouchableOpacity style={styles.confirmButton} onPress = {handleFinishedPayment}>
                <Text style={styles.confirmButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      ) : (
        <>
          <Text style={styles.heading}>Bill Payment</Text>
          <Text style={styles.emptyOrderText}>Your order is empty. Pleae place order.</Text>
        </>
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
    marginBottom: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmButton: {    
    marginTop: 16,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  QRCodeContainer: {    
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,    
  },
  emptyOrderText: {
    flex: 1,
    marginTop: 8,
    fontSize: 20,
  },
});

export default BillPage;
