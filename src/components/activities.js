import React, { Component } from "react";
import { Grid, Col } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ActivitiesComponent extends React.Component {

    render() {

        let activities = this.props.activities
        let internetColor = activities ? activities.internetAccessFailure ? "red" : activities.internetAccessPending ? "white" : "grey" : "black"
        let bluetoothColor = activities ? activities.bluetoothAccessFailure ? "red" : activities.bluetoothAccessPending ? "white" : "grey" : "black"

        return (
            <Grid>
                <Col><Icon size={20} color={bluetoothColor} name="bluetooth"></Icon></Col>
                <Col><Icon size={20} color={internetColor} name="wifi"></Icon></Col>
            </Grid>
        );
    }
}