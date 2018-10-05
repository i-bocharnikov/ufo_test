import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card, CardItem, Body, Left } from 'native-base';
import { UFOImage, UFOText } from './common';
import UFOVideo from './common/UFOVideo';
import _ from 'lodash'
export default class UFOCard extends Component {



    render() {

        let inverted = this.props.inverted
        let title = this.props.title
        let texts = this.props.texts ? this.props.texts : []
        if (!_.isEmpty(this.props.text)) texts.push(this.props.text)
        let imageSource = this.props.imageSource
        let imageResizeMode = this.props.imageResizeMode
        let videoSource = this.props.videoSource
        let children = this.props.children
        let message = this.props.message

        let hasMedia = imageSource || videoSource
        let hasText = title || (texts.length > 0)
        let hasChildren = children !== undefined ? true : false
        let hasMessage = message !== undefined ? true : false

        let mediaStyle = hasText || hasChildren || hasMessage ? 'topContainer' : 'singleContainer'
        let textStyle = hasMedia ? hasChildren || hasMessage ? 'middleContainer' : 'bottomContainer' : hasChildren || hasMessage ? 'topContainer' : 'singleContainer'
        let childrenStyle = hasMedia || hasText ? hasMessage ? 'middleContainer' : 'bottomContainer' : hasMessage ? 'topContainer' : 'singleContainer'
        let messageStyle = hasMedia || hasText || hasChildren ? 'bottomContainer' : 'singleContainer'

        return (
            <Card style={{ backgroundColor: 'transparent' }}>
                {hasMedia && (
                    <CardItem cardBody style={styles[mediaStyle]}>
                        {imageSource && (
                            <UFOImage source={imageSource} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, height: 250, width: null, flex: 1 }} resizeMode={imageResizeMode} />
                        )}
                        {videoSource && (
                            <UFOVideo source={videoSource} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, height: 250, width: null, flex: 1 }} resizeMode={imageResizeMode} />
                        )}
                    </CardItem>
                )}
                {hasText && (
                    <CardItem style={styles[textStyle]}>
                        <Left>
                            <Body>
                                <UFOText h5 upper>{title}</UFOText>
                                {texts.map((text, index) => <UFOText key={index} note>{text}</UFOText>)}
                            </Body>
                        </Left>
                    </CardItem>
                )}
                {hasChildren && (
                    <CardItem style={[styles[childrenStyle]]}>
                        {children}
                    </CardItem>
                )
                }
                {hasMessage && (
                    <CardItem style={[styles[messageStyle]]}>
                        <Left>
                            <Body>
                                <UFOText h5 note>{message}</UFOText>
                            </Body>
                        </Left>
                    </CardItem>
                )
                }
            </Card>
        );
    }
}


const styles = StyleSheet.create({
    topContainer: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    bottomContainer: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    middleContainer: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    singleContainer: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    }
})
