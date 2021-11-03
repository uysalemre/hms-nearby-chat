import React, { Component } from 'react';
import { styles } from './src/Styles';
import { View, PermissionsAndroid, ToastAndroid } from 'react-native';
import InitialScreen from './src/InitialScreen';
import ChatScreen from './src/ChatScreen';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isInitialized: false,
      chatEndpointId: ''
    };
    this.changeIsInitialized = this.changeIsInitialized.bind(this);
    this.setChatEndpointId = this.setChatEndpointId.bind(this);
  }

  componentDidMount() {
    this.requestPermissions();
  }

  async requestPermissions() {
    try {
      const userResponse = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]
      );
      if (
        userResponse["android.permission.ACCESS_FINE_LOCATION"] == PermissionsAndroid.RESULTS.DENIED ||
        userResponse["android.permission.ACCESS_FINE_LOCATION"] == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        userResponse["android.permission.READ_EXTERNAL_STORAGE"] == PermissionsAndroid.RESULTS.DENIED ||
        userResponse["android.permission.READ_EXTERNAL_STORAGE"] == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        userResponse["android.permission.WRITE_EXTERNAL_STORAGE"] == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        userResponse["android.permission.WRITE_EXTERNAL_STORAGE"] == PermissionsAndroid.RESULTS.DENIED
      ) {
        ToastAndroid.show("Please provide permissions to use this app", ToastAndroid.SHORT);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  changeIsInitialized() {
    this.setState({
      isInitialized: !this.state.isInitialized
    });
  }

  setChatEndpointId(endpointId) {
    this.setState({
      chatEndpointId: endpointId
    });
  }

  render() {
    return (
      <View style={styles.baseViewStyle}>
        {
          this.state.isInitialized
            ?
            <ChatScreen changeIsInitialized={this.changeIsInitialized} chatEndpointId={this.state.chatEndpointId} />
            :
            <InitialScreen changeIsInitialized={this.changeIsInitialized} setChatEndpointId={this.setChatEndpointId} />
        }
      </View>
    );
  }
}

