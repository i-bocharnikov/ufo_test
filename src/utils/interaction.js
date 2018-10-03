
import { Alert, Vibration, ToastAndroid } from 'react-native';

export async function confirm(title, message, action) {
    await Alert.alert(
        title,
        message,
        [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            { text: 'OK', onPress: () => { action() } },
        ],
        { cancelable: true }
    )
}

export async function showToastError(key, message) {
    //await Vibration.vibrate()
    //TODO TRANSLATION with key
    await ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.TOP)
}

export function showInfo(message) {
    Toast.show({
        text: message,
        buttonText: 'Ok',
        type: "info",
        duration: 5000,
        position: "top",

        buttonTextStyle: { color: "#008000" },
        buttonStyle: { backgroundColor: "#5cb85c" }
    });
}

export function showWarning(message) {
    Toast.show({
        text: message,
        buttonText: 'Ok',
        type: "warning",
        duration: 5000,
        position: "top",

        buttonTextStyle: { color: "#008000" },
        buttonStyle: { backgroundColor: "#5cb85c" }
    });
}

export function showActivitiesState(message) {
    Toast.show({
        text: message,
        position: 'top',
        type: "warning",
        duration: 15000,
    });
}