import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ScrollView  } from 'react-native';
import t from 'tcomb-form-native';

const user = t.struct({
  userName: t.String,
  email: t.String,
  password: t.String,
  ReenterPassword: t.String,
  SetHome: t.Boolean,
});

const Form = t.form.Form;

export default class userRegister extends Component {
  state = {
    currentLongitutde: '122.3321',
    currentLatitude: '47.6062',
    lastSetHome: false,
    options: {
      fields: {
        ReenterPassword: {
          label: 'Re-enter Password',
          password: true,
          secureTextEntry: true,
        },
        email: {},
        userName: {},
        password: { password: true, secureTextEntry: true },
        SetHome: { label: 'Set Home Location' },
      },
    },
    value:{}
  };

  setFormRef = r => (this.FormRef = r);

  onPress() {
    var value = this.FormRef.getValue();
    var errors  = {
      fields: {
        ReenterPassword: {
          label: 'Re-enter Password',
          password: true,
          secureTextEntry: true,
        },
        email: {},
        userName: {},
        password: { password: true, secureTextEntry: true },
        SetHome: { label: 'Set Home Location' },
      }
    }
    var hasError = false;
    if(value!=null)
    {
      errors.fields.email.value = value.email;
      if (!value.email.includes('@')) {
        errors.fields.email.error = 'Not an email';
        errors.fields.email.hasError = true;
        hasError = true;
      } else if (value.email.length > 255) {
        errors.fields.email.error = 'Email too long';
        errors.fields.email.hasError = true;
        hasError = true;
      }

      if (value.password.length < 8) {
        errors.fields.password.error = 'Password too short';
        errors.fields.password.hasError = true;
        hasError = true;
      } else if (value.password.length > 72) {
        errors.fields.password.error = 'Password too long';
        errors.fields.password.hasError = true;
        hasError = true;
      } else if (value.ReenterPassword != value.password) {
        errors.fields.password.error = 'Passwords do not match';
        errors.fields.password.hasError = true;
        hasError = true;
        errors.fields.ReenterPassword.error =
          'Passwords do not match';
          errors.fields.ReenterPassword.hasError = true;
      }

      if (value.userName.length < 8) {
        errors.fields.userName.error = 'Username too short';
        errors.fields.userName.hasError = true;
        hasError = true;
      } else if (value.userName.length > 64) {
        errors.fields.userName.error = 'Username too long';
        errors.fields.userName.hasError = true;
        hasError = true;
      }
      this.setState({"value":value});
      
      if(hasError == false)
      {
        
        var toSend = {
          email:value.email,
          password: value.password,
          username: value.userName,
        }
        if(this.state.lastSetHome == true)
        {
          toSend.homeLat = this.state.currentLatitude;
          toSend.homeLng = this.state.currentLongitutde;
        }
        fetch("http://157.230.158.143/CreateAccount", {
        method: 'POST',  
        body: JSON.stringify(toSend),  
        headers:{
          'Content-Type': 'application/json'
        }
          }).then(res => {
          var values = JSON.parse(res._bodyText);
          if(res.status == 200 && values.isErrored == false)
            this.props.navigation.pop();
          else 
            alert(JSON.stringify(res));
        }).catch( reason => 
        {
          alert(JSON.stringify(reason));
        });
      }
      else
      {
        this.setState({"options":errors});
      }
    }
  }

  updateCoords(coords) {
    this.setState({ currentLongitutde: coords.longitude });
    this.setState({ currentLatitude: coords.latitude });
  }

  onChange(lValue) {
    if (this.state.lastSetHome == false && lValue.SetHome == true) {
      this.setState({ lastSetHome: true });
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({ currentLongitutde: position.coords.latitude });
          this.setState({ currentLatitude: position.coords.longitude });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } else if (lValue.SetHome == false) {
      this.setState({ lastSetHome: false });
    }
    this.setState({"value":lValue});
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
      <ScrollView>
        <Form
          type={user}
          options={this.state.options}
          onChange={this.onChange.bind(this)}
          ref={this.setFormRef}
          value={this.state.value}
        />
        <TouchableHighlight
          style={styles.button}
          onPress={() =>
            navigate('GetLocation', {
              latitude: this.state.currentLongitutde,
              longitude: this.state.currentLatitude,
              updateCoords: this.updateCoords.bind(this),
            })
          }
          underlayColor="red">
          <Text style={styles.buttonText}>SetLocation</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={this.onPress.bind(this)}
          underlayColor="red">
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
         </ScrollView>
      </View>
    );
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
