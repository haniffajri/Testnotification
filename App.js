/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './Home';
import DataScreen from './Data';
import PhoneScreen from './phone';

const App = createBottomTabNavigator({
  Phone: {screen: PhoneScreen},
  Home: {screen: HomeScreen},
  Data : {screen: DataScreen},
});

export default createAppContainer(App);
