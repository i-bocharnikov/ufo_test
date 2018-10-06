import React from "react";
import { View, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { translate } from "react-i18next";

import { UFOText, UFOIcon } from './common'
import { actionStyles, colors, icons, sizes } from '../utils/global'


class UFOAction extends React.Component {
    render() {

        const { t } = this.props;
        let action = this.props.action ? this.props.action : []

        let style = this.props.activityPending ? actionStyles.DISABLE : action.style ? action.style : actionStyles.WRONG
        let color = this.props.activityPending ? colors.DISABLE : style.color ? style.color : colors.WRONG
        let elevation = style.elevation ? style.elevation
            : style === actionStyles.TODO ? 4
                : style === actionStyles.ACTIVE ? 3
                    : style === actionStyles.DONE ? 2
                        : style === actionStyles.DISABLE ? 0
                            : 0
        let icon = action.icon ? action.icon : icons.WRONG
        let inverted = this.props.inverted ? this.props.inverted : false
        let size = this.props.size ? this.props.size : sizes.LARGE
        let actionSize = size === sizes.SMALL ? 30 : 45
        let noText = this.props.noText ? true : false
        return (
            <View
                style={styles.area}
            >
                <Touchable
                    foreground={Touchable.Ripple(colors.DONE.string(), true)}
                    style={[styles.button, {
                        backgroundColor: color.string(),
                        elevation: elevation,
                        width: actionSize,
                        height: actionSize,
                        borderRadius: actionSize,
                    }]}
                    onPress={action.onPress}
                    action={action}
                    disabled={style === actionStyles.DISABLE}
                >
                    <UFOIcon icon={icon} size={size} />
                </Touchable>
                {!noText && (
                    <UFOText h10 upper inverted={!inverted}>{t(icon.i18nKey)}</UFOText>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default translate("translations")(UFOAction);