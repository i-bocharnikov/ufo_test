import firebase from 'react-native-firebase';
import { putToApi } from './api';

const FCM = firebase.messaging();
const FCN = firebase.notifications();

class NotificationService {
  constructor() {
    this.enabled = false;
    this.fcmToken = null;
    this.tokenListener = null;
    this.notificationListener = null;
    this.iosNotifBadge = 0;
    this.androidDefaultChannelId = 'UFONotifMain';
  }

  async register() {
    this.enabled = await FCM.hasPermission();

    if (!this.enabled) {
      await FCM.requestPermission();
      this.enabled = await FCM.hasPermission();

      if (!this.enabled) {
        return false;
      }
    }

    this.fcmToken = await FCM.getToken();

    if (!this.fcmToken) {
      return false;
    }

    const response = await putToApi('/register/devices/notification', { token: this.fcmToken });

    if (!response.isSuccess) {
      this.enabled = false;
      return false;
    }

    return true;
  }

  addListeners() {
    this.tokenListener = this._onTokenRefreshListener();
    this.notificationListener = this._onNotificationListener();
  }

  removeListeners() {
    this.tokenListener();
    this.notificationListener();
  }

  _onTokenRefreshListener = () => FCM.onTokenRefresh(async fcmToken => {
    this.fcmToken = fcmToken;
    const response = await putToApi('/register/devices/notification', { token: fcmToken });

    if (!response.isSuccess) {
      this.enabled = false;
    }
  });

  _onNotificationListener = () => FCN.onNotification(data => {
    this.iosNotifBadge++;
    const notification = new firebase.notifications.Notification()
      .setNotificationId(data.notificationId)
      .setTitle(data.title)
      .setBody(data.body)
      .setData(data.data)
      .ios.setBadge(this.iosNotifBadge)
      .android.setChannelId(this.androidDefaultChannelId)
      .android.setDefaults(firebase.notifications.Android.Defaults.All);

    FCN.displayNotification(notification);
  });
}

const notificationService = new NotificationService();

export default notificationService;
