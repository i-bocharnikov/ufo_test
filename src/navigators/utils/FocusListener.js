import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

class FocusListener extends PureComponent {
  subscriptions = [];

  componentDidMount() {
    const { navigation, onFocus, onBlur } = this.props;

    this.subscriptions = [
      navigation.addListener('didFocus', onFocus),
      navigation.addListener('willBlur', onBlur)
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.remove());
  }

  render() {
    return null;
  }
}

FocusListener.defaultProps = {
  onFocus: () => null,
  onBlur: () => null
};

FocusListener.propTypes = {
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

export default withNavigation(FocusListener);
