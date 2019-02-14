/* Deprecated! Use RN Text and textThemes instead */
import React, { PureComponent } from 'react';
import { Text, StyleSheet } from 'react-native';
import _ from 'lodash';

import { colors, fonts } from './../../utils/global';

export default class UFOText extends PureComponent {
  render() {
    return (
      <Text { ...this.props } style={this.computedStyles}>
        {this.text}
      </Text>
    );
  }

  get text() {
    let text = this.props.children || '';

    if (this.props.upper) {
      text = text.toUpperCase();
    }

    return text;
  }

  get computedStyles() {
    const optionStyles = StyleSheet.create({
      text: {
        ...this.colorStyle,
        ...this.fontSizeStyle,
        ...this.underlineStyle,
        ...this.alignStyle,
        ...this.fontFamilyStyle
      }
    });

    return [ optionStyles.text, this.props.style ];
  }

  get colorStyle() {
    const { color, note, inverted } = this.props;
    let computedColor = null;

    if (note) {
      computedColor = inverted ? colors.DISABLE : colors.TRANSITION_BACKGROUND;
    } else if (color) {
      computedColor = color;
    } else {
      computedColor = inverted ? colors.INVERTED_TEXT : colors.TEXT;
    }

    if (computedColor && _.isFunction(computedColor.string)) {
      computedColor = computedColor.string();
    }

    return computedColor ? { color: computedColor } : {};
  }

  get fontSizeStyle() {
    switch(true) {
      case !!this.props.log:
        return { fontSize: 10 };
      case !!this.props.h11:
        return { fontSize: 10 };
      case !!this.props.h10:
        return { fontSize: 11 };
      case !!this.props.h9:
        return { fontSize: 12 };
      case !!this.props.h8:
        return { fontSize: 13 };
      case !!this.props.h7:
        return { fontSize: 14 };
      case !!this.props.h6:
        return { fontSize: 15 };
      case !!this.props.h5:
        return { fontSize: 16 };
      case !!this.props.h4:
        return { fontSize: 17 };
      case !!this.props.h3:
        return { fontSize: 18 };
      case !!this.props.h2:
        return { fontSize: 19 };
      case !!this.props.h1:
        return { fontSize: 20 };
      default:
        return { fontSize: 14 };
    }
  }

  get underlineStyle() {
    const style = {};

    if (this.props.link) {
      style.textDecorationLine = 'underline';
    }

    if (this.props.underline) {
      style.borderColor = colors.ACTIVE.string();
      style.borderWidth = 1;
    }

    return style;
  }

  get alignStyle() {
    return this.props.center ? { textAlign: 'center' } : {};
  }

  get fontFamilyStyle() {
    const style = { fontFamily: fonts.LIGHT };

    if (this.props.bold) {
      style.fontWeight = 'bold';
    }

    if (this.props.italic) {
      style.fontStyle = 'italic';
    }

    return style;
  }
}
