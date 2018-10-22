import { Alert, Vibration, ToastAndroid } from 'react-native';
import prompt from 'react-native-prompt-android';
import i18n from 'i18next';

export async function confirm(title = '', message='', action) {
  await Alert.alert(
    title,
    message,
    [
      {text: i18n.t('common:cancelBtn'), onPress: () => null, style: 'cancel'},
      {text: i18n.t('common:okBtn'), onPress: () => action()},
    ],
    {cancelable: true}
  );
}

export async function showToastError(key, message = '') {
  await Vibration.vibrate();
  // TODO TRANSLATION with key
  await ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.TOP);
}

export function toastError(message = '', yOffset = 0, xOffset = 0) {
  Vibration.vibrate();
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.TOP,
    xOffset,
    yOffset
  );
}

export function showPrompt(title = '', descr = '', action, options = {}) {
  const actions = [
    {text: i18n.t('common:cancelBtn'), onPress: () => null, style: 'cancel'}
  ];

  if (typeof action === 'function') {
    const agreeAction = {text: i18n.t('common:okBtn'), onPress: action};
    actions.push(agreeAction);
  }

  if (Array.isArray(action)) {
    action.forEach(a => actions.push(a));
  }

  prompt(title, descr, actions, options);
}

/* not usable functions from past */
export function showInfo(message = '') {
  Toast.show({
    text: message,
    buttonText: 'Ok',
    type: 'info',
    duration: 5000,
    position: 'top',
    buttonTextStyle: {color: '#008000'},
    buttonStyle: {backgroundColor: '#5cb85c'}
  });
}

export function showWarning(message = '') {
  Toast.show({
    text: message,
    buttonText: 'Ok',
    type: 'warning',
    duration: 5000,
    position: 'top',
    buttonTextStyle: {color: '#008000'},
    buttonStyle: {backgroundColor: '#5cb85c'}
  });
}

export function showActivitiesState(message = '') {
  Toast.show({
    text: message,
    position: 'top',
    type: 'warning',
    duration: 15000
  });
}
