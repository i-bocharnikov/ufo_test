import firebase from 'react-native-firebase';
import { putToApi } from './api';
import remoteLoggerService from './remoteLoggerService';
import { checkConnectivity } from './api_deprecated';
import { appStore, driveStore } from '../stores';

const FCM = firebase.messaging();
const FCN = firebase.notifications();

class PushNotificationService {
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
    FCM.onMessage(async message => {
      remoteLoggerService.info(
        'pushNotificationService.onMessage',
        'Message received',
        {
          title: message.title,
          body: message.body,
          badge: this.iosNotifBadge,
          data: message.data
        }
      );

      if (message && message.data && message.data.refreshApp === 'true') {
        remoteLoggerService.info(
          'pushNotificationService.onMessage',
          'refresh app',
          {
            title: message.title,
            body: notimessagefication.body,
            badge: this.iosNotifBadge,
            data: message.data
          }
        );
        if (await checkConnectivity()) {
          await appStore.register();
          await remoteLoggerService.initialise();
        }
        await driveStore.reset();
      }

      if (message && message.data && message.data.resetBadge === 'true') {
        this.iosNotifBadge = 0;
      } else {
        this.iosNotifBadge++;
      }
    });

    FCN.onNotification(async notification => {
      remoteLoggerService.info(
        'pushNotificationService.onNotification',
        'Notification received',
        {
          title: notification.title,
          body: notification.body,
          badge: this.iosNotifBadge,
          data: notification.data
        }
      );

      if (
        notification &&
        notification.data &&
        notification.data.refreshApp === 'true'
      ) {
        remoteLoggerService.info(
          'pushNotificationService.onNotification',
          'refresh app',
          {
            title: notification.title,
            body: notification.body,
            badge: this.iosNotifBadge,
            data: notification.data
          }
        );
        if (await checkConnectivity()) {
          await appStore.register();
          await remoteLoggerService.initialise();
        }
        await driveStore.reset();
      }

      if (
        notification &&
        notification.data &&
        notification.data.resetBadge === 'true'
      ) {
        this.iosNotifBadge = 0;
      } else {
        this.iosNotifBadge++;
      }

      if (notification && notification.title && notification.body) {
        const visualNotification = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setBody(notification.body)
          .setData(notification.data)
          .ios.setBadge(this.iosNotifBadge)
          .android.setChannelId(this.androidDefaultChannelId)
          .android.setDefaults(firebase.notifications.Android.Defaults.All);

        remoteLoggerService.info(
          'pushNotificationService.onNotification',
          'show notification',
          {
            title: notification.title,
            body: notification.body,
            badge: this.iosNotifBadge,
            data: notification.data
          }
        );
        FCN.displayNotification(visualNotification);
      }
    });

    FCN.onNotificationDisplayed(async notification => {
      remoteLoggerService.info(
        'pushNotificationService.onNotificationDisplayed',
        'Notification received',
        {
          title: notification.title,
          body: notification.body,
          badge: this.iosNotifBadge,
          data: notification.data
        }
      );
    });

    FCN.onNotificationOpened(async notificationOpen => {
      const action = notificationOpen.action;
      const notification = notificationOpen.notification;
      remoteLoggerService.info(
        'pushNotificationService.onNotificationOpened',
        'Notification ' + action + ' received',
        {
          title: notification.title,
          body: notification.body,
          badge: this.iosNotifBadge,
          data: notification.data
        }
      );
      this.iosNotifBadge--;
    });

    FCN.getInitialNotification().then(async notificationOpen => {
      if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        await remoteLoggerService.info(
          'pushNotificationService.getInitialNotification',
          'Notification ' + action + ' received',
          {
            title: notification.title,
            body: notification.body,
            badge: this.iosNotifBadge,
            data: notification.data
          }
        );
        this.iosNotifBadge = 0;
      }
    });

    remoteLoggerService.info(
      'pushNotificationService.onNotificationListener',
      'Notifications registration done'
    );
  };
}

const pushNotificationService = new PushNotificationService();

export default pushNotificationService;
