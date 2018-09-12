import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { translate } from "react-i18next";
import { actionStyles, colors, icons, sizes } from '../utils/global'
import Icon from './Icon'

class ActionBarComponent extends React.Component {
    render() {

        const { t } = this.props;
        let actions = this.props.actions ? this.props.actions : []

        return (
            <View style={{
                position: 'absolute',
                bottom: 0,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                height: 100,
                width: '100%',
            }}>
                {actions.map((action, index) => {

                    let style = action.style ? action.style : actionStyles.WRONG
                    let color = style.color ? style.color : colors.WRONG
                    let elevation = style.elevation ? style.elevation : 0
                    let icon = action.icon ? action.icon : icons.WRONG
                    return (
                        <TouchableOpacity
                            key={index}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={action.onPress}
                            action={action}
                            disabled={style === actionStyles.DISABLE}
                        >
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 60,
                                height: 60,
                                backgroundColor: color.string(),
                                borderRadius: 100,
                                elevation: elevation
                            }}>
                                <Icon icon={icon} size={sizes.LARGE} color={colors.TEXT} />
                            </View>
                            <Text style={{ color: colors.TEXT.string(), fontWeight: 'bold' }}>{t(icon.i18nKey)}</Text>
                        </TouchableOpacity>
                    )
                }
                )}
            </View>
        );
    }
}


export default translate("translations")(ActionBarComponent);