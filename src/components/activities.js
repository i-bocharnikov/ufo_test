import React, { Component } from "react";
import { Grid, Col } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
import { observer } from "mobx-react";

import ActivitiesStore from '../stores/activitiesStore'

@observer
export default class Activities extends React.Component {
    render() {


        let internetColor = ActivitiesStore.internetAccessFailure ? "red" : ActivitiesStore.internetAccessPending ? "white" : "grey"
        let bluetoothColor = ActivitiesStore.bluetoothAccessFailure ? "red" : ActivitiesStore.bluetoothAccessPending ? "white" : "grey"

        return (
            <Grid>
                <Col><Icon size={20} color={bluetoothColor} name="bluetooth"></Icon></Col>
                <Col><Icon size={20} color={internetColor} name="wifi"></Icon></Col>
            </Grid>
        );
    }
}