import React from "react";
import { View, TextInput, StyleSheet } from 'react-native'
import { colors } from "../../utils/global";

export default class UFOTextInput extends React.Component {

    render() {

        let style = this.props.style ? this.props.style : {}
        if (!style.color) {
            style.color = this.props.inverted ? colors.INVERTED_TEXT.string() : colors.TEXT.string()
        }
        if (!style.paddingLeft && !style.padding) {
            style.paddingLeft = 20
        }
        if (!style.fontFamily) {
            style.fontFamily = "Sofia Pro"
        }
        if (!style.fontSize) {
            style.fontSize = 14
        }

        if (this.props.h1) {
            style.fontSize = 17
            style.fontWeight = 'bold'
        }
        if (this.props.h2) {
            style.fontSize = 16
            style.fontWeight = 'bold'
        }
        if (this.props.h3) {
            style.fontSize = 15
            style.fontWeight = 'bold'
        }
        if (this.props.log) {
            style.fontSize = 10
        }
        let numberOfLines = this.props.numberOfLines ? this.props.numberOfLines : 1
        let multiline = this.props.multiline ? this.props.multiline : false
        let editable = this.props.editable ? this.props.editable : true
        let placeholder = this.props.placeholder ? this.props.placeholder : "..."
        let onChangeText = this.props.onChangeText ? this.props.onChangeText : (text) => console.log("UFOTextInput.onChangeText not implemented. text " + text + " ignored")
        let value = this.props.value ? this.props.value : null
        return (
            <View style={{
                elevation: 2,
                borderRadius: 5,
                backgroundColor: colors.CARD_BACKGROUND.string()
            }}>
                <TextInput
                    style={style}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    numberOfLines={numberOfLines}
                    multiline={multiline}
                    editable={editable}>
                    {this.props.children}
                </TextInput>
            </View>
        )
    }
}
