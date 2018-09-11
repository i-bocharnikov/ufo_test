import { Platform } from 'react-native'
import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist'
import _ from 'lodash'

import { getFromApi } from '../utils/api'


class Location {
    @persist @observable reference = null
    @persist @observable name = null
    @persist @observable address = null
    @persist @observable latitude = null
    @persist @observable longitude = null
    @persist @observable image_urn = null
    @persist @observable message = null
    @persist @observable description = null
    @persist @observable description_urn = null
    @persist @observable timezone = null
}

class CarModel {
    @persist @observable reference = null
    @persist @observable name = null
    @persist @observable manufacturer = null
    @persist @observable production_year = null
    @persist @observable image_front_urn = null
    @persist @observable image_side_urn = null
    @persist @observable image_top_h_urn = null
    @persist @observable image_top_v_urn = null
    @persist @observable description = null
    @persist @observable description_urn = null
}


class Car {
    @persist @observable reference = null
    @persist('object', CarModel) @observable car_model = null
    @persist @observable damage_state = null
    @persist @observable key_mode = null
    @persist @observable has_key = null
    @persist @observable support_number = null
    @persist @observable chassis_number = null

}

class Term {
    @persist @observable reference = null
    @persist @observable html = null
}

class Key {
    @persist @observable keyId = null
    @persist @observable begin_date = null
    @persist @observable end_date = null
}

class Rental {
    @persist @observable reference = null
    @persist @observable status = null
    @persist @observable rental_can_begin = null
    @persist @observable car_found = null
    @persist @observable initial_inspection_done = null
    @persist @observable contract_signed = null
    @persist @observable ready_for_return = null
    @persist @observable return_late = null
    @persist @observable final_inspection_done = null
    @persist @observable contract_ended = null
    @persist @observable message_for_driver = null
    @persist @observable start_at = null
    @persist @observable end_at = null
    @persist('object', Location) @observable location = null
    @persist('object', Car) @observable car = null
    @persist('object', Term) @observable rental_agreement = null
}



class driveStore {

    @observable confirmed_rentals = []
    @observable ongoing_rentals = []
    @observable closed_rentals = []
    @persist('object', Rental) @observable rental = new Rental
    @persist('object', Key) @observable key = null

    @computed get hasRentalConfirmedOrOngoing() {
        return this.ongoing_rentals.length !== 0 || this.confirmed_rentals.length !== 0
    }

    @computed get hasRentalConfirmed() {
        return this.ongoing_rentals.length !== 0
    }

    @computed get hasRentalOngoing() {
        return this.confirmed_rentals.length !== 0
    }

    @action
    async reset() {
        await this.list()
    }

    @action
    async list() {

        const response = await getFromApi("/rentals");
        if (response && response.status === "success") {
            console.info("driveStore.list:", response.data);
            this.confirmed_rentals = response.data.confirmed_rentals
            this.ongoing_rentals = response.data.ongoing_rentals
            this.closed_rentals = response.data.closed_rentals

            if (!_.isEmpty(this.ongoing_rentals)) {
                this.rental = this.ongoing_rentals[0]
                this.key = { keyId: this.rental.key_id }
            } else if (!_.isEmpty(this.confirmed_rentals)) {
                this.rental = this.confirmed_rentals[0]
                this.key = { keyId: this.rental.key_id }
            } else if (!_.isEmpty(this.closed_rentals)) {
                this.rental = this.closed_rentals[0]
                this.key = { keyId: this.rental.key_id }
            } else {
                this.rental = null
            }
            return true
        }
        return false
    };


}

export default driveStore = new driveStore();



