import { Platform, Alert, Vibration, ToastAndroid } from 'react-native';
import prompt from 'react-native-prompt-android';
import Toast from 'react-native-simple-toast';
import i18n from 'i18next';

const IS_IOS = Platform.OS === 'ios';

export function showToastError(errorMessage, yOffset = 0, xOffset = 0) {
  const message = typeof errorMessage === 'string' ? errorMessage : i18n.t('error:unknown');
  Vibration.vibrate();
  IS_IOS
    ? Toast.showWithGravity(
        message,
        Toast.LONG,
        Toast.TOP
      )
    : ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        xOffset,
        yOffset
      );
}

export async function showAlertInfo(title = '', message = '') {
  return new Promise(resolve => {
    Alert.alert(
      title,
      message,
      [
        { text: i18n.t('common:okBtn'), onPress: resolve }
      ],
    );
  });
}

export async function confirm(
  title = '',
  message = '',
  confirmAction,
  neutralAction,
  /* 'cancel', 'confirm', 'neutral' */
  btnLabels = {}
) {
  return new Promise(resolve => {
    const actions = [{
      text: btnLabels.cancel || i18n.t('common:cancelBtn'),
      style: IS_IOS ? 'cancel' : 'negative',
      onPress: resolve
    }];

    if (typeof confirmAction === 'function') {
      actions.unshift({
        text: btnLabels.confirm || i18n.t('common:okBtn'),
        style: IS_IOS ? 'default' : 'positive',
        onPress: () => {
          confirmAction();
          resolve();
        }
      });
    }

    if (typeof neutralAction === 'function') {
      actions.unshift({
        text: btnLabels.neutral || i18n.t('common:postponeBtn'),
        style: IS_IOS ? 'default' : 'neutral',
        onPress: () => {
          neutralAction();
          resolve();
        }
      });
    }

    Alert.alert(title, message, actions, { cancelable: true, onDismiss: resolve });
  });
}

export function showPrompt(title = '', descr = '', action, cancelAction, options = {}) {
  const cancelFn = typeof cancelAction === 'function' ? cancelAction : () => null;
  const actions = [
    { text: i18n.t('common:cancelBtn'), onPress: cancelFn, style: 'cancel' }
  ];

  if (typeof action === 'function') {
    const agreeAction = { text: i18n.t('common:okBtn'), onPress: action };
    actions.push(agreeAction);
  }

  if (Array.isArray(action)) {
    action.forEach(a => actions.push(a));
  }

  prompt(title, descr, actions, options);
}
