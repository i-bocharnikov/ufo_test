import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { whiteColor, successColor, errorColor, todoColor, doneColor, pendingColor, disableColor } from '../utils/colors'


export default class ActionBarComponent extends React.Component {
    render() {

        let actions = this.props.actions ? this.props.actions : []

        return (
            <View style={styles.actionBar}>
                {actions.map((action, index) =>
                    <TouchableOpacity
                        key={index}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={action.onPress}
                        action={action}
                        disabled={action.style === 'disable'}
                    >
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            backgroundColor: this.getBackgroundColorForStyle(action.style),
                            borderRadius: 100,
                            elevation: 1
                        }}>
                            <Icon name={action.icon} size={50} color={this.getColorForStyle(action.color)} />
                        </View>
                        <Text style={{ color: whiteColor, fontWeight: 'bold' }}>{action.text}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }





    getBackgroundColorForStyle = (style) => {
        switch (style) {
            case 'todo':
                return todoColor
            case 'done':
                return doneColor
            case 'disable':
                return disableColor
            case 'success':
                return successColor
            case 'error':
                return errorColor
            case 'pending':
                return pendingColor
            default:
                return whiteColor
        }
    }

    getColorForStyle = (style) => {
        return whiteColor
    }

}

const styles = StyleSheet.create({
    actionBar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 100,
        width: '100%',
    }
});

