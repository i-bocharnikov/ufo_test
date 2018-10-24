import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { sizes, colors, icons } from '../../utils/global'

const isIos = Platform.OS === 'ios';

export default class UFOIcon extends PureComponent {
    render() {
        const name = (isIos ? 'ios-' : 'md-') + (this.props.icon && this.props.icon.name ? this.props.icon.name : icons.WRONG);
        const color = this.props.color ? this.props.color : this.props.inverted ? colors.ACTIVE : colors.ICON;
        const fontSize = (this.props.size && this.props.size.fontSize) ? this.props.size.fontSize : sizes.MASSIVE.fontSize;
        const style = this.props.style;

        return (
            <Icon
                name={name}
                size={fontSize}
                color={color.string()}
                style={style}
            />
        );
    }
}
