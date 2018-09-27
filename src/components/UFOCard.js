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

        let hasMedia = imageSource || videoSource
        let hasText = title || (texts.length > 0)
        let hasChildren = children

        let mediaStyle = hasText || hasChildren ? 'topContainer' : 'singleContainer'
        let textStyle = hasMedia ? hasChildren ? 'middleContainer' : 'bottomContainer' : 'singleContainer'
        let childrenStyle = hasText || hasMedia ? 'bottomContainer' : 'singleContainer'

        return (
            <Card style={{ backgroundColor: 'transparent' }}>
                {hasMedia && (
                    <CardItem cardBody style={styles[mediaStyle]}>
                        {imageSource && (
                            <UFOImage source={imageSource} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, height: 200, width: null, flex: 1 }} resizeMode={imageResizeMode} />
                        )}
                        {videoSource && (
                            <UFOVideo source={videoSource} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, height: 200, width: null, flex: 1 }} resizeMode={imageResizeMode} />
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
                    <CardItem style={styles[childrenStyle]}>
                        {children}
                    </CardItem>
                )}
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
