import { observable, action } from 'mobx';
import { persist } from 'mobx-persist'
import _ from 'lodash'

import { getFromApi, postToApi, uploadToApi, putToApi } from '../utils/api'
import driveStore from './driveStore';

const DEBUG = false

class Term {
    @persist @observable reference = null
    @persist @observable name = null
    @persist @observable type = null
    @persist @observable html = null
}

class termStore {

    @observable term = new Term


    @action
    async getRentalAgreement() {

        const response = await getFromApi("/terms/" + driveStore.rental.reference);
        if (response && response.status === "success") {
            if (DEBUG)
                console.info("termStore.getRentalAgreement:", response.data);
            this.term = response.data.term
            return true
        }
        return false
    };

    @action
    async signRentalAgreement() {

        let body = {
            term: this.term,
            action: 'contract_signed'

        }
        const response = await putToApi("/rentals/" + driveStore.rental.reference, body);
        if (response && response.status === "success") {
            if (DEBUG)
                console.info("termStore.signRentalAgreement:", response.data);
            this.term = new Term
            return true
        }
        return false
    };
}

export default termStore = new termStore();



