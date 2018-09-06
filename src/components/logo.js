import React, { Component } from "react";
import { Image } from 'react-native';

const logo = require('../assets/UFOLogo-alone-Horizontal.png')

export default class LogoComponent extends React.Component {
    render() {
        return (
            <Image
                source={logo}
                style={{ width: 200, height: 20 }}
            />
        );
    }
}