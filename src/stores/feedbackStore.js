import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import { getFromApi, postToApi } from './../utils/api';

export default class FeedbackStore {

  @observable isLoading = false;
  @observable reserveFeedBack = null;

  /*
   * Get options for feedback at last booking step
  */
  @action
  getReserveFeedbackData = async () => {
    this.isLoading = true;
    const response = await getFromApi('/feedbacks?context=reserve', true);
    this.isLoading = false;

    if (!response.isSuccess || !_.has(response, 'data.feedback.choices')) {
      return;
    }

    const data = response.data.feedback;
    // set default choice if not exist
    if (!_.find(data.choices, [ 'value', true ])) {
      data.choices.forEach((item, i) => {
        item.value = i === 0 ? true : false;
      });
    }

    this.reserveFeedBack = data;
  };

  /*
   * Send feedback, return request status
   * @returns {boolean}
  */
  @action
  sendReserveFeedback = async () => {
    if (!this.reserveFeedBack) {
      return false;
    }

    this.isLoading = true;
    const response = await postToApi('/feedbacks?context=reserve', this.reserveFeedBack, true);
    this.isLoading = false;

    return response.isSuccess;
  };
}
