import React, { PureComponent, Fragment } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import { UFOIcon } from './../common';
import styles from './styles';

export default class UFOSubHeader extends PureComponent {
  render() {
    const { subHeader, steps } = this.props;

    return (
      <View style={[
        styles.subHeader,
        styles.headerShadow,
        subHeader && styles.subHeaderBasic,
        steps && styles.subHeaderSteps
      ]}>
        {subHeader && this.renderBasicContent()}
        {steps && this.renderSteps()}
      </View>
    );
  }

  renderBasicContent = () => (
    <Text style={styles.subHeaderLabel}>
      {this.props.subHeader.toUpperCase()}
    </Text>
  );

  renderSteps = () => {
    const { currentStep, stepLabels = [] } = this.props.steps;

    return stepLabels.map((label, i, arr) => (
      <Fragment key={`fragment-${i}${label}`}>
        <Text
          key={`label-${i}${label}`}
          style={[
            styles.subHeaderLabel,
            styles.subHeaderStep,
            currentStep > (i + 1) && styles.subHeaderPastStep,
            currentStep < (i + 1) && styles.subHeaderFutureStep
          ]}
        >
          {`${i + 1}. ${label.toUpperCase()}`}
        </Text>
        {arr.length > (i + 1) && (
          <UFOIcon
            key={`icon-${i}${label}`}
            name="chevron-thin-right"
            iconPack="Entypo"
            style={[
              styles.subHeaderLabel,
              styles.subHeaderStepIcon,
              currentStep < (i + 2) && styles.subHeaderFutureStep
            ]}
          />
        )}
      </Fragment>
    ));
  };
}

UFOSubHeader.propTypes = {
  subHeader: PropTypes.string,
  steps: PropTypes.shape({
    // steps start from '1'
    currentStep: PropTypes.number.isRequired,
    stepLabels: PropTypes.arrayOf(PropTypes.string).isRequired
  })
};
