import React from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { translate } from "react-i18next";

import { UFOText, UFOIcon } from './common'
import { actionStyles, colors, icons, sizes } from '../utils/global'


class UFOAction extends React.Component {
    render() {

        const { t } = this.props;
        let action = this.props.action ? this.props.action : []

        let style = this.props.activityPending ? actionStyles.DISABLE : action.style ? action.style : actionStyles.WRONG
        let color = this.props.activityPending ? colors.DISABLE : style.color ? style.color : colors.WRONG
        let elevation = style.elevation ? style.elevation : 0
        let icon = action.icon ? action.icon : icons.WRONG
        return (
            <View
                style={styles.area}
            >
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: color.string(), elevation: elevation }]}
                    onPress={action.onPress}
                    action={action}
                    disabled={style === actionStyles.DISABLE}
                >
                    <UFOIcon icon={icon} size={sizes.LARGE} />
                </TouchableOpacity>
                <UFOText inverted h10 upper>{t(icon.i18nKey)}</UFOText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    button: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 45,
        height: 45,
        borderRadius: 45,
    },
});

export default translate("translations")(UFOAction);