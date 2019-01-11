import moment from 'moment';
import { checkConnectivity, postToApi } from './api_deprecated';
import { AsyncStorage } from 'react-native';
import registerStore from '../stores/registerStore';

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
        await postToApi('/user_experiences', userActionsLog, true, false);
      }
      AsyncStorage.setItem('userActionsLogs', '[]');
    } else {
      AsyncStorage.setItem('userActionsLogs', JSON.stringify(userActionsLogs));
    }
  } catch (error) {
    console.error('Export of UserExperiences failed', error);
    registerStore.AsyncStorage.removeItem('userActionsLogs');
  }
}
