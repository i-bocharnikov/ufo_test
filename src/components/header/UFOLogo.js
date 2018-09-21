import React from "react";
import { UFOImage } from '../common'

export default class UFOLogo extends React.Component {
    render() {
        return (
            <UFOImage
                source={require('../../assets/UFOLogo/UFOLogo.png')}
                style={{ width: 200, height: 33 }}
            />
        );
    }
}