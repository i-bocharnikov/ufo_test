import { Platform } from 'react-native'
import moment from "moment";
import "moment-timezone";
import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist'
import _ from 'lodash'

import { getFromApi } from '../utils/api'
import { dateFormats } from '../utils/global'

const DEBUG = false

const RENTAL_STATUS = {
    CONFIRMED: 'confirmed',
    ONGOING: 'ongoing',
    CLOSED: 'closed',
}


class Location {
    @persist @observable reference = null
    @persist @observable name = null
    @persist @observable address = null
    @persist @observable latitude = null
    @persist @observable longitude = null
    @persist @observable image_url = null
    @persist @observable message = null
    @persist @observable description = null
    @persist @observable description_url = null
    @persist @observable timezone = null
}

class CarModel {
    @persist @observable reference = null
    @persist @observable name = null
    @persist @observable manufacturer = null
    @persist @observable production_year = null
    @persist @observable image_front_url = null
    @persist @observable image_side_url = null
    @persist @observable image_top_h_url = null
    @persist @observable image_top_v_url = null
    @persist @observable description = null
    @persist @observable description_url = null
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
    @persist @observable rental_can_begin = false
    @persist @observable car_found = false
    @persist @observable initial_inspection_done = false
    @persist @observable contract_signed = false
    @persist @observable ready_for_return = false
    @persist @observable return_late = false
    @persist @observable final_inspection_done = false
    @persist @observable contract_ended = false
    @persist @observable message_for_driver = null
    @persist @observable start_at = null
    @persist @observable end_at = null
    @persist('object', Location) @observable location = new Location
    @persist('object', Car) @observable car = new Car
    @persist('object', Term) @observable rental_agreement = new Term
}


class rentalStore {

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

    @computed get emergencyNumber() {
        if (this.index === null || this.rental === null) {
            return null
        }
        return this.rental.car.support_number
    }

    @computed get rental() {
        if (this.index === null) {
            return null
        }
        if (this.index < 0 || this.index >= this.rentals.length) {
            return null
        }
        return this.rentals[this.index]
    }



    @computed get hasRentalConfirmedOrOngoing() {
        return this.rentals.find(rental => { return rental.status === RENTAL_STATUS.CONFIRMED || rental.status === RENTAL_STATUS.ONGOING }) !== null
    }

    @computed get hasRentalConfirmed() {
        return this.rentals.find(rental => { return rental.status === RENTAL_STATUS.CONFIRMED }) !== null
    }

    @computed get hasRentalOngoing() {
        return this.rentals.find(rental => { return rental.status === RENTAL_STATUS.ONGOING }) !== null
    }

    @action
    async reset() {
        return await this.listRentals()
    }

    @action
    async listRentals() {

        const response = await getFromApi("/rentals");
        if (response && response.status === "success") {
            if (DEBUG)
                console.info("rentalStore.list:", response.data);
            this.rentals = []
            this.rentals = this.rentals.concat(response.data.closed_rentals)
            this.rentals = this.rentals.concat(response.data.ongoing_rentals)
            this.rentals = this.rentals.concat(response.data.confirmed_rentals)
            if (!_.isEmpty(response.data.ongoing_rentals)) {
                this.index = response.data.closed_rentals.length
            } else if (!_.isEmpty(response.data.confirmed_rentals)) {
                this.index = response.data.closed_rentals.length + response.data.ongoing_rentals.length
            } else if (!_.isEmpty(response.data.closed_rentals)) {
                this.index = 0
            } else {
                this.index = null
            }
            return true
        }
        return false
    };

    @action
    async getRental() {

        const response = await getFromApi("/rentals/" + this.rental.reference);
        if (response && response.status === "success") {
            if (DEBUG)
                console.info("rentalStore.getRental:", response.data);
            this.rentals[this.index] = response.data.rental
            return true
        }
        return false
    };
}

export default rentalStore = new rentalStore();



