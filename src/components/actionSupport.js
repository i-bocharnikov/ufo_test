import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { translate } from "react-i18next";
import { screens, sizes, styles, colors, icons } from '../utils/global'
import Icon from './Icon'


class ActionSupportComponent extends React.Component {
    render() {

        const { t, onPress } = this.props;

        let style = styles.TODO
        return (
            <View style={{
                position: 'absolute',
                top: 20,
                right: 20,
                height: 50,
                width: 50,
            }}>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={onPress}
                >
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 30,
                        height: 30,
                        backgroundColor: style.color.string(),
                        borderRadius: 40,
                        elevation: style.elevation
                    }}>
                        <Icon icon={icons.HELP} size={sizes.SMALL} color={colors.TEXT} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


export default translate("translations")(ActionSupportComponent);