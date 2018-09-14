import { Platform } from 'react-native'
import moment from "moment";
import "moment-timezone";
import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist'
import _ from 'lodash'

import { getFromApi } from '../utils/api'
import { dateFormats } from '../utils/global'

const RENTAL_STATUS = {
    CONFIRMED: 'confirmed',
    ONGOING: 'ongoing',
    CLOSED: 'closed',
}
const GUIDE_TYPE = {
    FIND: 'location_find',
    RETURN: 'location_return',
}

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

class Guide {
    @persist @observable reference = null
    @persist @observable type = null
    @persist @observable priority = null
    @persist @observable title = null
    @persist @observable description = null
    @persist @observable media_type = null
    @persist @observable media_urn = null
}

class GuidePack {
    @persist @observable type = null
    @persist @observable locationReference = null
    @persist('list', Guide) @observable guides = []
}


class driveStore {

    @persist('list', Rental) @observable rentals = []
    @persist @observable index = -1
    @persist('object', Key) @observable key = null
    @persist('list', Guide) @observable guidePacks = []


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
        if (this.index < 0 || this.index > this.rentals.length) {
            throw new error("INVALID STATE")
        }
        if (this.index >= 0) {
            return this.rentals[this.index]
        }
        return new Rental
    }

    @computed get findGuides() {
        if (this.guidePacks === null || this.rental) {
            return []
        }
        let guidePack = this.guidePacks.find(guidePack => { return guidePack.type === GUIDE_TYPE.FIND && guidePack.locationReference === this.rental.location.reference })
        if (guidePack) {
            return []
        }
        return this.guidePacks.guides
    }

    @computed get returnGuides() {
        if (this.guidePacks === null || this.rental) {
            return []
        }
        let guidePack = this.guidePacks.find(guidePack => { return guidePack.type === GUIDE_TYPE.RETURN && guidePack.locationReference === this.rental.location.reference })
        if (guidePack) {
            return []
        }
        return this.guidePacks.guides
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
        return await this.listRental()
    }

    @action
    async listRental() {

        const response = await getFromApi("/rentals");
        if (response && response.status === "success") {
            console.info("driveStore.list:", response.data);
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
            console.info("driveStore.getRental:", response.data);
            this.rentals[this.index] = response.data.rental
            return true
        }
        return false
    };

    @action
    async listGuides(guideType, locationReference) {

        const response = await getFromApi("/guides" + guideType + "/" + locationReference);
        if (response && response.status === "success") {
            console.info("driveStore.listGuides:", response.data);
            let guidePack = this.guidePacks.find(guidePack => { return guidePack.type === guideType && guidePack.locationReference === locationReference })
            if (guidePack === null) {
                this.guidePacks.push({
                    type: guideType,
                    locationReference: locationReference,
                })
            }
            guidePack.guides = response.data.guides
            return true
        }
        return false
    };








}

export default driveStore = new driveStore();



