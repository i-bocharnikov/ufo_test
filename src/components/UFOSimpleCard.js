import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import ElevatedView from 'react-native-elevated-view'

import { colors } from '../utils/global';

export default class UFOSimpleCard extends Component {



    render() {

        let inverted = this.props.inverted



        return (
            <ElevatedView elevation={2}
                style={[styles.container, inverted ? styles.containerInverted : {}, this.props.style]}>
                {this.props.children}
            </ElevatedView>
        );
    }
}

styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: colors.CARD_BACKGROUND.string(),
        borderRadius: 8,
    },
    containerInverted: {
        backgroundColor: colors.HEADER_BACKGROUND.string()
    },
});