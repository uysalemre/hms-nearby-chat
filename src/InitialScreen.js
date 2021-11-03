import React, { Component } from 'react';
import { styles } from './Styles';
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  NativeEventEmitter,
  ToastAndroid,
  ActivityIndicator,
  Alert
} from 'react-native';
import { HMSApplication, HMSDiscovery } from '@hmscore/react-native-hms-nearby';

export default class InitialScreen extends Component {

  broadcasterName = "broadcaster";
  scanner = "scanner";
  serviceId = "nearbychatapplicationexample";

  constructor(props) {
    super(props);
    this.state = {
      isBroadCasting: false,
      isScanning: false,
      endpointId: ''
    };
    this.startBroadCasting = this.startBroadCasting.bind(this);
    this.startScanning = this.startScanning.bind(this);
  }

  componentDidMount() {
    this.eventEmitter = new NativeEventEmitter(HMSDiscovery);

    this.eventEmitter.addListener(HMSDiscovery.CONNECT_ON_ESTABLISH, (event) => {
      this.setState({ endpointId: event.endpointId });
      if (this.state.isBroadCasting) {
        Alert.alert(
          "Confirmation",
          "Please confirm auth code\n" + event.authCode + "\nDo you want to chat with him/her ?",
          [
            {
              text: "No",
              onPress: () => this.rejectConnect(),
              style: 'cancel'
            },
            {
              text: "Yes",
              onPress: () => this.acceptConnect()
            }
          ],
          { cancelable: false }
        );
      }
      else {
        Alert.alert(
          "Confirmation",
          "Please confirm auth code\n" + event.authCode,
          [
            {
              text: "OK",
              onPress: () => this.acceptConnect()
            }
          ],
          { cancelable: false }
        );
      }
    });

    this.eventEmitter.addListener(HMSDiscovery.CONNECT_ON_RESULT, (event) => {
      if (event.statusCode == HMSApplication.SUCCESS) {
        ToastAndroid.show("Connection Successful, Lets Chat", ToastAndroid.SHORT);
        this.cancelOperation(false);
        this.setChatEndpointId(event.endpointId);
        this.switchToChatScreen();
      }
      else if (event.statusCode == 8010) {
        ToastAndroid.show("Connection rejected by your friend", ToastAndroid.SHORT);
        this.cancelOperation(true);

      }
      else {
        ToastAndroid.show("Connection failed ", ToastAndroid.SHORT);
        this.cancelOperation(true);
      }
    });

    this.eventEmitter.addListener(HMSDiscovery.SCAN_ON_FOUND, (event) => {
      Alert.alert(
        "Scan Result",
        "A friend found. Do you want to send connection request ?",
        [
          {
            text: "No",
            onPress: () => { this.cancelOperation(true); }
          },
          {
            text: "Yes",
            onPress: () => { this.setState({ endpointId: event.endpointId }); this.requestConnect(); }
          }
        ],
        { cancelable: false }
      );
    });

    this.eventEmitter.addListener(HMSDiscovery.SCAN_ON_LOST, (event) => {
      ToastAndroid.show("Friend Lost", ToastAndroid.SHORT);
      this.cancelOperation(true);
    });
  }

  componentWillUnmount() {
    this.eventEmitter.removeAllListeners(HMSDiscovery.CONNECT_ON_ESTABLISH);
    this.eventEmitter.removeAllListeners(HMSDiscovery.CONNECT_ON_RESULT);
    this.eventEmitter.removeAllListeners(HMSDiscovery.SCAN_ON_FOUND);
    this.eventEmitter.removeAllListeners(HMSDiscovery.SCAN_ON_LOST);
    this.setState({
      isBroadCasting: false,
      isScanning: false,
      endpointId: ''
    });
  }

  switchToChatScreen = () => {
    this.props.changeIsInitialized();
  }

  setChatEndpointId = (endpointId) => {
    this.props.setChatEndpointId(endpointId);
  }

  async acceptConnect() {
    try {
      var result = await HMSDiscovery.acceptConnect(this.state.endpointId);
      this.parseResult(result, null);
    }
    catch (err) {
      console.log(err);
    }
  }

  async requestConnect() {
    try {
      var result = await HMSDiscovery.requestConnect(this.scanner, this.state.endpointId);
      this.parseResult(result, null);
    }
    catch (err) {
      console.log(err);
    }
  }

  async rejectConnect() {
    try {
      var result = await HMSDiscovery.rejectConnect(this.state.endpointId);
      this.parseResult(result, null);
    }
    catch (err) {
      console.log(err);
    }
  }

  async startBroadCasting() {
    try {
      var result = await HMSDiscovery.startBroadcasting(this.broadcasterName, this.serviceId, HMSDiscovery.P2P);
      this.parseResult(result, 1);
    }
    catch (err) {
      console.log(err);
    }
  }

  async stopBroadCasting(isForceStop) {
    try {
      var result = await HMSDiscovery.stopBroadCasting();
      isForceStop ? this.parseResult(result, 3) : null;
    }
    catch (err) {
      console.log(err);
    }
  }

  async startScanning() {
    try {
      var result = await HMSDiscovery.startScan(this.serviceId, HMSDiscovery.P2P);
      this.parseResult(result, 2);
    }
    catch (err) {
      console.log(err);
    }
  }

  async stopScanning(isForceStop) {
    try {
      var result = await HMSDiscovery.stopScan();
      isForceStop ? this.parseResult(result, 4) : null;
    }
    catch (err) {
      console.log(err);
    }
  }

  parseResult = (result, functionTag) => {
    if (result.status == HMSApplication.SUCCESS) {
      if (functionTag == 1) {
        this.setState({ isBroadCasting: true });
      }
      else if (functionTag == 2) {
        this.setState({ isScanning: true });
      }
      else if (functionTag == 3) {
        this.setState({ isBroadCasting: false });
      }
      else if (functionTag == 4) {
        this.setState({ isScanning: false });
      }
    }
    else {
      if (result.message.substring(0, 4) == "8002") {
        ToastAndroid.show("No network ! Check your internet connection", ToastAndroid.SHORT);
      }
      else if (result.message.substring(0, 4) == "8005") {
        this.stopBroadCasting(false);
        ToastAndroid.show("Try again to start broadcasting", ToastAndroid.SHORT);
      }
      else if (result.message.substring(0, 4) == "8007") {
        this.stopScanning(false);
        ToastAndroid.show("Try again to start scanning", ToastAndroid.SHORT);
      }
      else if (result.message.substring(0, 4) == "8009") {
        ToastAndroid.show("Bluetooth operation failed. Try again", ToastAndroid.SHORT);
      }
      else if (result.message.substring(0, 4) == "8014") {
        ToastAndroid.show("Enable location permission !", ToastAndroid.SHORT);
      }
      else if (result.message.substring(0, 4) == "8015") {
        ToastAndroid.show("Enable wifi permission !", ToastAndroid.SHORT);
      }
      else if (result.message.substring(0, 4) == "8016") {
        ToastAndroid.show("Enable bluetooth permission !", ToastAndroid.SHORT);
      }
      else if (result.message.substring(0, 4) == "8020") {
        ToastAndroid.show("Enable device location !", ToastAndroid.SHORT);
      }
      else if (result.message.substring(0, 4) == "8021") {
        ToastAndroid.show("Switch airplane mode to ON !", ToastAndroid.SHORT);
      }
      else {
        console.log(result.message);
      }
    }
  }

  cancelOperation = (isForceStop) => {
    if (this.state.isBroadCasting) {
      this.stopBroadCasting(isForceStop);
    }
    else if (this.state.isScanning) {
      this.stopScanning(isForceStop);
    }
    else {
      console.log("An inconsistency happened");
    }
  }

  render() {
    return (
      <View style={styles.baseViewStyle}>
        <View style={styles.actionSelectionStyle}>
          <ImageBackground
            source={require('../images/connection.png')}
            style={styles.backgroundImageStyle}>
            <Text style={styles.textStyleHeader}> NEARBY CHAT </Text>
            {
              this.state.isBroadCasting || this.state.isScanning
                ?
                <View style={styles.buttonHolderStyle}>
                  <TouchableOpacity
                    style={styles.actionButtonStyle}
                    onPress={() => { this.cancelOperation(true); }}>
                    <Text style={styles.textStyle}> CANCEL </Text>
                  </TouchableOpacity>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View>
                :
                <View style={styles.buttonHolderStyle}>
                  <TouchableOpacity
                    style={styles.actionButtonStyle}
                    onPress={this.startBroadCasting}>
                    <Text style={styles.textStyle}> START BROADCASTING </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButtonStyle}
                    onPress={this.startScanning}>
                    <Text style={styles.textStyle}> START SCANNING </Text>
                  </TouchableOpacity>
                </View>
            }
            <Text style={styles.textStyleInfo}>Choose one of the options and make sure your friend choosed the other.</Text>
          </ImageBackground>
        </View>
      </View >
    );
  }
}