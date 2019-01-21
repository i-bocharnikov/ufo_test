import { PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';

import { putToApi } from './api';
import { showToastError } from './interaction';

const SENDER_ID = '460958527990';
let isRegistered = false;

async function _onRegister(token) {
  if (!isRegistered) {
    const response = await putToApi('/register/devices/notification', { token });

    if (response.isSuccess) {
      isRegistered = true;
    }
  }
}

function _onNotification(notification) {
  /* add more comfortable handler */
  console.log(notification);
  showToastError(notification.message || notification.body || 'message', 120);
  /* add more comfortable handler */
  notification.finish(PushNotificationIOS.FetchResult.NoData);
}

function configure() {
  PushNotification.configure({
    onRegister: _onRegister,
    onNotification: _onNotification,
    senderID: SENDER_ID,
    permissions: {
      alert: true,
      badge: true,
      sound: true
    }
  });
}

export default { configure };
