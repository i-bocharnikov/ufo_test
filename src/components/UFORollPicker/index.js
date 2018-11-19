import React, { PureComponent } from 'react';
import { FlatList, Text, View, Animated } from 'react-native';
import PropTypes from 'prop-types';

import styles, {
  ITEM_HEIGHT,
  DEFAULT_FONT_SIZE,
  SELECTED_FONT_SIZE
} from './styles';

export default class UFORollPicker extends PureComponent {
  constructor() {
    super();
    this.onScrollCount = 0;
    this.state = {
      scrollY: new Animated.Value(0),
      layoutOffsetY: 0
    };
  }

  componentDidMount() {
    if (this.props.selectTo) {
      this.selectToItem(this.props.selectTo);
    }
  }

  componentDidUpdate() {
    if (this.props.selectTo) {
      this.selectToItem(this.props.selectTo);
    }
  }

  render() {
    return (
      <View
        style={styles.wrapper}
        onLayout={this.setLayoutOffset}
      >
        <FlatList
          ref={ref =>(this.listView = ref)}
          keyExtractor={this.keyExtractor}
          data={this.getShiftedData()}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onScrollEndDrag={this.onScrollEndDrag}
          onScroll={Animated.event(
            [ { nativeEvent: { contentOffset: { y: this.state.scrollY } } } ],
            { listener: this.onScroll }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled={true}
          initialNumToRender={3}
          {...this.props.flatListProps}
        />
      </View>
    );
  }

  renderItem = ({ item, index }) => {
    const offset = this.state.layoutOffsetY;
    const i = index - 2;

    const fontSize = this.state.scrollY.interpolate({
      inputRange: [
        offset + i * ITEM_HEIGHT,
        offset + i * ITEM_HEIGHT + ITEM_HEIGHT,
        offset + i * ITEM_HEIGHT + ITEM_HEIGHT
      ],
      outputRange: [
        DEFAULT_FONT_SIZE,
        SELECTED_FONT_SIZE,
        DEFAULT_FONT_SIZE
      ],
      extrapolate: 'clamp'
    });

    return (
      <View style={styles.row}>
        <Animated.Text style={[ styles.rowLabel, { fontSize } ]}>
          {item.label}
        </Animated.Text>
      </View>
    );
  };

  keyExtractor = item => `${item.id}`;

  getShiftedData = () => {
    if (this.props.data.length) {
      const shiftedData = [ {
        id: 'empty-start',
        label: ''
      } ].concat(
        this.props.data,
        {
          id: 'empty-end',
          label: ''
        }
      );

      return shiftedData;
    }

    return this.props.data;
  };

  getItemLayout = (data, index) => {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index
    };
  };

  setLayoutOffset = ({ nativeEvent: { layout: { y } } }) => {
    this.setState({ layoutOffsetY: y });
  };

  onMomentumScrollEnd = e => {
    const y = e.nativeEvent.contentOffset.y;
    this.onScrollEnd(y);
  };

  onScrollEnd = y => {
    let y1 = y - (y % ITEM_HEIGHT);

    if (y % ITEM_HEIGHT > ITEM_HEIGHT / 2) {
      y1 = y1 + ITEM_HEIGHT;
    }

    const index = y1 / ITEM_HEIGHT;

    if (this.listView) {
      this.listView.scrollToIndex({ index: index, animated: false });
    }

    if (this.props.onRowChange) {
      this.props.onRowChange(index);
    }
  };

  onScrollEndDrag = e => {
    const y = e.nativeEvent.contentOffset.y;
    const onScrollEndDragCount = this.onScrollCount;
    const start = Date.now();

    if (this.fixInterval) {
      clearInterval(this.fixInterval);
    }
    this.fixInterval = setInterval(() => this.timeFix(start, y, onScrollEndDragCount), 10);
  };

  timeFix = (start, y, onScrollEndDragCount) => {
    const now = Date.now();
    const end = 200;

    if (now - start > end) {
      clearInterval(this.fixInterval);

      if (onScrollEndDragCount === this.onScrollCount) {
        this.onScrollEnd(y);
      }
    }
  };

  onScroll = async () => {
    this.onScrollCount++;
  };

  selectToItem = i => {
    if (this.listView) {
      this.listView.scrollToIndex({ index: i, animated: false });
    }
  };
}

UFORollPicker.defaultProps = {
  data: [],
  flatListProps: {}
};

UFORollPicker.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  ),
  selectTo: PropTypes.number,
  onRowChange: PropTypes.func,
  flatListProps: PropTypes.shape({ ...FlatList.PropTypes })
};
