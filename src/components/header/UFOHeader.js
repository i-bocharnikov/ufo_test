import React from "react";
import { View, StyleSheet } from 'react-native';
import { observer } from "mobx-react";

import { UFOText, UFOImage } from '../common'
import { colors, icons, actionStyles, screens, navigationParams, sizes, logos } from '../../utils/global'
import UFOAction from "../UFOAction";

const SUPPORT_FAQ_CATEGORY = navigationParams.SUPPORT_FAQ_CATEGORY
const PREVIOUS_SCREEN = navigationParams.PREVIOUS_SCREEN

@observer
export default class UFOHeader extends React.Component {

    missing = () => console.log('Missing action method')
    goToHome = () => this.props.navigation.navigate(screens.HOME.name)
    goToSupport = (currentScreen) => this.props.navigation.navigate(screens.SUPPORT_FAQS.name, { SUPPORT_FAQ_CATEGORY: currentScreen.supportFaqCategory, PREVIOUS_SCREEN: currentScreen })

    render() {

        let t = this.props.t
        let title = this.props.title ? (<UFOText inverted h3>{this.props.title}</UFOText>) : null
        let subTitle = this.props.subTitle ? (<UFOText inverted h4>{this.props.subTitle}</UFOText>) : null
        let logo = this.props.logo ? (<UFOImage source={logos.horizontal} style={styles.logo} resizeMode='contain' />) : null
        let alpha = this.props.transparent ? 0 : 0.7
        let currentScreen = this.props.currentScreen ? this.props.currentScreen : screens.HOME
        let isSupport = currentScreen.supportFaqCategory !== null
        let activities = activitiesStore.activities
        let activitiesMessage = null
        if (activities.internetAccessFailure && activities.bluetoothAccessFailure) {
            activitiesMessage = t('activities:internetbluetoothAccessFailure')
        } else if (activities.internetAccessFailure) {
            activitiesMessage = t('activities:internetAccessFailure')
        } else if (activities.bluetoothAccessFailure) {
            activitiesMessage = t('activities:bluetoothAccessFailure')
        }

        return (
            <View style={styles.headerMasterContainer}>
                {activitiesMessage && (
                    <View style={styles.activityMessages}>
                        <UFOText h11 inverted center>{activitiesMessage}</UFOText>
                    </View>
                )}
                <View style={[styles.headerContainer, { backgroundColor: colors.HEADER_BACKGROUND.alpha(alpha).string() }]}>
                    <View style={styles.left}>
                        <UFOAction action={{
                            style: actionStyles.ACTIVE,
                            icon: icons.HOME,
                            onPress: this.goToHome

                        }} size={sizes.SMALL} noText />
                    </View >
                    <View style={styles.body}>
                        <View style={styles.bodyContainer}>
                            {title}
                            {subTitle}
                            {logo}
                        </View>
                    </View>
                    <View style={styles.right}>
                        {(isSupport &&
                            <UFOAction action={{
                                style: actionStyles.TODO,
                                icon: icons.HELP,
                                onPress: () => this.goToSupport(currentScreen)

                            }} size={sizes.SMALL} noText />
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerMasterContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerContainer: {
        paddingVertical: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'center'
    },
    activityMessages: {
        backgroundColor: colors.ERROR.string(),
        height: 15,
        width: "100%",
    },
    left: {
        flex: 0.15,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        flex: 0.7,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    right: {
        flex: 0.15,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodyContainer: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    logo: {
        flex: 1,
        height: 35
    },
});