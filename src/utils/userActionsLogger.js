import moment from 'moment';
import { checkConnectivity, postToApi } from './api_deprecated';

export const codeTypes = {
    SUCCESS: 0,
    ERROR: 1,
};

export const severityTypes = {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
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
            ...restLogData,
        };

        if (isConnectionActive) {
            await postToApi('/user_experiences', payload, true);
        }
    } catch (error) {
        console.error('export of UserExperiences failed', error);
    }
}
