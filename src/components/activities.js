import React from "react";
import { View } from 'react-native';
import Icon from './Icon';
import { sizes, colors, icons } from '../utils/global'
import activitiesStore from '../stores/activitiesStore'
import { observer } from "mobx-react";
import { showActivitiesState } from "../utils/toast";

@observer
export default class ActivitiesComponent extends React.Component {


    componentDidMount() {

        let activities = activitiesStore.activities
        let t = this.props.t
        if (activities.internetAccessFailure) {
            showActivitiesState(t('activities:internetAccessFailure'))
        }
        if (activities.bluetoothAccessFailure) {
            showActivitiesState(t('activities:bluetoothAccessFailure'))
        }
    }

    render() {

        let activities = activitiesStore.activities
        let internetColor = activities ? activities.internetAccessFailure ? colors.ERROR : activities.internetAccessPending ? colors.TEXT : colors.DISABLE : colors.WRONG
        let bluetoothColor = activities ? activities.bluetoothAccessFailure ? colors.ERROR : activities.bluetoothAccessPending ? colors.TEXT : colors.DISABLE : colors.WRONG

        return (
            <View style={{
                top: 0,
                right: -10,
                width: 16,
            }}>
                <Icon size={sizes.SMALL} color={bluetoothColor} icon={icons.BLUETOOTH}></Icon>
                <Icon size={sizes.SMALL} color={internetColor} icon={icons.WIFI}></Icon>
            </View >
        );
    }
}