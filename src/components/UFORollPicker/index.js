import React, { Component } from 'react';
import { FlatList, Text, View, Animated, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import styles, {
  ITEM_HEIGHT,
  DEFAULT_FONT_SIZE,
  SELECTED_FONT_SIZE
} from './styles';

export default class UFORollPicker extends Component {
  constructor() {
    super();
    this.onScrollCount = 0;
    this.lastSelectedIndex = null;
    this.layoutOffsetY = 0;
    this.scrollY = new Animated.Value(0);
  }

  componentDidMount() {
    if (this.props.selectTo && this.props.selectTo !== this.lastSelectedIndex) {
      this.selectToItem(this.props.selectTo);
    }
  }

  componentDidUpdate() {
    if (this.props.selectTo && this.props.selectTo !== this.lastSelectedIndex) {
      this.selectToItem(this.props.selectTo);
    }
  }

  render() {
    const { flatListProps, wrapperStyles } = this.props;

    return (
      <View style={[ styles.wrapper, wrapperStyles ]}>
        <FlatList
          ref={ref =>(this.listView = ref)}
          onLayout={this.setLayoutOffset}
          keyExtractor={this.keyExtractor}
          data={this.getShiftedData()}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onScrollEndDrag={this.onScrollEndDrag}
          onScroll={Animated.event(
            [ { nativeEvent: { contentOffset: { y: this.scrollY } } } ],
            { listener: this.onScroll }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled={true}
          windowSize={5}
          snapToInterval={ITEM_HEIGHT}
          {...flatListProps}
        />
      </View>
    );
  }

  renderItem = ({ item, index }) => {
    const offset = this.layoutOffsetY;
    const i = index - 2;

    const fontSize = this.scrollY.interpolate({
      inputRange: [
        offset + i * ITEM_HEIGHT,
        offset + i * ITEM_HEIGHT + ITEM_HEIGHT,
        offset + i * ITEM_HEIGHT + ITEM_HEIGHT * 2
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
        <Animated.Text style={[
          styles.rowLabel,
          item.available === false && styles.disabledRow,
          { fontSize }
        ]}
        >
          {item.label}
        </Animated.Text>
      </View>
    );
  };

  keyExtractor = item => `${item.id}`;

  getItemLayout = (data, index) => {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index
    };
  };

  /**
    * @description Add first and last empty items to list because they are can't be chosen
    * @returns {Array}
    */
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

  /**
    * @param {Object} e
    * @description Set offset relative for screen
    */
  setLayoutOffset = ({ nativeEvent: { layout: { y } } }) => {
    this.layoutOffsetY = y;
  };

  /**
    * @param {Object} e
    * @description Handling end of scroll
    */
  onMomentumScrollEnd = e => {
    const y = e.nativeEvent.contentOffset.y;
    this.onScrollEnd(y);
  };

  /**
    * @param {number} y
    * @description Custom reaction to scroll events
    */
  onScrollEnd = y => {
    let y1 = y - (y % ITEM_HEIGHT);

    if (y % ITEM_HEIGHT > ITEM_HEIGHT / 2) {
      y1 = y1 + ITEM_HEIGHT;
    }

    let index = y1 / ITEM_HEIGHT;
    if (this.props.data[index] && this.props.data[index].available === false) {
      this.props.data.length - 1 > index ? index++ : index--;
      this.listView.scrollToIndex({ index: index });
    }

    this.handleRowChange(index);
  };

  /**
    * @param {Object} e
    * @description Handling onScrollEndDrag RN event
    */
  onScrollEndDrag = e => {
    const y = e.nativeEvent.contentOffset.y;
    const onScrollEndDragCount = this.onScrollCount;
    const start = Date.now();

    if (this.fixInterval) {
      clearInterval(this.fixInterval);
    }
    this.fixInterval = setInterval(() => this.timeFix(start, y, onScrollEndDragCount), 10);
  };

  /**
    * @param {Object} start
    * @param {number} y
    * @param {number} onScrollEndDragCount
    * @description fix for case when user stop scrolling event
    */
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

  /**
    * @description saving of amount of performed events for timeFix
    */
  onScroll = async () => {
    this.onScrollCount++;
  };

  /**
    * @param {number} i
    * @description move to item which was selected optional
    */
  selectToItem = i => {
    const { data } = this.props;
    this.lastSelectedIndex = i;

    if (data[this.lastSelectedIndex] && data[this.lastSelectedIndex].available === false) {
      data.length - 1 > this.lastSelectedIndex
        ? this.lastSelectedIndex++
        : this.lastSelectedIndex--;
      this.handleRowChange(this.lastSelectedIndex);
    }

    // setTimeout needed because on android scroll is missing at component mounting
    setTimeout(() => this.listView.scrollToIndex({ index: this.lastSelectedIndex }), 10);
  };

  /**
    * @param {index} number
    * @description run onRowChange props if it's function
    */
  handleRowChange = index => {
    if (typeof this.props.onRowChange === 'function') {
      this.props.onRowChange(index);
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
      id: PropTypes.string.isRequired,
      available: PropTypes.bool
    })
  ),
  selectTo: PropTypes.number,
  onRowChange: PropTypes.func,
  flatListProps: PropTypes.shape({ ...FlatList.PropTypes }),
  wrapperStyles: ViewPropTypes.style
};
