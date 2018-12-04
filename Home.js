/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Alert, ListView, RefreshControl} from 'react-native';
import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';


const ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 != row2});

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      dataSource : null,
      isLoading: true,
      refreshing: false,
    };
  }

  apiGetData = () => {
    this.setState({isLoading : true})
    fetch('http://192.168.1.4:9000/partner/getall')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        refreshing : false,
        isLoading : false,
        dataSource: ds.cloneWithRows(responseJson),
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners(); 
    this.apiGetData();
  }
  
  //1
  async checkPermission() {
    firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
        this.getToken();
      } else {
        this.requestPermission();
      } 
    });
  }
  
    //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    this.setState({token : fcmToken})
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  
    //2
  async requestPermission() {
    firebase.messaging().requestPermission()
    .then(() => {
        this.getToken();
    })
    .catch(error => {
        // User has rejected permissions
        console.log('permission rejected');  
    });
  }

  ///////////////////// Add these methods //////////////////////
  
  //Remove listeners allocated in createNotificationListeners()
    componentWillUnmount() {
      this.notificationListener();
      this.notificationOpenedListener();
    }
    
    async createNotificationListeners() {
      /*
      * Triggered when a particular notification has been received in foreground
      * */
      this.notificationListener = firebase.notifications().onNotification((notification) => {
          const { title, body } = notification;
          // console.warn("1")
          // this.showAlert(title, body);
          this.apiGetData();
      });

      /*
      * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
      * */
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
          const { title, body } = notificationOpen.notification;
          this.apiGetData();
          // console.warn("2")
          // this.showAlert(title, body);
      });

      // /*
      // * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
      // * */
      const notificationOpen = await firebase.notifications().getInitialNotification();
      if (notificationOpen) {
          const { title, body } = notificationOpen.notification; // this.messageListener = firebase.messaging().onMessage((message) => {
        //process data message
        // console.warn("3")
          // this.showAlert(title, body);
          this.apiGetData();
      }
      /*
      * Triggered for data only payload in foreground
      * */
      this.messageListener = firebase.messaging().onMessage((message) => {
        //process data message
        let data = JSON.stringify(message.data.body)
        // console.warn(data)
        // console.log(JSON.stringify(message));
      });
    }

    showAlert(title, body) {
      Alert.alert(
        title, body,
        [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    }

    _onRefresh = () => {
      this.apiGetData();
    }

    _renderRow = (rowData) => {
        return (
          <View>
            <Text>{rowData.name}</Text>
            <Text>{rowData.jumlah}</Text>
          </View>
        );
    }

  render() {
    if(this.state.isLoading){
      return(
        <View style={{ flex: 1 }}>
          <Text>Loading</Text>
        </View>

      )
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to React Native! Home</Text>
          <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            value={this.state.token}
          />
        </View>
      );
    }
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
