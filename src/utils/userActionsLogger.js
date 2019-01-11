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

const rawuserActionsLogs = await AsyncStorage.getItem('userActionsLogs');
const lock = false;
const userActionsLogs = JSON.parse(
  rawuserActionsLogs ? rawuserActionsLogs : '[]'
);

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

    if (isConnectionActive) {
      await logToApi('/user_experiences', payload);
      if (!lock) {
        lock = true;
        for (const userActionsLog of userActionsLogs) {
          await logToApi('/user_experiences', userActionsLog);
        }
        AsyncStorage.setItem('userActionsLogs', '[]');
        lock = false;
      }
    } else {
      userActionsLogs.push(payload);
      if (!lock) {
        lock = true;
        AsyncStorage.setItem(
          'userActionsLogs',
          JSON.stringify(userActionsLogs)
        );
        lock = false;
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      //wait next registration
      userActionsLogs.push(payload);
      if (!lock) {
        lock = true;
        AsyncStorage.setItem(
          'userActionsLogs',
          JSON.stringify(userActionsLogs)
        );
        lock = false;
      }
    } else {
      lock = false;
      console.error('Export of UserExperiences failed', error);
    }
  }
}
