import { Platform } from 'react-native'
import moment from "moment";
import "moment-timezone";
import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist'
import _ from 'lodash'

import { getFromApi } from '../utils/api'


class FaqCategory {
    @persist @observable reference = null
    @persist @observable name = null
    @persist @observable priority = null
    @observable expanded = false
    @persist('list', Faq) @observable faqs = []
}

class Faq {
    @persist @observable reference = null
    @persist @observable title = null
    @persist @observable media_type = null
    @persist @observable media_urn = null
    @persist @observable text = null
    @persist @observable priority = null
}



class supportStore {

    @persist('list', FaqCategory) @observable faqCategories = []

    /*     getListFor(context) {
            let index = _.findIndex(this.faqCategories, faqCategory => faqCategory.reference = context)
            if (index >= 0 && index < this.faqCategories.length) {
                let removedFaqCategories = _.pullAt(this.faqCategories, index)
                return _.concat(removedFaqCategories, this.faqCategories)
            }
            return this.faqCategories
        }
     */
    @action
    async list() {

        const response = await getFromApi("/faqs");
        if (response && response.status === "success") {
            console.info("supportStore.list:", response.data);
            this.faqCategories = response.data.faq_categories
            return true
        }
        return false
    };
}

export default supportStore = new supportStore();



