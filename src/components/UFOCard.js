import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';

import { UFOImage, UFOText } from './common';
import { colors } from '../utils/global';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;


export default class UFOCard extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image() {
        const { data: { source }, parallax, parallaxProps, even } = this.props;

        if (parallax) {
            return (
                <ParallaxImage
                    source={source}
                    containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
                    style={styles.image}
                    parallaxFactor={0.35}
                    showSpinner={true}
                    spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
                    {...parallaxProps}
                />
            )
        }

        return (
            <UFOImage
                source={source}
                style={styles.image} />
        )
    }

    render() {
        const { data: { title, subtitle }, even } = this.props;

        const uppercaseTitle = title ? (
            <UFOText
                style={[styles.title, even ? styles.titleEven : {}]}
                numberOfLines={2}
            >
                {title.toUpperCase()}
            </UFOText>
        ) : false;

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.slideInnerContainer}
                onPress={() => { console.log(`You've clicked '${title}'`); }}
            >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    {this.image}
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    {title && (
                        { uppercaseTitle }
                    )}
                    {subtitle && (
                        <UFOText
                            style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                            numberOfLines={2}
                        >
                            {subtitle}
                        </UFOText>
                    )}
                </View>
            </TouchableOpacity>
        );
    }
}




styles = StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.TEXT.string(),
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: colors.TEXT.string()
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.TEXT.string()
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.TEXT.string()
    },
    title: {
        color: colors.TEXT.string(),
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.DISABLE.string(),
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});