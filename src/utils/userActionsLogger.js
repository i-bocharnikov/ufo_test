import moment from 'moment';

import { checkConnectivity, postToApi } from './api';

export default async function userActionsLogger(options) {
    try {
        const {
            severity = '',
            action = '',
            code = null,
            message = '',
            description = '',
            context = null,
            momentDate = null,
        } = options;
        const date = momentDate || moment();
        const isConnectionActive = await checkConnectivity();

        if (severity === 'debug') {
            console.log(`${date.format('HH:mm:ss')} ${severity} ${action} ${message}`);
            return;
        }

        const payload = {
            severity,
            action,
            code,
            message,
            context,
            performed_at: date.toDate(),
            description: code === 0 ? {result: description} : {error: description}
        };

        if (isConnectionActive) {
            await postToApi('/user_experiences', payload);
        } else {
            // this.userExperiences.push(payload);
            // look function below for pending log, I leave it as it was
        }
    } catch (error) {
        console.error('export of UserExperiences failed', error);
    }
}


/*
strange functions, it was hide in comments, not sure that it work

constructor() {
    //AppRegistry.registerHeadlessTask('ExportUserExperienceTask', this.exportPendingUserExperiences);
}

async exportPendingUserExperiences(taskData) {
    try {
        console.log("exportPendingUserExperiences started with ", taskData)
        if (await checkConnectivity()) {
            let isConnected = true
            while (this.userExperiences && this.userExperiences.length > 0 && isConnected) {
                try {
                    await postToApi("/user_experiences", this.userExperiences.shift())
                } catch (error) {
                    isConnected = await checkConnectivity()
                    console.log("exportPendingUserExperiences failed", error)
                }
            }
        }
    } catch (error) {
        console.log("exportPendingUserExperiences failed with ", error)
    }
    console.log("exportPendingUserExperiences stopped with ", taskData)
}
*/