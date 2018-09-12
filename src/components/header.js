import React from "react";
import { Header, Left, Right, Body, Title, Subtitle } from 'native-base';

import ActivitiesComponent from "./activities"
import LogoComponent from "./logo"
import { colors } from '../utils/global'


export default class HeaderComponent extends React.Component {
    render() {

        let t = this.props.t
        let left = null
        let title = this.props.title ? (<Title>{this.props.title}</Title>) : null
        let subTitle = this.props.subTitle ? (<Subtitle>{this.props.subTitle}</Subtitle>) : null
        let logo = title ? null : (<LogoComponent />)
        let alpha = this.props.transparent ? 0.8 : 1
        let right = (<ActivitiesComponent t={t} />)
        return (
            <Header style={{ backgroundColor: colors.BACKGROUND.alpha(alpha).string() }} noShadow>
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