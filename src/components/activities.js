import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';
import { activeColor, errorColor, disableColor, wrongColor } from '../utils/colors'
import Icon from './Icon';

export default class ActivitiesComponent extends React.Component {

    render() {

        let activities = this.props.activities
        let internetColor = activities ? activities.internetAccessFailure ? errorColor : activities.internetAccessPending ? activeColor : disableColor : wrongColor
        let bluetoothColor = activities ? activities.bluetoothAccessFailure ? errorColor : activities.bluetoothAccessPending ? activeColor : disableColor : wrongColor

        return (
            <View>
                <Icon size='small' color={bluetoothColor} name="bluetooth"></Icon>
                <Icon size='small' color={internetColor} name="wifi"></Icon>
            </View >
        );
    }
}