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

    this.reserveFeedBack = response.data.feedback;
  };

  /*
   * Choose option handler
  */
  @action
  chooseReserveOption = choiceRef => {
    if (!this.reserveFeedBack) {
      return;
    }

    const isMultiSelect = this.reserveFeedBack.multiSelectionAllowed;
    this.reserveFeedBack.choices.forEach(item => {
      if (isMultiSelect) {
        item.value = item.reference === choiceRef ? !item.value : item.value;
      } else {
        item.value = item.reference === choiceRef ? true : false;
      }
    });
  };

  /*
   * Input custom answer
  */
  @action
  inputReserveOption = (choiceRef, value) => {
    if (!this.reserveFeedBack) {
      return;
    }

    this.reserveFeedBack.choices.some(item => {
      if (item.reference === choiceRef) {
        item.value = value;
        return true;
      }
    });
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
