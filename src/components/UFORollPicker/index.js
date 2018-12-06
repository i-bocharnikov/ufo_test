import React, { Component } from 'react';
import { FlatList, Text, View, Animated, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles, {
  ITEM_HEIGHT,
  DEFAULT_TEXT_SCALE,
  SELECTED_TEXT_SCALE
} from './styles';

const FlatListAnimated = Animated.createAnimatedComponent(FlatList);

export default class UFORollPicker extends Component {
  constructor() {
    super();
    this.onScrollCount = 0;
    this.lastSelectedIndex = null;
    this.layoutOffsetY = 0;
    this.scrollY = new Animated.Value(0);
    this.perPage = 30;
    this.state = {
      /* simulation of page for big lists */
      page: 1
    };
  }

  componentDidMount() {
    if (this.props.selectTo && this.props.selectTo !== this.lastSelectedIndex) {
      this.selectToItem(this.props.selectTo);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.selectTo !== this.lastSelectedIndex
      || nextProps.data !== this.props.data
      || nextState.page !== this.state.page) {
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    if (_.isFinite(this.props.selectTo) && this.props.selectTo !== this.lastSelectedIndex) {
      this.selectToItem(this.props.selectTo);
    }
  }

  render() {
    const { flatListProps, wrapperStyles } = this.props;

    return (
      <View style={[ styles.wrapper, wrapperStyles ]}>
        <FlatListAnimated
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
            { listener: this.onScroll, useNativeDriver: true }
          )}
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled={true}
          windowSize={7}
          snapToInterval={ITEM_HEIGHT}
          onEndReached={this.incrementPage}
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
        DEFAULT_TEXT_SCALE,
        SELECTED_TEXT_SCALE,
        DEFAULT_TEXT_SCALE
      ],
      extrapolate: 'clamp'
    });

    return (
      <View style={styles.row}>
        <Animated.Text style={[
          styles.rowLabel,
          item.available === false && styles.disabledRow,
          { transform: [ { scaleX: fontSize }, { scaleY: fontSize } ] }
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
    const { data } = this.props;

    if (!data.length) {
      return data;
    }

    const currentCount = this.state.page * this.perPage;
    const dataForRender = data.length > currentCount
      ? data.slice(0, currentCount)
      : data;

    return [
      {
        id: 'empty-start',
        label: ''
      }
    ].concat(
      dataForRender,
      {
        id: 'empty-end',
        label: ''
      }
    );
  };

  /**
    * @description Increment page to add more data for list rendering
    */
  incrementPage = () => {
    this.setState({ page: this.state.page + 1 });
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
      this.listView._component.scrollToIndex({ index: index });
    }

    this.lastSelectedIndex = index;
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
    if (this.state.page * this.perPage < i) {
      const neededPage = Math.ceil(i / this.perPage);
      this.setState({ page: neededPage }, () => this.selectToItem(i));

      return;
    }

    const { data } = this.props;
    this.lastSelectedIndex = i;

    if (data[this.lastSelectedIndex] && data[this.lastSelectedIndex].available === false) {
      data.length - 1 > this.lastSelectedIndex
        ? this.lastSelectedIndex++
        : this.lastSelectedIndex--;
      this.handleRowChange(this.lastSelectedIndex);
    }

    // setTimeout needed because on android scroll is missing at component mounting
    setTimeout(() => this.listView._component.scrollToIndex({ index: this.lastSelectedIndex }), 10);
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
