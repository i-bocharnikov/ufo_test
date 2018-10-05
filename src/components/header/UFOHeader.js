import React from "react";
import { View, StyleSheet } from 'react-native';
import { Header, Left, Right, Body } from 'native-base';
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
        let left = (
            <View style={styles.left}>
                <UFOAction action={{
                    style: actionStyles.ACTIVE,
                    icon: icons.HOME,
                    onPress: this.goToHome

                }} size={sizes.SMALL} noText />
            </View >)
        let title = this.props.title ? (<UFOText inverted h3>{this.props.title}</UFOText>) : null
        let subTitle = this.props.subTitle ? (<UFOText inverted h4>{this.props.subTitle}</UFOText>) : null
        let logo = this.props.logo ? (<UFOImage source={logos.horizontal} style={{ width: 200, height: 34 }} />) : null
        let alpha = this.props.transparent ? 0 : 0.7
        let currentScreen = this.props.currentScreen ? this.props.currentScreen : screens.HOME

        let isSupport = currentScreen.supportFaqCategory !== null

        let right = (
            <View style={styles.right}>
                {(isSupport &&
                    <UFOAction action={{
                        style: actionStyles.TODO,
                        icon: icons.HELP,
                        onPress: () => this.goToSupport(currentScreen)

                    }} size={sizes.SMALL} noText style={{ flex: 0.1 }} />
                )}
                <View style={{ flex: 0.8 }} />
            </View>
        )


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
            <View style={styles.headerContainer}>
                {activitiesMessage && (
                    <View style={styles.activityMessages}>
                        <UFOText h10 inverted center>{activitiesMessage}</UFOText>
                    </View>
                )}
                <Header style={{ width: "100%", backgroundColor: colors.HEADER_BACKGROUND.alpha(alpha).string() }} noShadow>
                    <Left >{left}</Left>
                    <Body >
                        {title}
                        {subTitle}
                        {logo}
                    </Body>
                    <Right >{right}</Right>
                </Header>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    left: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    right: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    activityMessages: {
        backgroundColor: colors.ERROR.string(),
        height: 15,
        width: "100%",
    }
});