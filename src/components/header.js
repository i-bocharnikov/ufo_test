import React from "react";
import { Header, Left, Right, Body, Title, Subtitle, View } from 'native-base';

import ActivitiesComponent from "./activities"
import LogoComponent from "./logo"
import { colors, icons, actionStyles, screens, navigationParams } from '../utils/global'
import ActionHeaderComponent from './actionHeader'

const SUPPORT_FAQ_CATEGORY = navigationParams.SUPPORT_FAQ_CATEGORY
const PREVIOUS_SCREEN = navigationParams.PREVIOUS_SCREEN

export default class HeaderComponent extends React.Component {

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
                <ActionHeaderComponent icon={icons.HOME} actionStyle={actionStyles.ACTIVE} onPress={this.props.navigation ? this.goToHome : this.missing} />
            </View >)
        let title = this.props.title ? (<Title>{this.props.title}</Title>) : null
        let subTitle = this.props.subTitle ? (<Subtitle>{this.props.subTitle}</Subtitle>) : null
        let logo = title ? null : (<LogoComponent />)
        let alpha = this.props.transparent ? 0.8 : 1
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
                    <ActionHeaderComponent icon={icons.HELP} actionStyle={actionStyles.TODO} onPress={this.props.navigation ? () => this.goToSupport(currentScreen) : this.missing} />
                )}
                <ActivitiesComponent t={t} />
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