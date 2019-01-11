import moment from 'moment';
import { checkConnectivity, postToApi, logToApi } from './api_deprecated';
import { AsyncStorage } from 'react-native';
import registerStore from '../stores/registerStore';
import appStore from '../stores/appStore';

export const codeTypes = {
  SUCCESS: 0,
  ERROR: 1
};

export const severityTypes = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

export default async function userActionsLogger(
  severity,
  code,
  action = '',
  message = '',
  description = '',
  extraData = {}
) {
  try {
    const { momentDate, ...restLogData } = extraData;
    const date = momentDate || moment();
    const isConnectionActive = await checkConnectivity();

    console.log(
      `${date.format(
        'HH:mm:ss'
      )} ${severity} ${action} ${message} ${description}`
    );

    if (severity === severityTypes.DEBUG) {
      return;
    }

    const payload = {
      severity,
      code,
      action,
      message,
      description:
        code === 0 ? { result: description } : { error: description },
      performed_at: date.toDate(),
      ...restLogData
    };

    const rawuserActionsLogs = await AsyncStorage.getItem('userActionsLogs');
    const userActionsLogs = JSON.parse(
      rawuserActionsLogs ? rawuserActionsLogs : '[]'
    );
    userActionsLogs.push(payload);
    if (isConnectionActive) {
      for (const userActionsLog of userActionsLogs) {
        await logToApi('/user_experiences', userActionsLog);
      }
      AsyncStorage.setItem('userActionsLogs', '[]');
    } else {
      AsyncStorage.setItem('userActionsLogs', JSON.stringify(userActionsLogs));
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      appStore.initialise();
    } else {
      console.error('Export of UserExperiences failed', error);
      AsyncStorage.removeItem('userActionsLogs');
    }
  }
}
