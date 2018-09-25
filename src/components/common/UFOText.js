import React from "react";
import { Text } from 'react-native'
import { colors } from "../../utils/global";

export default class UFOText extends React.Component {

    render() {

        let style = this.props.style ? this.props.style : {}
        if (!style.color) {
            style.color = this.props.inverted ? colors.INVERTED_TEXT.string() : colors.TEXT.string()
        }
        if (!style.fontFamily) {
            style.fontFamily = "Sofia Pro"
        }
        if (!style.fontSize) {
            style.fontSize = 14
        }

        if (this.props.h1) {
            style.fontSize = 28
            style.fontWeight = 'bold'
        }
        if (this.props.h2) {
            style.fontSize = 20
            style.fontWeight = 'bold'
        }
        if (this.props.h3) {
            style.fontSize = 16
            style.fontWeight = 'bold'
        }
        if (this.props.h4) {
            style.fontSize = 15
            style.fontWeight = 'bold'
        }
        if (this.props.log) {
            style.fontSize = 10
        }
        if (this.props.center) {
            style.textAlign = 'center'
        }

        return <Text style={style} onPress={this.props.onPress} >{this.props.children}</Text>
    }
}