import React, { Component } from 'react';
import { Button } from 'react-native';
import { Image, Text, View, StyleSheet , TouchableHighlight} from 'react-native';
import { Constants, MapView } from 'expo';

import marker from '../assets/marker.png';

export default class GetPostionScreen extends React.Component
{
  state = {mapRegion: {
      latitude: this.props.navigation.state.params.latitude,
      longitude: this.props.navigation.state.params.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    },
  }

  _handleMapRegionChange = newCoords => {
    this.props.navigation.state.params.updateCoords(newCoords);
  };
  goToCoords = () => {
    
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            mapRegion: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
          });
          this.props.navigation.state.params.updateCoords({"latitude":position.coords.latitude, "longitude":position.coords.longitude});
        },
        error => alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };

  onSubmit() {
    this.props.navigation.pop();
  }


  render()
  {
    const {navigate} = this.props.navigation;
    return(
      <View style={styles.container}>
        <MapView
          style={{ alignSelf: 'stretch', height: 400 }}
          region={this.state.mapRegion}
          onRegionChange={this._handleMapRegionChange}
        />
        <View style={styles.markerFixed}>
          <Image style={styles.marker} source={marker} />
        </View>

        <TouchableHighlight style={styles.button} onPress={() => this.goToCoords()} underlayColor='red'>
          <Text style={styles.buttonText}>Go To My Position</Text>
        </TouchableHighlight>


        <TouchableHighlight style={styles.button} onPress={this.onSubmit.bind(this)} underlayColor='red'>
          <Text style={styles.buttonText}>Set Location</Text>
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
    marginTop: 5
  },
  markerFixed: {
    left: '50%',
    marginLeft: 10,
    marginTop: -27,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 74,
    width: 48,
  },
});