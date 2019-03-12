import React, { PureComponent, Fragment } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';

import styles from './styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class UFOHeaderStickyWrapper extends PureComponent {
  constructor() {
    super();
    this.state = { contentHeight: 0 };
  }

  render() {
    const { children, ...scrollProps } = this.props;

    return (
      <Fragment>
        <View style={[
          styles.bouncesHeaderBG,
          { height: Math.min(this.state.contentHeight / 2, SCREEN_HEIGHT / 2) }
        ]} />
        <ScrollView
          stickyHeaderIndices={[1]}
          alwaysBounceVertical={false}
          onContentSizeChange={this.onContentSizeChange}
          {...scrollProps}
        >
          {children}
        </ScrollView>
      </Fragment>
    );
  }

  onContentSizeChange = (width, height) => {
    this.setState({ contentHeight: height });
  };
}
