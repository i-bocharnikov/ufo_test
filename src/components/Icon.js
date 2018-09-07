import React, { Component } from "react";
import { Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

const isIos = Platform.OS === 'ios'

export default class LogoComponent extends React.Component {
    render() {
        let name = (isIos ? 'ios-' : 'md-') + this.props.name
        let color = this.props.color
        let size = 32
        switch (this.props.size) {
            case 'mini':
                size = 4
                break;
            case 'tiny':
                size = 8
                break;
            case 'small':
                size = 16
                break;
            case 'large':
                size = 32
                break;
            case 'big':
                size = 64
                break;
            case 'huge':
                size = 128
                break;
            case 'massive':
                size = 256
                break;
            default:
                break;
        }
        return (
            <Icon name={name} size={size} color={color.string()} />
        );
    }
}