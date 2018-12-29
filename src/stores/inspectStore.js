import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import _ from 'lodash';

import { getFromApi, postToApi, uploadToApi, putToApi } from '../utils/api_deprecated';
import { driveStore } from './';

const DEBUG = false;

class CarDamage {
  @persist @observable reference = null;
  @persist @observable status = null;
  @persist @observable comment = '';
  @persist @observable relative_position_x = null;
  @persist @observable relative_position_y = null;
  @persist @observable document_reference = null;
}

export default class InspectStore {
  constructor() {}

  @observable carDamages = [];

  @observable relativePositionX = 0.5;
  @observable relativePositionY = 0.5;
  @observable documentUri = null;
  @observable documentReference = null;
  @observable comment = 'Description of the damage';

  @action
  async listCarDamages() {
    if (!driveStore.rental) {return false;}

    const response = await getFromApi('/car_damages/' + driveStore.rental.reference);
    if (response && response.status === 'success') {
      if (DEBUG) {console.info('driveStore.listCarDamages:', response.data);}
      this.carDamages = response.data.car_damages;
      return true;
    }
    return false;
  }

  @action
  async addCarDamage() {
    if (!driveStore.rental) {return false;}

    const body = {
      car_reference: driveStore.rental.car.reference,
      document_reference: this.documentReference,
      comment: this.comment,
      relative_position_x: this.relativePositionX,
      relative_position_y: this.relativePositionY
    };

    const response = await postToApi('/car_damages/' + driveStore.rental.reference, body);
    if (response && response.status === 'success') {
      if (DEBUG) {console.info('driveStore.addCarDamage:', response.data);}
      this.carDamages = [ response.data.car_damage, ...this.carDamages ];
      this.relativePositionX = 0.5;
      this.relativePositionY = 0.5;
      this.documentUri = null;
      this.documentReference = null;
      this.comment = 'Description of the damage';
      return true;
    }
    return false;
  }

  @action
  async uploadDamageDocument() {
    const response = await uploadToApi(
      'car_damage',
      'one_side',
      'car_damage',
      'front_side',
      this.documentUri
    );
    if (response && response.status === 'success') {
      if (DEBUG) {console.info('inspectStore.uploadDamageDocument:', response.data);}
      this.documentReference = response.data.document.reference;
      return true;
    }
    return false;
  }

  @action
  async confirmInitialInspection(t) {
    if (!driveStore.rental) {return false;}

    const response = await putToApi('/rentals/' + driveStore.rental.reference, { action: 'initial_inspection_done' });
    if (response && response.status === 'success') {
      if (DEBUG) {console.info('inspectStore.confirmInitialInspection:', response.data);}
      driveStore.rentals[driveStore.index] = response.data.rental;
      console.log('***** inspectStore.doConfirmInitialInspection ', true);
      return true;
    }
    return false;
  }

  @action
  async confirmFinalInspection(t) {
    if (!driveStore.rental) {return false;}

    const response = await putToApi('/rentals/' + driveStore.rental.reference, { action: 'final_inspection_done' });
    if (response && response.status === 'success') {
      if (DEBUG) {console.info('inspectStore.confirmFinalInspection:', response.data);}
      driveStore.rentals[driveStore.index] = response.data.rental;
      console.log('***** inspectStore.confirmFinalInspection ', true);
      return true;
    }
    return false;
  }
}
