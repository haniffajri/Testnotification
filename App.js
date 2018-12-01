/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  async componentDidMount() {
    this.checkPermission();
  }
  
    //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.warn('cp s '+enabled)
    if (enabled) {
      console.warn('cp ok')
        this.getToken();
    } else {
      console.warn('cp gggl')
        this.requestPermission();
    }
  }
  
    //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken', value);
    console.warn('tokens s '+fcmToken)
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            console.warn('token '+fcmToken)
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  
    //2
  async requestPermission() {
    console.warn('rep')
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        console.warn('rep ok')
        this.getToken();
    } catch (error) {
      console.warn('rep noo')
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, ejda </Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
