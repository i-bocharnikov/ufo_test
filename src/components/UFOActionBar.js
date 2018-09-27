import React from "react";
import { View, Dimensions, StyleSheet } from 'react-native';
import { translate } from "react-i18next";

import UFOAction from "./UFOAction";

const DEVICE_HEIGTH = Dimensions.get("window").height
const ACTION_BAR_HEIGTH = 90

class UFOActionBar extends React.Component {
    render() {

        const { t } = this.props;
        let actions = this.props.actions ? this.props.actions : []
        let moveUp = this.props.moveUp ? this.props.moveUp : 0
        return (
            <View style={[styles.actionBarContainer, { top: styles.actionBarContainer.top - moveUp, bottom: styles.actionBarContainer.bottom + moveUp }]}>
                <View style={styles.actionBar}>
                    {actions.map((action, index) => (
                        <UFOAction action={action} key={index} />
                    ))}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    actionBarContainer: {
        ...StyleSheet.absoluteFillObject,
        top: DEVICE_HEIGTH - ACTION_BAR_HEIGTH,
        bottom: 0,
        backgroundColor: 'transparent'
    },
    actionBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start'
    },
});

export default translate("translations")(UFOActionBar);