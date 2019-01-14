import moment from 'moment';
import { checkConnectivity, logToApi } from './api_deprecated';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';
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
  let userActionsLogs = [];
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
    AsyncStorage.removeItem('userActionsLogs');
    if (rawuserActionsLogs) {
      userActionsLogs = JSON.parse(rawuserActionsLogs);
    }
    userActionsLogs.push(payload);
    if (isConnectionActive) {
      while (userActionsLogs.length > 0) {
        await logToApi('/user_experiences', userActionsLogs.pop());
      }
    } else {
      AsyncStorage.setItem('userActionsLogs', JSON.stringify(userActionsLogs));
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      //wait next registration
      AsyncStorage.setItem('userActionsLogs', JSON.stringify(userActionsLogs));
    } else {
      console.error('Export of UserExperiences failed', error);
    }
  }
}
