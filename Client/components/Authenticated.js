import React, { Component } from 'react';
import { Button, ScrollView, TextInput } from 'react-native';
import { Text, View, StyleSheet , TouchableHighlight} from 'react-native';
import { Constants } from 'expo';
import { AsyncStorage } from 'react-native';

export default class AuthenticatedScreen extends React.Component
{

  constructor(){
    super()
    this.doLogout = this.doLogout.bind(this);
  }

  async deleteJWT() {
    try{
      await AsyncStorage.removeItem('id_token')
      .then(
        () => {
          this.setState({
            jwt: ''
          })
        }
      );
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  }

  // Delete state jwt and AsyncStorage JWT
  doLogout() {
    this.deleteJWT();
    this.props.navigation.navigate('Home');
    //this.props.navigation.pop();
  }

  render() {
      return (
        <View style={styles.container}>
        <ScrollView>
          <Text 
            style={{fontSize: 27, marginBottom: 20, alignSelf: 'center'}}>
            Authenticated View
          </Text>
          <Text
            style={{marginTop: 20, marginBottom: 20}}>
            You're in the secret area now!!
          </Text>
            <TouchableHighlight
              style={styles.button}
              onPress={this.doLogout}
              underlayColor="red">
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableHighlight>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 0,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  },
  button:{
    height: 50,
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    marginBottom: 5
  }
});