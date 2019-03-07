import React, { Component } from 'react';
import { Button } from 'react-native';
import { Text, View, StyleSheet , TouchableHighlight} from 'react-native';
import { Constants } from 'expo';

export default class HomeScreen extends React.Component
{
  render()
  {
    const {navigate} = this.props.navigation;
    return(
      <View style={styles.container}>
        <TouchableHighlight style={styles.button} onPress={ () => navigate('Login')} underlayColor='red'>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button} onPress={ () => navigate('Register')} underlayColor='red'>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>
      </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  buttonText:{
    fontSize: 20,
    color: 'white',
    alignSelf: 'center'
  },
  button:{
    height: 30,
    backgroundColor: 'blue',
    marginTop : 5
  }
});