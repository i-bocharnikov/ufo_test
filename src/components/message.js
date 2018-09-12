import React, { Component } from "react";
import { View, StyleSheet, Text } from 'react-native';

export default class MessageComponent extends React.Component {
    render() {

        let text = this.props.text ? this.props.text : ""
        return (
            <View style={styles.message}><Text style={{ color: 'white' }}>{text}</Text></View>
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
        //backgroundColor: "#172c32",
        justifyContent: "flex-start"
    }
});