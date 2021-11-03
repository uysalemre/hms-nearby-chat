import React, { Component } from 'react';
import { styles } from './Styles';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  BackHandler,
  ToastAndroid,
  NativeEventEmitter,
  Alert,
  Text
} from 'react-native';
import { HMSApplication, HMSDiscovery, HMSTransfer } from '@hmscore/react-native-hms-nearby';

export default class ChatScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messageRecords: [],
      dataReceived: false
    };
    this.transferBytes = this.transferBytes.bind(this);
  }

  componentDidMount() {
    console.log(this.props.chatEndpointId);
    this.eventEmitter = new NativeEventEmitter(HMSDiscovery);

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    this.eventEmitter.addListener(HMSDiscovery.CONNECT_ON_DISCONNECTED, (event) => {
      ToastAndroid.show("Connection lost. Disconnected from friend", ToastAndroid.SHORT);
      this.setState({ message: '', messageRecords: [] });
      this.showMainScreen();
    });

    this.eventEmitter.addListener(HMSDiscovery.DATA_ON_RECEIVED, (event) => {
      if (event.type == HMSTransfer.BYTES) {
        var messageObject = { sender: true, content: this.byteArrayToString(event.data) };
        this.setState({ messageRecords: [...this.state.messageRecords, messageObject], dataReceived: !this.state.dataReceived });
        this.refs.flatlist.scrollToEnd();
      }
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
    this.eventEmitter.removeAllListeners(HMSDiscovery.CONNECT_ON_DISCONNECTED);
    this.eventEmitter.removeAllListeners(HMSDiscovery.DATA_ON_RECEIVED);
  }

  async disconnectAll() {
    try {
      var result = await HMSDiscovery.disconnectAll();
      this.parseResult(result, null);
    }
    catch (err) {
      console.log(err);
    }
  }

  async transferBytes() {
    try {
      var result = await HMSTransfer.transferBytes(this.stringToByteArray(this.state.message.trim()), [this.props.chatEndpointId]);
      this.parseResult(result, null);
    }
    catch (err) {
      console.log(err);
    }
  }

  async transferFile() {
    try {
      var result = await HMSTransfer.transferFile(this.state.fileUri, [this.props.chatEndpointId]);
      this.parseResult(result, null);
    }
    catch (err) {
      console.log(err);
    }
  }

  showMainScreen() {
    this.props.changeIsInitialized();
  }

  backAction = () => {
    Alert.alert(
      "Disconnect",
      "Do you want to leave from chat ?",
      [
        {
          text: "No",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => { this.disconnectAll().then(() => { this.showMainScreen() }); }
        }
      ]);
    return true;
  };

  parseResult = (result, toastMessage) => {
    if (result.status == HMSApplication.SUCCESS) {
      if (toastMessage != null) {
        ToastAndroid.show(toastMessage, ToastAndroid.SHORT);
      }
      var messageObject = { sender: false, content: this.state.message };
      this.setState({ messageRecords: [...this.state.messageRecords, messageObject], message: '' });
    }
    else {
      ToastAndroid.show(result.message, ToastAndroid.SHORT);
    }
  }

  stringToByteArray(str) {
    var result = [];
    for (var i = 0; i < str.length; i++) {
      result.push(str.charCodeAt(i));
    }
    return result;
  }

  byteArrayToString(array) {
    return String.fromCharCode.apply(String, array);
  }

  renderMessage = ({ item }) => {
    return (
      <View style={item.sender ? styles.receivedMessageStyle : styles.sendedMessageStyle}>
        <Text style={item.sender ? styles.receivedMessageTextStyle : styles.sendedMessageTextStyle}>{item.content}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.baseViewStyle}>
        <FlatList
          inverted={false}
          style={styles.flatListStyle}
          ref="flatlist"
          data={this.state.messageRecords}
          renderItem={this.renderMessage}
          keyExtractor={(_, index) => index.toString()}
          extraData={this.state.dataReceived}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
        />
        <View style={styles.inputViewStyle}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Write a message ..."
            onChangeText={value => { this.setState({ message: value }) }}
            value={this.state.message}
          />
          <TouchableOpacity
            onPress={this.transferBytes}>
            <Image source={require('../images/sendmessage.png')} style={styles.senderIcons} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

