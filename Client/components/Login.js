import React, { Component } from 'react';
import { Button, ScrollView, TextInput } from 'react-native';
import { Text, View, StyleSheet , TouchableHighlight} from 'react-native';
import { Constants } from 'expo';
import t from 'tcomb-form-native';
import deviceStorage from './Storage';
import { AsyncStorage } from 'react-native';
import AuthenticatedScreen from './Authenticated.js'

const user = t.struct({
  username: t.String,
  password: t.String,
});

const Form = t.form.Form;
const options = {
  fields: {
    password: { password: true, secureTextEntry: true }
  }
};

export default class LoginScreen extends React.Component
{

  constructor() {
    super();
    this.state = {
      jwt: '',
    }
    this.loadJWT();
  }

  async loadJWT() {
    try {
      const value = await AsyncStorage.getItem('id_token');
      if (value !== null) {
        this.setState({
          jwt: value,
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
      }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  }

  async saveKey(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  }

  doLogin = () => {
    const value = this._form.getValue();
    //alert(JSON.stringify(value));
    let error = (!value || !value.username || !value.password);
    if(!error) {
      fetch("http://157.230.158.143/auth", {
        method: 'POST',  
        body: JSON.stringify(value),  
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(res => {
        var values = JSON.parse(res._bodyText);
        if(res.status == 200) {
          const token = JSON.parse(res._bodyText).jwt;
          //alert(token);
          this.saveKey("id_token", token);
          this.props.navigation.navigate('Authenticated');
        }
        else {
          alert(JSON.parse(res._bodyText).auth);
        }
      }).catch( error => {
        alert(error);
      });
    }
  }  

  render() {

    if(this.state.jwt) {
      //alert(this.state.jwt);
      return (
        <AuthenticatedScreen navigation={this.props.navigation} />
      )
    }
    // else show login
    else {
      return (
        <View style={styles.container}>
        <ScrollView>
          <Text 
            style={{fontSize: 27, marginBottom: 20, alignSelf: 'center'}}>
            Login
          </Text>
          <Form
            ref={c => this._form = c}
            type={user}
            options={options}
          />
            <TouchableHighlight
              style={styles.button}
              onPress={this.doLogin}
              underlayColor="red">
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableHighlight>
        </ScrollView>
      </View>
    )
  }

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