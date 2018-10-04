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
            style.fontFamily = "Sofia Pro Light"
        }
        if (!style.fontSize) {
            style.fontSize = 14
        }
        if (this.props.bold) {
            style.fontWeight = 'bold'
        }
        if (this.props.italic) {
            style.fontStyle = 'italic'
        }
        if (this.props.h1) {
            style.fontSize = 28
        }
        if (this.props.h2) {
            style.fontSize = 20
        }
        if (this.props.h3) {
            style.fontSize = 16
        }
        if (this.props.h4) {
            style.fontSize = 15
        }
        if (this.props.h5) {
            style.fontSize = 15
        }
        if (this.props.h6) {
            style.fontSize = 14
        }
        if (this.props.h7) {
            style.fontSize = 13
        }
        if (this.props.h8) {
            style.fontSize = 12
        }
        if (this.props.h9) {
            style.fontSize = 11
        }
        if (this.props.h10) {
            style.fontSize = 10
        }
        if (this.props.link) {
            style.color = colors.SUCCESS.string()
            style.textDecorationLine = 'underline'
        }
        if (this.props.note) {
            style.color = this.props.inverted ? colors.DISABLE.string() : colors.TRANSITION_BACKGROUND.string()
            style.fontSize = 13
        }
        if (this.props.log) {
            style.fontSize = 10
        }
        if (this.props.center) {
            style.textAlign = 'center'
        }
        if (this.props.underline) {
            style.borderColor = colors.ACTIVE.string()
            style.borderWidth = 1
        }

        let text = this.props.children ? this.props.children : ""
        if (this.props.upper)
            text = text.toUpperCase()

        return <Text style={style} onPress={this.props.onPress} >{text}</Text>
    }
}