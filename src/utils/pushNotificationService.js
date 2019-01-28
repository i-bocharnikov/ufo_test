import firebase from 'react-native-firebase';
import { putToApi } from './api';
import remoteLoggerService from './remoteLoggerService';
import { checkConnectivity } from './api_deprecated';
import appStore from '../stores/appStore';
import { driveStore } from '../stores';

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
        remoteLoggerService.error(
          'registerNotification',
          'notification permission has been declined'
        );
        return false;
      }
    }

    this.fcmToken = await FCM.getToken();

    if (!this.fcmToken) {
      remoteLoggerService.error('registerNotification', 'FCM token missing');
      return false;
    }

    const response = await putToApi('/register/devices/notification', {
      token: this.fcmToken
    });

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

  _onTokenRefreshListener = () =>
    FCM.onTokenRefresh(async fcmToken => {
      remoteLoggerService.info(
        'pushNotificationService.onTokenRefresh',
        'FCM token refreshed'
      );

      this.fcmToken = fcmToken;
      const response = await putToApi('/register/devices/notification', {
        token: fcmToken
      });

      if (!response.isSuccess) {
        this.enabled = false;
      }
    });

  _onNotificationListener = () => {
    FCM.onMessage(async data => {
      remoteLoggerService.info(
        'pushNotificationService.onMessage',
        'Message received',
        {
          title: data.title,
          body: data.body,
          badge: this.iosNotifBadge,
          data: data.data
        }
      );

      if (data && data.data && data.data.refreshApp === true) {
        remoteLoggerService.info(
          'pushNotificationService.onMessage',
          'refresh app',
          {
            title: data.title,
            body: data.body,
            badge: this.iosNotifBadge,
            data: data.data
          }
        );
        if (await checkConnectivity()) {
          await appStore.register();
          await remoteLoggerService.initialise();
        }
        await driveStore.reset();
      }
    });

    FCN.onNotification(async data => {
      remoteLoggerService.info(
        'pushNotificationService.onNotification',
        'Notification received',
        {
          title: data.title,
          body: data.body,
          badge: this.iosNotifBadge,
          data: data.data
        }
      );

      if (data && data.data && data.data.refreshApp === 'true') {
        remoteLoggerService.info(
          'pushNotificationService.onNotification',
          'refresh app',
          {
            title: data.title,
            body: data.body,
            badge: this.iosNotifBadge,
            data: data.data
          }
        );
        if (await checkConnectivity()) {
          await appStore.register();
          await remoteLoggerService.initialise();
        }
        await driveStore.reset();
      }

      if (data && data.data && data.data.resetBadge === 'true') {
        this.iosNotifBadge = 0;
      } else {
        this.iosNotifBadge++;
      }

      if (data && data.title && data.body) {
        const notification = new firebase.notifications.Notification()
          .setNotificationId(data.notificationId)
          .setTitle(data.title)
          .setBody(data.body)
          .setData(data.data)
          .ios.setBadge(this.iosNotifBadge)
          .android.setChannelId(this.androidDefaultChannelId)
          .android.setDefaults(firebase.notifications.Android.Defaults.All);

        remoteLoggerService.info(
          'pushNotificationService.onNotification',
          'show notification',
          {
            title: data.title,
            body: data.body,
            badge: this.iosNotifBadge,
            data: data.data
          }
        );
        FCN.displayNotification(notification);
      }
    });

    FCN.onNotificationDisplayed(async data => {
      remoteLoggerService.info(
        'pushNotificationService.onNotificationDisplayed',
        'Notification received',
        {
          title: data.title,
          body: data.body,
          badge: this.iosNotifBadge,
          data: data.data
        }
      );
    });

    FCN.onNotificationOpened(async data => {
      remoteLoggerService.info(
        'pushNotificationService.onNotificationOpened',
        'Notification received',
        {
          title: data.title,
          body: data.body,
          badge: this.iosNotifBadge,
          data: data.data
        }
      );
      this.iosNotifBadge--;
    });

    remoteLoggerService.info(
      'pushNotificationService.onNotificationListener',
      'Notifications registration done'
    );
  };
}

const notificationService = new NotificationService();

export default notificationService;
