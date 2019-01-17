import { Platform } from 'react-native';
import moment from 'moment';
import 'moment-timezone';
import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist';
import _ from 'lodash';

import { getFromApi, putToApi } from '../utils/api_deprecated';
import { dateFormats, actionStyles, icons } from '../utils/global';

const DEBUG = false;

const RENTAL_STATUS = {
  CONFIRMED: 'confirmed',
  ONGOING: 'ongoing',
  CLOSED: 'closed'
};

class Location {
  @persist @observable reference = null;
  @persist @observable name = null;
  @persist @observable address = null;
  @persist @observable latitude = null;
  @persist @observable longitude = null;
  @persist @observable image_url = null;
  @persist @observable message = null;
  @persist @observable description = null;
  @persist @observable description_url = null;
  @persist @observable timezone = null;
}

class CarModel {
  @persist @observable reference = null;
  @persist @observable name = null;
  @persist @observable manufacturer = null;
  @persist @observable production_year = null;
  @persist @observable image_front_url = null;
  @persist @observable image_side_url = null;
  @persist @observable image_top_h_url = null;
  @persist @observable image_top_v_url = null;
  @persist @observable description = null;
  @persist @observable description_url = null;
}

class Car {
  @persist @observable reference = null;
  @persist('object', CarModel) @observable car_model = new CarModel();
  @persist @observable damage_state = null;
  @persist @observable key_mode = null;
  @persist @observable has_key = null;
  @persist @observable support_number = null;
  @persist @observable chassis_number = null;
}

class Term {
  @persist @observable reference = null;
  @persist @observable html = null;
}

class Rental {
  @persist @observable reference = null;
  @persist @observable status = null;
  @persist @observable rental_can_begin = false;
  @persist @observable car_found = false;
  @persist @observable initial_inspection_done = false;
  @persist @observable contract_signed = false;
  @persist @observable ready_for_return = false;
  @persist @observable return_late = false;
  @persist @observable final_inspection_done = false;
  @persist @observable contract_ended = false;
  @persist @observable message_for_driver = null;
  @persist @observable start_at = null;
  @persist @observable end_at = null;
  @persist('object', Location) @observable location = new Location();
  @persist('object', Car) @observable car = new Car();
  @persist('object', Term) @observable rental_agreement = new Term();
  @persist @observable key_id = null;
}

export default class DriveStore {
  constructor() {}

  @persist('list', Rental) @observable rentals = [];
  @persist @observable index = -1;

  format(date, format) {
    if (!date) {
      return '';
    }

    const timezone =
      this.rental && this.rental.location
        ? this.rental.location.timezone
        : 'UTC';

    if (timezone) {
      return moment(date)
        .tz(timezone)
        .format(format);
    } else {
      return moment(date).format(format);
    }
  }

  @computed get rental() {
    if (this.index === null) {
      return null;
    }
    if (this.index < 0 || this.index >= this.rentals.length) {
      return null;
    }
    return this.rentals[this.index];
  }

  @computed get emergencyNumber() {
    if (
      this.index === null ||
      this.rental === null ||
      this.rental.car === null
    ) {
      return null;
    }
    if (!this.hasRentalOngoing) {
      return null;
    }

    return this.rental.car.support_number;
  }

  @computed get hasRentals() {
    return this.rentals.length !== 0;
  }

  @computed get hasRentalConfirmedOrOngoing() {
    return this.rentals.find(
      rental =>
        rental.status === RENTAL_STATUS.CONFIRMED ||
        rental.status === RENTAL_STATUS.ONGOING
    );
  }

  @computed get hasRentalConfirmed() {
    return this.rentals.find(rental => {
      return rental.status === RENTAL_STATUS.CONFIRMED;
    });
  }

  @computed get hasRentalOngoing() {
    return this.rentals.find(rental => {
      return rental.status === RENTAL_STATUS.ONGOING;
    });
  }

  @computed get inUse() {
    return (
      this.rental &&
      this.rental.status === RENTAL_STATUS.ONGOING &&
      this.rental.contract_signed &&
      !this.rental.contract_ended
    );
  }

  computeActionFind(actions, onPress) {
    if (
      !this.rental ||
      (this.rental.status !== RENTAL_STATUS.ONGOING &&
        this.rental.status !== RENTAL_STATUS.CONFIRMED) ||
      this.rental.contract_signed
    ) {
      return;
    }
    actions.push({
      style:
        this.rental.car_found || this.rental.initial_inspection_done
          ? actionStyles.ACTIVE
          : actionStyles.DONE,
      icon: icons.FIND,
      onPress: onPress
    });
  }
  computeActionInitialInspect(actions, onPress) {
    if (
      !this.rental ||
      (this.rental.status !== RENTAL_STATUS.ONGOING &&
        this.rental.status !== RENTAL_STATUS.CONFIRMED) ||
      this.rental.contract_signed
    ) {
      return;
    }
    actions.push({
      style:
        !this.rental.rental_can_begin ||
        this.rental.status !== RENTAL_STATUS.ONGOING
          ? actionStyles.DISABLE
          : this.rental.initial_inspection_done
          ? actionStyles.ACTIVE
          : actionStyles.TODO,
      icon: icons.INSPECT,
      onPress: onPress
    });
  }
  computeActionStartContract(actions, onPress) {
    if (
      !this.rental ||
      (this.rental.status !== RENTAL_STATUS.ONGOING &&
        this.rental.status !== RENTAL_STATUS.CONFIRMED) ||
      this.rental.contract_signed
    ) {
      return;
    }
    actions.push({
      style: !this.rental.rental_can_begin
        ? actionStyles.DISABLE
        : this.rental.initial_inspection_done
        ? this.rental.contract_signed
          ? actionStyles.DONE
          : actionStyles.TODO
        : actionStyles.DISABLE,
      icon: icons.RENTAL_AGREEMENT,
      onPress: onPress
    });
  }
  computeActionReturn(actions, onPress) {
    if (
      !this.rental ||
      this.rental.status !== RENTAL_STATUS.ONGOING ||
      !this.rental.contract_signed
    ) {
      return;
    }
    actions.push({
      style: this.rental.ready_for_return
        ? actionStyles.TODO
        : actionStyles.ACTIVE,
      icon: icons.WHERE,
      onPress: onPress
    });
  }
  computeActionFinalInspect(actions, onPress) {
    if (
      !this.rental ||
      (this.rental.status !== RENTAL_STATUS.ONGOING &&
        this.rental.status !== RENTAL_STATUS.CONFIRMED) ||
      !this.rental.contract_signed
    ) {
      return;
    }
    actions.push({
      style: this.rental.contract_ended
        ? actionStyles.DISABLE
        : this.rental.ready_for_return && !this.rentals.final_inspection_done
        ? actionStyles.TODO
        : actionStyles.ACTIVE,
      icon: icons.INSPECT,
      onPress: onPress
    });
  }
  computeActionCloseRental(actions, onPress) {
    if (
      !this.rental ||
      this.rental.status !== RENTAL_STATUS.ONGOING ||
      !this.rental.contract_signed
    ) {
      return;
    }
    actions.push({
      style: !this.rental.final_inspection_done
        ? actionStyles.DISABLE
        : this.rental.ready_for_return
        ? actionStyles.TODO
        : actionStyles.ACTIVE,
      icon: icons.CLOSE_RENTAL,
      onPress: onPress
    });
  }

  @action
  async reset() {
    return await this.listRentals();
  }

  @action
  async selectRental(index) {
    if (index === null) {
      return false;
    }
    if (index < 0 || index >= this.rentals.length) {
      return false;
    }
    this.index = index;
    return true;
  }

  @action
  async listRentals() {
    const response = await getFromApi('/rentals');
    if (response && response.status === 'success') {
      if (DEBUG) {
        console.info('driveStore.list:', response.data);
      }
      this.rentals = [];
      this.rentals = this.rentals.concat(response.data.closed_rentals);
      this.rentals = this.rentals.concat(response.data.ongoing_rentals);
      this.rentals = this.rentals.concat(response.data.confirmed_rentals);
      if (!_.isEmpty(response.data.ongoing_rentals)) {
        this.index = response.data.closed_rentals.length;
      } else if (!_.isEmpty(response.data.confirmed_rentals)) {
        this.index =
          response.data.closed_rentals.length +
          response.data.ongoing_rentals.length +
          response.data.confirmed_rentals.length -
          1;
      } else if (!_.isEmpty(response.data.closed_rentals)) {
        this.index = response.data.closed_rentals.length - 1;
      } else {
        this.index = null;
      }
      return true;
    }
    return false;
  }

  @action
  async refreshRental() {
    if (!this.rental) {
      return false;
    }

    const response = await getFromApi('/rentals/' + this.rental.reference);
    if (response && response.status === 'success') {
      if (DEBUG) {
        console.info('driveStore.getRental:', response.data);
      }
      this.rentals[this.index] = response.data.rental;
      return true;
    }
    return false;
  }

  @action
  async carFound() {
    if (!this.rental) {
      return false;
    }

    const response = await putToApi('/rentals/' + this.rental.reference, {
      action: 'car_found'
    });
    if (response && response.status === 'success') {
      if (DEBUG) {
        console.info('driveStore.carFound:', response.data);
      }
      this.rentals[this.index] = response.data.rental;
      return true;
    }
    return false;
  }

  @action
  async closeRental() {
    if (!this.rental) {
      return false;
    }

    const response = await putToApi('/rentals/' + this.rental.reference, {
      action: 'contract_ended'
    });
    if (response && response.status === 'success') {
      if (DEBUG) {
        console.info('driveStore.closeRental:', response.data);
      }
      this.rentals[this.index] = response.data.rental;
      return true;
    }
    return false;
  }

  rentalFaceValidation = async faceImgRef => {
    const response = await putToApi(
      `/rentals/${this.rental.reference}`,
      { action: 'capture_face', identification_face_capture_reference: faceImgRef }
    );

    if (response && response.status === 'success') {
      return true;
    }

    return false;
  };
}
