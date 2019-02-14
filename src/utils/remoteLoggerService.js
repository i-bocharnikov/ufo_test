import moment from 'moment';
import { checkConnectivity, logToApi } from './api_deprecated';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';

const STORAGE_KEY = 'RemoteLoggerStorageKey';

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

class RemoteLoggerService {
  constructor() {
    this.inMemoryLogs = [];
  }

  initialise = async () => {
    try {
      const rawLogs = await AsyncStorage.getItem(STORAGE_KEY);
      const logs = rawLogs ? JSON.parse(rawLogs) : [];
      if (await checkConnectivity()) {
        this.info(
          'recoverLogs',
          'recover and post ' + logs.length + ' logs',
          logs
        );
        this.inMemoryLogs = [];
        await AsyncStorage.removeItem(STORAGE_KEY);
        for (const payload of logs) {
          await this.postLog(payload);
        }
      }
    } catch (error) {
      this.error(
        'initialise logs',
        'failed to load and post saved logs',
        error
      );
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  info = async (action, message = '', description = {}, context = {}) => {
    return await this.log(
      severityTypes.INFO,
      codeTypes.SUCCESS,
      action,
      message,
      description,
      context
    );
  };

  warn = async (action, message = '', description = {}, context = {}) => {
    return await this.log(
      severityTypes.WARN,
      codeTypes.ERROR,
      action,
      message,
      description,
      context
    );
  };

  error = async (action, message = '', description = {}, context = {}) => {
    return await this.log(
      severityTypes.ERROR,
      codeTypes.ERROR,
      action,
      message,
      description,
      context
    );
  };

  debug = async (action, message = '', description = {}, context = {}) => {
    return await this.log(
      severityTypes.DEBUG,
      codeTypes.SUCCESS,
      action,
      message,
      description,
      context
    );
  };

  log = async (
    severity,
    code,
    action,
    message = '',
    description = {},
    context = {}
  ) => {
    const date = moment();

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
        code === codeTypes.SUCCESS
          ? { result: { ...description } }
          : { error: { ...description } },
      performed_at: date.toDate(),
      context: { ...context }
    };

    await this.postLog(payload);
  };

  postLog = async payload => {
    logToApi('/user_experiences', payload).catch(() => {
      this.persistLog(payload).catch();
    });
  };

  persistLog = async payload => {
    this.inMemoryLogs.push(payload);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryLogs));
  };
}

const remoteLoggerService = new RemoteLoggerService();

export default remoteLoggerService;
