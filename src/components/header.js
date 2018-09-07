import React, { Component } from "react";
import { Platform } from 'react-native'
import { Container, Content, Form, Item, Label, Input, Header, Left, Right, Body, Title, Subtitle } from 'native-base';

import ActivitiesComponent from "./activities"
import LogoComponent from "./logo"
import { sizes, colors, icons } from '../utils/global'


export default class HeaderComponent extends React.Component {
    render() {

        let left = null
        let title = this.props.title ? (<Title>{this.props.title}</Title>) : null
        let subTitle = this.props.subTitle ? (<Subtitle>{this.props.subTitle}</Subtitle>) : null
        let logo = title ? null : (<LogoComponent />)
        let alpha = title ? 1 : 0.5
        let right = (<ActivitiesComponent />)
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