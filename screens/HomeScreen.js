import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';

import DimSumMenu from '../components/DimSumMenu';

const HomeScreen = () => {

  return (
    <View style={styles.container}>      
      <Image style={styles.headerImage} source ={{uri : "https://pinkpearl.com/wp-content/uploads/2022/09/pinkpearl-logo.png"}} />
      <Text style={styles.TextStyle}> Menu </Text>
      <ScrollView style={styles.container}  showsVerticalScrollIndicator = {false} >        
        {DimSumMenu.map((dimSum) => (
          <View key={dimSum.DimSumStyle}>
            <Text style={styles.dimSumStyle}>{dimSum.DimSumStyle}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <FlatList
                horizontal               
                data={dimSum.Item}                
                renderItem={({ item }) => (
                  <View style={styles.dimSumItem}>                                    
                    <Image style={styles.image} source={{ uri: item.PhotoPath }} />
                    <Text style={styles.dimSumName}>{item.DimSumName}</Text> 
                  </View>
                )}
                keyExtractor={(item) => item.DimSumName}
              />
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  TextStyle: {
    fontSize: 30,
  },
  headerImage: {
    height: 50,
    width: 200,
  },
  image: {
    height: 200,
    width: 300,
  },
  container: {
    padding: 16,
    backgroundColor: 'lightblue',
    paddingBottom: 90, // Add some padding at the bottom to avoid overlap with the bottom navigation bar
  },
  dimSumStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dimSumItem: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
  },
  dimSumName: {
    marginRight: 8,
    fontSize: 16,
    paddingBottom: 7, 
  },
  scrollViewContent: {
    paddingBottom: 100, // Add some padding at the bottom to avoid overlap with the bottom navigation bar
  },
});

export default HomeScreen;
