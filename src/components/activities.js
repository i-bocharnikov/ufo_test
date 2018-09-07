import React from "react";
import { View } from 'react-native';
import Icon from './Icon';
import { sizes, colors, icons } from '../utils/global'
import activitiesStore from '../stores/activitiesStore'
import { Toast } from "native-base";
import { observer } from "mobx-react";

@observer
export default class ActivitiesComponent extends React.Component {


    componentDidMount() {

        let activities = activitiesStore.activities
        if (activities.internetAccessFailure) {
            Toast.show({
                text: t('activities:internetAccessFailure'),
                textStyle: { color: colors.TEXT.string() },
            })
        }
        if (activities.bluetoothAccessFailure) {
            Toast.show({
                text: t('activities:bluetoothAccessFailure'),
                textStyle: { color: colors.TEXT.string() },
            })
        }
    }

    render() {

        let activities = activitiesStore.activities
        let internetColor = activities ? activities.internetAccessFailure ? colors.ERROR : activities.internetAccessPending ? colors.TEXT : colors.DISABLE : colors.WRONG
        let bluetoothColor = activities ? activities.bluetoothAccessFailure ? colors.ERROR : activities.bluetoothAccessPending ? colors.TEXT : colors.DISABLE : colors.WRONG

        return (
            <View style={{
                top: 0,
                right: -25,
                height: 32,
                width: 32,
            }}>
                <Icon size={sizes.SMALL} color={bluetoothColor} icon={icons.BLUETOOTH}></Icon>
                <Icon size={sizes.SMALL} color={internetColor} icon={icons.WIFI}></Icon>
            </View >
        );
    }
}