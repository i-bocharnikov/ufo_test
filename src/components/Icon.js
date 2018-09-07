import React, { Component } from "react";
import { Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

import { sizes, colors, icons } from '../utils/global'

const isIos = Platform.OS === 'ios'

export default class LogoComponent extends React.Component {
    render() {
        let name = (isIos ? 'ios-' : 'md-') + (this.props.icon && this.props.icon.name ? this.props.icon.name : icons.WRONG)
        let color = this.props.color ? this.props.color : colors.WRONG
        let fontSize = (this.props.size && this.props.size.fontSize) ? this.props.size.fontSize : sizes.MASSIVE
        return (
            <Icon name={name} size={fontSize} color={color.string()} />
        );
    }
}