import { Platform, Alert, Vibration, ToastAndroid } from 'react-native';
import prompt from 'react-native-prompt-android';
import Toast from 'react-native-simple-toast';
import i18n from 'i18next';
import TouchID from 'react-native-touch-id';
import PasscodeAuth from 'react-native-passcode-auth';

import { colors } from './theme';

const IS_IOS = Platform.OS === 'ios';

/*
 * Show cross platform toast alert with vibration
 * @param {string} errorMessage
 * @param {number} yOffset
 * @param {number} xOffset
*/
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

/*
 * Show awaiting native alert popup
 * @param {string} title
 * @param {string} message
*/
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

/*
 * Show awaiting confirmation popup
 * @param {string} title
 * @param {string} message
 * @param {Function} confirmAction
 * @param {Function} neutralAction
 * @param {Object} btnLabels
*/
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

/*
 * Show prompt popup
 * @param {string} title
 * @param {string} descr
 * @param {Function} action
 * @param {Function} cancelAction
 * @param {Object} options
*/
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

/*
 * Show biometric system confirmation
 * @param {Function} confirmAction
 * @param {Function} fallback
 * @return {boolean}
*/
export const biometricConfirm = IS_IOS ? biometricConfirmIOS : biometricConfirmAndroid;

async function biometricConfirmAndroid(confirmAction, fallback) {
  try {
    try {
      await TouchID.isSupported({ passcodeFallback: true });
    } catch (error) {
      /* if biometric is not supported next handling pass to fallback */
      if (typeof fallback === 'function') {
        fallback();
      }

      return false;
    }

    const config = {
      imageColor: colors.MAIN_LIGHT_COLOR,
      imageErrorColor: colors.ATTENTION_COLOR,
      title: i18n.t('global:confirmationTitle'),
      cancelText: i18n.t('global:confirmationCancel'),
      sensorDescription: i18n.t('global:biomerticConfirmTitle'),
      sensorErrorDescription: i18n.t('global:biomerticConfirmFailed')
    };
    const result = await TouchID.authenticate(null, config);

    if (result && typeof confirmAction === 'function') {
      confirmAction();
    }

    return result;
  } catch (error) {
    return false;
  }
}

async function biometricConfirmIOS(confirmAction, fallback) {
  try {
    try {
      await PasscodeAuth.isSupported();
    } catch (error) {
      /* if biometric is not supported next handling pass to fallback */
      if (typeof fallback === 'function') {
        fallback();
      }

      return false;
    }

    const result = await PasscodeAuth.authenticate();

    if (result && typeof confirmAction === 'function') {
      confirmAction();
    }

    return result;
  } catch (error) {
    return false;
  }
}
