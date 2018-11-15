import React, { PureComponent } from 'react';
import {
  Modal,
  View,
  Text,
  ViewPropTypes,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import PropTypes from 'prop-types';

import styles, { TAIL_SIZE, TAIL_INDENT } from './styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default class UFOTooltip extends PureComponent {
  constructor() {
    super();
    this.state = {
      isVisible: false,
      measures: null
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isVisible && prevProps.isVisible) {
      this.setState({isVisible: false, measures: null});
      return;
    }

    if (this.props.isVisible && !prevProps.isVisible) {
      this.setTooltipPosition();
    }
  }

  render() {
    const { children, onClose, backgroundColor } = this.props;
    const { isVisible, measures } = this.state;

    return (
      <Modal
        transparent={true}
        visible={isVisible}
        onRequestClose={() => null}
      >
        <TouchableOpacity
          style={styles.wrapper}
          onPress={onClose}
          activeOpacity={1}
        >
          <View style={[
            styles.container,
            backgroundColor && { backgroundColor },
            measures && this.getToltipAbsoluteStyles()
          ]}>
            <Text style={styles.label}>
              {children}
            </Text>
            <View style={[styles.tail, this.getTailPositionStyles()]} />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  setTooltipPosition = () => {
    if (!this.props.originBtn) {
      this.setState({isVisible: true});
      return;
    }

    this.props.originBtn.measureInWindow((x, y, width, height) => {
      this.setState({
        isVisible: true,
        measures: { x, y, width, height }
      });
    });
  };

  getToltipAbsoluteStyles = () => {
    const measures = this.state.measures;
    const styleMixin = {};
    const middleY = measures.y + measures.height / 2;
    const middleX = measures.x + measures.width / 2;

    if (SCREEN_HEIGHT > middleY * 2) {
      // if tooltip in top part of the screen
      styleMixin.top = measures.y + measures.height + TAIL_SIZE / 2;
    } else {
      // if tooltip in bottom part of the screen
      styleMixin.bottom = SCREEN_HEIGHT - measures.y + TAIL_SIZE / 2 - STATUS_BAR_HEIGHT;
    }

    if (SCREEN_WIDTH / 3 > middleX) {
      // if tooltip in left part of the screen
      styleMixin.left = measures.x - TAIL_INDENT - TAIL_SIZE / 2;
    } else if (SCREEN_WIDTH / 3 < middleX && SCREEN_WIDTH > middleX * 1.5) {
      // if tooltip in central part of the screen
      styleMixin.alignSelf = 'center';
      const translateX = measures.x + measures.width / 2 - SCREEN_WIDTH / 2;
      styleMixin.transform = [{ translateX }];
    } else {
      // if tooltip in right part of the screen
      styleMixin.right = SCREEN_WIDTH - measures.x - measures.width / 2 - TAIL_INDENT - TAIL_SIZE / 2;
    }

    return {
      position: 'absolute',
      ...styleMixin
    };
  };

  getTailPositionStyles = () => {
    const measures = this.state.measures;

    if (!measures) {
      return null;
    }

    const tailStyles = [];
    const middleY = measures.y + measures.height / 2;
    const middleX = measures.x + measures.width / 2;

    if (SCREEN_HEIGHT > middleY * 2) {
      // if tooltip in top part of the screen
      tailStyles.push(styles.tailTop);
    } else {
      // if tooltip in bottom part of the screen
      tailStyles.push(styles.tailBottom);
    }

    if (SCREEN_WIDTH / 3 > middleX) {
      // if tooltip in left part of the screen
      tailStyles.push(styles.tailLeft);
    } else if (SCREEN_WIDTH / 3 < middleX && SCREEN_WIDTH > middleX * 1.5) {
      // if tooltip in central part of the screen
      tailStyles.push(styles.tailCenter);
    } else {
      // if tooltip in right part of the screen
      tailStyles.push(styles.tailRight);
    }

    return tailStyles;
  };
}

UFOTooltip.propTypes = {
  children: PropTypes.node,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  backgroundColor: PropTypes.string
};
