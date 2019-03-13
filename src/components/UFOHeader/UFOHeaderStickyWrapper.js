import React, { PureComponent } from 'react';
import { ScrollView, View } from 'react-native';

import styles from './styles';

export default class UFOHeaderStickyWrapper extends PureComponent {
  render() {
    const { children, ...scrollProps } = this.props;

    return (
      <ScrollView
        stickyHeaderIndices={[2]}
        alwaysBounceVertical={false}
        {...scrollProps}
      >
        <View style={styles.bouncesHeaderBG} />
        {children}
      </ScrollView>
    );
  }
}
