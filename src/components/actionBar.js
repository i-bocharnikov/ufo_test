import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { wrongColor, activeColor, textColor, successColor, errorColor, todoColor, doneColor, pendingColor, disableColor } from '../utils/colors'

import Icon from './Icon'

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
                            <Icon name={action.icon} size={50} color={textColor} />
                        </View>
                        <Text style={{ color: textColor.string(), fontWeight: 'bold' }}>{action.text}</Text>
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
            case 'active':
                return activeColor
            case 'disable':
                return disableColor
            case 'success':
                return successColor
            case 'error':
                return errorColor
            case 'pending':
                return pendingColor
            default:
                return wrongColor
        }
    }

    getColorForStyle = (style) => {
        return textColor
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

