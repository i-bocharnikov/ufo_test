import moment from 'moment';
import { checkConnectivity, logToApi } from './api_deprecated';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';

const ACTION_LOGS_STORAGE_KEY = 'userActionsLogs';

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
  const { momentDate, ...restLogData } = extraData;
  const date = momentDate || moment();

  console.log(
    `${date.format('HH:mm:ss')} ${severity} ${action} ${message} ${description}`
  );

  if (severity === severityTypes.DEBUG) {
    return;
  }

  const payload = {
    severity,
    code,
    action,
    message,
    description: code === 0 ? { result: description } : { error: description },
    performed_at: date.toDate(),
    ...restLogData
  };

  try {
    if (await checkConnectivity()) {
      await logToApi('/user_experiences', payload);
      let oldPayload = await popFromActionsLogs();
      while (oldPayload != null) {
        await logToApi('/user_experiences', oldPayload);
        oldPayload = await popFromActionsLogs();
      }
    } else {
      await pushInActionsLogs(payload);
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      //wait next registration
      await pushInActionsLogs(payload);
    } else {
      console.error('Export of UserExperiences failed', error);
    }
  }

  async function popFromActionsLogs() {
    const rawuserActionsLogs = await AsyncStorage.getItem(
      ACTION_LOGS_STORAGE_KEY
    );
    if (!rawuserActionsLogs) return null;
    let userActionsLogs = JSON.parse(rawuserActionsLogs);
    let payload = userActionsLogs.pop();
    if (!payload) return null;
    AsyncStorage.setItem(
      ACTION_LOGS_STORAGE_KEY,
      JSON.stringify(userActionsLogs)
    );
    return payload;
  }

  async function pushInActionsLogs(payload) {
    const rawuserActionsLogs = await AsyncStorage.getItem(
      ACTION_LOGS_STORAGE_KEY
    );
    let userActionsLogs = rawuserActionsLogs
      ? JSON.parse(rawuserActionsLogs)
      : [];
    userActionsLogs.push(payload);
    AsyncStorage.setItem(
      ACTION_LOGS_STORAGE_KEY,
      JSON.stringify(userActionsLogs)
    );
    return;
  }
}
