import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import { getFromApi, putToApi } from './../utils/api_deprecated';
import { driveStore } from './';

class Term {
  @persist @observable reference = null;
  @persist @observable name = null;
  @persist @observable type = null;
  @persist @observable html = null;
}

export default class termStore {
  @observable term = new Term();

  @action
  async getRentalAgreement() {
    if (!driveStore.rental) {
      return false;
    }

    const response = await getFromApi('/terms/' + driveStore.rental.reference);

    if (response && response.status === 'success') {
      this.term = response.data.term;
      return true;
    }

    return false;
  }

  @action
  async signRentalAgreement() {
    if (!driveStore.rental) {
      return false;
    }
    if (!this.term || !this.term.name) {
      await driveStore.refreshRental();
      return false;
    }
    const body = { term: this.term, action: 'contract_signed' };
    const response = await putToApi(
      `/rentals/${driveStore.rental.reference}`,
      body
    );

    if (response && response.status === 'success') {
      await driveStore.refreshRental();
      this.term = new Term();
      return true;
    }

    return false;
  }
}
