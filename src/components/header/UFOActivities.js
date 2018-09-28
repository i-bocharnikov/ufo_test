import React from "react";
import { View } from 'react-native';
import { observer } from "mobx-react";

import { UFOIcon } from '../common'
import { sizes, colors, icons } from '../../utils/global'
import { showActivitiesState } from "../../utils/interaction";
import activitiesStore from '../../stores/activitiesStore'

@observer
export default class UFOActivities extends React.Component {


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
        let internetColor = activities ? activities.internetAccessFailure ? colors.ERROR : activities.internetAccessPending ? colors.ICON : colors.DISABLE : colors.WRONG
        let bluetoothColor = activities ? activities.bluetoothAccessFailure ? colors.ERROR : activities.bluetoothAccessPending ? colors.ICON : colors.DISABLE : colors.WRONG

        return (
            <View style={{
                // top: 0,
                // right: -10,
                width: 16,
            }}>
                <UFOIcon size={sizes.SMALL} color={bluetoothColor} icon={icons.BLUETOOTH}></UFOIcon>
                <UFOIcon size={sizes.SMALL} color={internetColor} icon={icons.WIFI}></UFOIcon>
            </View >
        );
    }
}