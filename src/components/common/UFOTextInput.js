import React from "react";
import { View, TextInput, Keyboard } from 'react-native'
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
        let editable = this.props.editable === false ? false : true
        let defaultValue = this.props.defaultValue ? this.props.defaultValue : ""
        let autoFocus = this.props.autoFocus ? this.props.autoFocus : false
        let autoCorrect = this.props.autoCorrect ? this.props.autoCorrect : false
        let autoCapitalize = this.props.autoCorrect ? 'sentences' : 'none'
        let maxLength = this.props.maxLength
        let keyboardType = this.props.keyboardType ? this.props.keyboardType : 'default'
        let placeholder = this.props.placeholder ? this.props.placeholder : "..."
        let value = this.props.value ? this.props.value : null
        let onChangeText = this.props.onChangeText && editable ? this.props.onChangeText : (text) => console.log("UFOTextInput.onChangeText not implemented or text readonly. text " + text + " ignored")
        return (
            <View style={{ paddingHorizontal: 20, width: "100%" }}>
                <TextInput
                    style={style}
                    keyboardType={keyboardType}
                    keyboardAppearance='dark'
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    numberOfLines={numberOfLines}
                    multiline={multiline}
                    editable={editable}
                    underlineColorAndroid={colors.ACTIVE.string()}
                    autoCorrect={autoCorrect}
                    autoCapitalize={autoCapitalize}
                    onSubmitEditing={Keyboard.dismiss}>
                    {this.props.children}
                </TextInput>
            </View>
        )
    }
}
