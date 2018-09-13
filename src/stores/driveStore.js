import { Platform } from 'react-native'
import moment from "moment";
import "moment-timezone";
import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist'
import _ from 'lodash'

import { getFromApi } from '../utils/api'
import { dateFormats } from '../utils/global'

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
    @persist('object', CarModel) @observable car_model = new CarModel
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
    @persist('object', Location) @observable location = new Location
    @persist('object', Car) @observable car = new Car
    @persist('object', Term) @observable rental_agreement = new Term
}



class driveStore {

    @persist('list', Rental) @observable confirmed_rentals = []
    @persist('list', Rental) @observable ongoing_rentals = []
    @persist('list', Rental) @observable closed_rentals = []
    @persist('list', Rental) @observable rentals = []
    @persist @observable index = -1
    @persist('object', Key) @observable key = null


    format(date, format) {
        if (!date)
            return ""
        let timezone = this.rental.location.timezone
        if (timezone)
            return moment(date).tz(timezone).format(format)
        else
            return moment(date).format(format)
    }

    @computed get rental() {
        if (this.index < 0 || this.index > this.rentals.length) {
            throw new error("INVALID STATE")
        }


        if (this.index >= 0) {
            return this.rentals[this.index]
        }
        return new Rental
    }


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
            this.rentals = []
            this.rentals = this.rentals.concat(this.closed_rentals)
            this.rentals = this.rentals.concat(this.ongoing_rentals)
            this.rentals = this.rentals.concat(this.confirmed_rentals)
            if (!_.isEmpty(this.ongoing_rentals)) {
                this.index = this.closed_rentals.length
            } else if (!_.isEmpty(this.confirmed_rentals)) {
                this.index = this.closed_rentals.length + this.ongoing_rentals.length
            } else if (!_.isEmpty(this.closed_rentals)) {
                this.index = 0
            } else {
                this.index = null
            }
            return true
        }
        return false
    };

    @action
    async refresh() {

        const response = await getFromApi("/rentals/" + this.rental.reference);
        if (response && response.status === "success") {
            console.info("driveStore.refresh:", response.data);
            this.rentals[this.index] = response.data.rental
            return true
        }
        return false
    };





}

export default driveStore = new driveStore();



