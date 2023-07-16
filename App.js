import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import PlaceOrder from './screens/PlaceOrder';
import YourOrder from './screens/YourOrder';
import BillPage from './screens/BillPage'

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer >
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            console.log(size)
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Place Order') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Your Order') {
              iconName = focused ? 'documents' : 'documents-outline';
            } else if (route.name === 'Bill Page') {
              iconName = focused ? 'cash-register' : 'cash-register';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />
            }
             return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        >       

        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Place Order" component={PlaceOrder} />
        <Tab.Screen name="Your Order" component={YourOrder} />
        <Tab.Screen name="Bill Page" component={BillPage}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

/*
const styles = StyleSheet.create ({
  container: {
      padding: 16,
      backgroundColor: 'lightblue',
    },
})
*/



export default App;
