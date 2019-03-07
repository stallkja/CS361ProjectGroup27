import React, { Component } from 'react';
import { Button } from 'react-native';
import { Text, View, StyleSheet , TouchableHighlight} from 'react-native';
import { Constants } from 'expo';

export default class LoginScreen extends React.Component
{
  render()
  {
    const {navigate} = this.props.navigation;
    return(
      <View style={styles.container}>
        <Text>To Be Done</Text>
      </View>)
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  }
});