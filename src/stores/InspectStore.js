import { observable, action } from 'mobx';

import { getFromApi, postToApi, putToApi } from './../utils/api_deprecated';
import { driveStore } from './';

const DEBUG = false;

export default class InspectStore {
  constructor() {}

  @observable carDamages = [];

  @observable relativePositionX = 0.5;
  @observable relativePositionY = 0.5;
  @observable documentReference = null;
  @observable comment = 'Description of the damage';

  @action
  async listCarDamages() {
    if (driveStore.rental === null) {
      return false;
    }

    const response = await getFromApi(
      '/car_damages/' + driveStore.rental.reference
    );
    if (response && response.status === 'success') {
      if (DEBUG) {
        console.info('driveStore.listCarDamages:', response.data);
      }
      this.carDamages = response.data.car_damages;
      return true;
    }
    return false;
  }

  @action
  async addCarDamage() {
    if (!driveStore.rental) {
      return false;
    }

    const body = {
      car_reference: driveStore.rental.car.reference,
      document_reference: this.documentReference,
      comment: this.comment,
      relative_position_x: this.relativePositionX,
      relative_position_y: this.relativePositionY
    };

    const response = await postToApi(
      '/car_damages/' + driveStore.rental.reference,
      body
    );
    if (response && response.status === 'success') {
      if (DEBUG) {
        console.info('driveStore.addCarDamage:', response.data);
      }
      this.carDamages = [response.data.car_damage, ...this.carDamages];
      this.relativePositionX = 0.5;
      this.relativePositionY = 0.5;
      this.documentReference = null;
      this.comment = 'Description of the damage';
      return true;
    }
    return false;
  }

  @action
  async confirmInitialInspection() {
    if (!driveStore.rental) {
      return false;
    }

    const response = await putToApi('/rentals/' + driveStore.rental.reference, {
      action: 'initial_inspection_done'
    });
    if (response && response.status === 'success') {
      if (DEBUG) {
        console.info('inspectStore.confirmInitialInspection:', response.data);
      }
      driveStore.rentals[driveStore.index] = response.data.rental;
      return true;
    }
    return false;
  }

  @action
  async confirmFinalInspection() {
    if (!driveStore.rental) {
      return false;
    }

    const response = await putToApi('/rentals/' + driveStore.rental.reference, {
      action: 'final_inspection_done'
    });
    if (response && response.status === 'success') {
      if (DEBUG) {
        console.info('inspectStore.confirmFinalInspection:', response.data);
      }
      driveStore.rentals[driveStore.index] = response.data.rental;
      return true;
    }
    return false;
  }
}
