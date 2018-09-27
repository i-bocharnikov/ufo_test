import React from "react";
import { Header, Left, Right, Body, View } from 'native-base';

import UFOActivities from "./UFOActivities"
import UFOLogo from "./UFOLogo"
import { UFOText } from '../common'
import { colors, icons, actionStyles, screens, navigationParams } from '../../utils/global'
import UFOActionHeader from './UFOActionHeader'

const SUPPORT_FAQ_CATEGORY = navigationParams.SUPPORT_FAQ_CATEGORY
const PREVIOUS_SCREEN = navigationParams.PREVIOUS_SCREEN

export default class UFOHeader extends React.Component {

    missing = () => console.log('Missing action method')
    goToHome = () => this.props.navigation.navigate(screens.HOME.name)
    goToSupport = (currentScreen) => this.props.navigation.navigate(screens.SUPPORT_FAQS.name, { SUPPORT_FAQ_CATEGORY: currentScreen.supportFaqCategory, PREVIOUS_SCREEN: currentScreen })

    render() {

        let t = this.props.t
        let left = (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
                width: 50,
            }}>
                <UFOActionHeader icon={icons.HOME} actionStyle={actionStyles.ACTIVE} onPress={this.props.navigation ? this.goToHome : this.missing} />
            </View >)
        let title = this.props.title ? (<UFOText inverted h3>{this.props.title}</UFOText>) : null
        let subTitle = this.props.subTitle ? (<UFOText inverted h4>{this.props.subTitle}</UFOText>) : null
        let logo = this.props.logo ? (<UFOLogo />) : null
        let alpha = this.props.transparent ? 0 : 0.7
        let currentScreen = this.props.currentScreen ? this.props.currentScreen : screens.HOME

        let isSupport = currentScreen.supportFaqCategory !== null
        let right = (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
                width: 50,
            }}>
                {(isSupport &&
                    <UFOActionHeader icon={icons.HELP} actionStyle={actionStyles.TODO} onPress={this.props.navigation ? () => this.goToSupport(currentScreen) : this.missing} />
                )}
                <UFOActivities t={t} />
            </View>
        )
        return (
            <Header style={{ backgroundColor: colors.HEADER_BACKGROUND.alpha(alpha).string() }} noShadow>
                <Left >{left}</Left>
                <Body >
                    {title}
                    {subTitle}
                    {logo}
                </Body>
                <Right >{right}</Right>
            </Header>
        );
    }
}