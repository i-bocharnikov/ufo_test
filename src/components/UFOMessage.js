import React from "react";
import { View, StyleSheet } from 'react-native';
import { UFOText } from './common'

export default class UFOMessageComponent extends React.Component {
    render() {

        let text = this.props.text ? this.props.text : ""
        return (
            <View style={styles.message}><UFOText inverted>{text}</UFOText></View>
        );
    }
}

constactionStyles = StyleSheet.create({
    message: {
        height: 40,
        width: '90%',
        elevation: 1,
        borderStyle: 'dashed',
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: "flex-start"
    }
});