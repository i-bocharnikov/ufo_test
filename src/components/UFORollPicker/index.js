import React, { PureComponent } from 'react';
import { FlatList, Text, View, Animated, ViewPropTypes } from 'react-native';
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
    const { flatListProps, wrapperStyles } = this.props;

    return (
      <View
        style={[ styles.wrapper, wrapperStyles ]}
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
          initialNumToRender={4}
          {...flatListProps}
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
    this.setState({ layoutOffsetY: y });
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
    }

    if (this.listView) {
      index < this.props.data.length
        ? this.listView.scrollToIndex({ index: index, animated: false })
        : this.listView.scrollToEnd({ animated: false });
    }

    if (this.props.onRowChange) {
      this.props.onRowChange(index);
    }
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
    * @param {i} number
    * @description move to item which was selected optional
    */
  selectToItem = i => {
    let index = i;

    if (this.props.data[index] && this.props.data[index].available === false) {
      this.props.data.length - 1 > index ? index++ : index--;
    }

    if (this.listView) {
      index < this.props.data.length
       ? this.listView.scrollToIndex({ index: index, animated: false })
       : this.listView.scrollToEnd({ animated: false });
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
