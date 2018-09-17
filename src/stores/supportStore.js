import { Platform } from 'react-native'
import moment from "moment";
import "moment-timezone";
import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist'
import _ from 'lodash'

import { getFromApi } from '../utils/api'

const DEBUG = false

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
    @persist @observable media_url = null
    @persist @observable text = null
    @persist @observable priority = null


}

class supportStore {

    @persist('list', FaqCategory) @observable faqCategories = []

    getFaq(faqCategoryReference, faqReference) {
        let faqCategory = this.faqCategories.find(faqCategory => { return faqCategory.reference === faqCategoryReference })
        if (faqCategory) {
            return faqCategory.faqs.find(faq => { return faq.reference === faqReference })
        } else {
            return null
        }
    }

    hasImage(faq) {
        return faq.media_type === 'image'
    }
    hasVideo(faq) {
        return faq.media_type === 'video'
    }

    @action
    async reset() {
        return await this.list()
    }

    @action
    async list() {

        const response = await getFromApi("/faqs");
        if (response && response.status === "success") {
            if (DEBUG)
                console.info("supportStore.list:", response.data);
            this.faqCategories = response.data.faq_categories
            return true
        }
        return false
    };
}

export default supportStore = new supportStore();



