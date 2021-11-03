import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const shadow = {
    shadowColor: "black",
    shadowOffset: {
        width: 0,
        height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
};

const messageStyle = {
    borderRadius: 10,
    width: 170,
    color: 'white',
    padding: 10,
    overflow: 'hidden'
};

export const styles = StyleSheet.create({
    baseViewStyle: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#DEDEDE'
    },
    flatListStyle: {
        width: '95%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 10,
        color: '#008AB3',
        ...shadow
    },
    inputViewStyle: {
        height: 50,
        width: '95%',
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    inputStyle: {
        height: '100%',
        width: '87%',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingLeft: 10,
        color: '#005873',
        ...shadow
    },
    senderIcons: {
        height: 35,
        width: 35,
        marginLeft: 5,
        marginTop: 10,
        alignSelf: 'center'
    },
    actionSelectionStyle: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: windowHeight / 5,
        marginBottom: windowHeight / 5,
        marginLeft: windowWidth / 16,
        marginRight: windowWidth / 16,
        ...shadow
    },
    actionButtonStyle: {
        alignSelf: 'center',
        backgroundColor: "#008AB3",
        padding: 10,
        marginTop: 10,
        borderRadius: 15,
        ...shadow
    },
    textStyle: {
        color: 'white'
    },
    textStyleHeader: {
        color: '#008AB3',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'center',
    },
    textStyleInfo: {
        color: '#008AB3',
        fontSize: 14,
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    backgroundImageStyle: {
        flex: 1,
        flexDirection: 'column',
        resizeMode: "cover",
        justifyContent: "space-between",
        margin: 5
    },
    buttonHolderStyle: {
        flex: 1,
        flexDirection: 'column-reverse'
    },
    sendedMessageStyle: {
        alignSelf: 'flex-end',
        margin: 5,
        ...shadow
    },
    sendedMessageTextStyle: {
        ...messageStyle,
        backgroundColor: '#008AB3'
    },
    receivedMessageStyle: {
        alignSelf: 'flex-start',
        margin: 5
    },
    receivedMessageTextStyle: {
        ...messageStyle,
        backgroundColor: '#02A400'
    }
});