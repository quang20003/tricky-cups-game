import React from "react";
import { View, Text, Button, ImageBackground, StyleSheet, Image,  TouchableOpacity } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
const Home = ()=>{
    const navigation:any = useNavigation();
    return (
        <ImageBackground
      source={require('../../Assets/images/home-background.png')}
      style={styles.background}
    >
      <View style={styles.container}>
    
          <Image 
            source={require('../../Assets/images/logo.png')} style={styles.icon}
          />
      <TouchableOpacity onPress={() => navigation.navigate("GamePlay")}>
      <Image 
          source={require('../../Assets/images/tap-to-play.png')}
          style={styles.icons}
        />
        </TouchableOpacity>
      </View>
    </ImageBackground>
    )
}
export default Home

const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: "cover",
    
    },
    container: {
      flex: 1,
      
      alignItems: "center",
    },
    text: {
      fontSize: 24,
      color: 'white',
      marginBottom: 20,
    },
    icon: {
        width: 304,   
        height: 132,  
        top:303
      },
      icons: {
        width: 240,   
        height: 36,  
        top:357
      },
  });