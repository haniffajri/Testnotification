/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View , TextInput, Button} from 'react-native';

import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      confirmResult: null,

      phoneNumber : '+6285767745500',
      partner_id: 2,
      pasiennomor: "12",
      namapasien: "nmaa",
      tanggallahir: "2013-01-01",
      isLoading: false,
      token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsInBob25lIjoiNTUiLCJwYXNzd29yZCI6ImNkMGFjZmUwODVlZWIwZjg3NDM5MWZiOWI4MDA5YmVkIn0.tuPl1RlsSwdTnNvRn2x9ElwbFaKPWp0sGd3RtK6AoLA",
      tokenfcm : "cnJ0h61CLWA:APA91bGf9z7fnvqkVoI1NmEra917c7Go8tRV1ueS4yS_Fe4wzHL3rPzuJ9yqjRa5p_-zHBhVjA4n3oN67ZhBopqBwDeaabF8DxItsPvu5gyGk6c8BwfbWSqS5yLyOuW7hr5Moib2z9TZ",
      auth :"AAAAwnbZe4I:APA91bFBsoG3M_-ahvoDhvWEkN_b0Tm3E9qn-DCwipdO90bwGUUCOSTgyOZCvTsmtCSQpVcI3LCqIh4DnuOCHdZMwImvH4_n-gYExKTeVMjkJa_5s3CfPGbrDwnxDwqzgbZiTbr8gwv9",
    };
  }


  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+62',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
 }

 signIn = () => {
   const { phoneNumber } = this.state;
   this.setState({ message: 'Sending code ...' });

   firebase.auth().signInWithPhoneNumber(phoneNumber)
     .then(confirmResult => {this.setState({ confirmResult, message: 'Code has been sent!' })
      console.warn(confirmResult)    
    })
     .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
 };

 confirmCode = () => {
   const { codeInput, confirmResult } = this.state;

   if (confirmResult && codeInput.length) {
     confirmResult.confirm(codeInput)
       .then((user) => {
         this.setState({ message: 'Code Confirmed!' });
       })
       .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
   }
 };

 signOut = () => {
   firebase.auth().signOut();
 }

 renderPhoneNumberInput() {
  const { phoneNumber } = this.state;

   return (
     <View style={{ padding: 25 }}>
       <Text>Enter phone number:</Text>
       <TextInput
         autoFocus
         style={{ height: 40, marginTop: 15, marginBottom: 15 }}
         onChangeText={value => this.setState({ phoneNumber: value })}
         placeholder={'Phone number ... '}
         value={phoneNumber}
       />
       <Button title="Sign In" color="green" onPress={this.signIn} />
     </View>
   );
 }

 renderMessage() {
   const { message } = this.state;

   if (!message.length) return null;

   return (
     <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
   );
 }

 renderVerificationCodeInput() {
   const { codeInput } = this.state;

   return (
     <View style={{ marginTop: 25, padding: 25 }}>
       <Text>Enter verification code below:</Text>
       <TextInput
         autoFocus
         style={{ height: 40, marginTop: 15, marginBottom: 15 }}
         onChangeText={value => this.setState({ codeInput: value })}
         placeholder={'Code ... '}
         value={codeInput}
       />
       <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
     </View>
   );
 }

  sendMassage = () => {
    this.setState({isLoading : true})
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Authorization' : 'key='+this.state.auth,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "to" : "cnJ0h61CLWA:APA91bGf9z7fnvqkVoI1NmEra917c7Go8tRV1ueS4yS_Fe4wzHL3rPzuJ9yqjRa5p_-zHBhVjA4n3oN67ZhBopqBwDeaabF8DxItsPvu5gyGk6c8BwfbWSqS5yLyOuW7hr5Moib2z9TZ",
        "notification" : {
            "body" : "Body of Your Notification",
            "title": "Title of Your Notification",
            "sound" : "default"
        }
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ isLoading: false })
      })
      .catch((error) => {
        console.error(error);
    });
  }

  submit = () => {
    this.setState({isLoading : true})
    fetch('http://192.168.1.4:9000/user/setantrian', {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'jw_token': this.state.token
      }),
      body: JSON.stringify({
        'partner_id': this.state.partner_id,
        'no_patient': this.state.pasiennomor,
        'name_patient': this.state.namapasien,
        'tanggal_lahir': this.state.tanggallahir,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // this.setState({ isLoading: false })
        this.sendMassage();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  signIn3 = () => {
  firebase.auth()
  .verifyPhoneNumber(this.state.phoneNumber)
  .on('state_changed', (phoneAuthSnapshot) => {
    console.warn(firebase.auth.PhoneAuthState)
    // How you handle these state events is entirely up to your ui flow and whether
    // you need to support both ios and android. In short: not all of them need to
    // be handled - it's entirely up to you, your ui and supported platforms.

    // E.g you could handle android specific events only here, and let the rest fall back
    // to the optionalErrorCb or optionalCompleteCb functions
    switch (phoneAuthSnapshot.state) {
      // ------------------------
      //  IOS AND ANDROID EVENTS
      // ------------------------
      case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
        console.warn('code sent');
        // on ios this is the final phone auth state event you'd receive
        // so you'd then ask for user input of the code and build a credential from it
        // as demonstrated in the `signInWithPhoneNumber` example above
        break;
      case firebase.auth.PhoneAuthState.ERROR: // or 'error'
        console.warn('verification error');
        console.warn(phoneAuthSnapshot.error);
        break;

      // ---------------------
      // ANDROID ONLY EVENTS
      // ---------------------
      case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
        console.warn('auto verify on android timed out');
        // proceed with your manual code input flow, same as you would do in
        // CODE_SENT if you were on IOS
        break;
      case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
        // auto verified means the code has also been automatically confirmed as correct/received
        // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
        console.warn('auto verified on android');
        console.warn(phoneAuthSnapshot);
        // Example usage if handling here and not in optionalCompleteCb:
        // const { verificationId, code } = phoneAuthSnapshot;
        // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

        // Do something with your new credential, e.g.:
        // firebase.auth().signInWithCredential(credential);
        // firebase.auth().currentUser.linkWithCredential(credential);
        // etc ...
        break;
    }
  }, (error) => {
    // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
    // the ERROR case in the above observer then there's no need to handle it here
    console.warn(error);
    // verificationId is attached to error if required
    console.warn(error.verificationId);
  }, (phoneAuthSnapshot) => {
    // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
    // depending on the platform. If you've already handled those cases in the observer then
    // there's absolutely no need to handle it here.

    // Platform specific logic:
    // - if this is on IOS then phoneAuthSnapshot.code will always be null
    // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
    //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
    // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
    //   continue with user input logic.
    console.warn(phoneAuthSnapshot);
  });
// optionally also supports .then & .catch instead of optionalErrorCb &
// optionalCompleteCb (with the same resulting args)
  };

  render() {

    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <Text>Loading</Text>
        </View>
      )
    } else {
      // return (
      //   <View style={styles.container}>
      //     <Text style={styles.welcome}>Welcome to React Native!</Text>
      //     <Button
      //       onPress={() => this.submit()}
      //       title="submit"
      //       color="#841584"
      //     />
      //       <Button
      //       onPress={() => this.signIn()}
      //       title="sign in"
      //       color="#841584"
      //     />
      //   </View>
      // );

      const { user, confirmResult } = this.state;
    return (
      <View style={{ flex: 1 }}>

        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {user && (
          <View
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#77dd77',
              flex: 1,
            }}
          >
            <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
            <Text style={{ fontSize: 25 }}>Signed In!</Text>
            <Text>{JSON.stringify(user)}</Text>
            <Button title="Sign Out" color="red" onPress={this.signOut} />
          </View>
        )}
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
