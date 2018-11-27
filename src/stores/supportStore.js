import moment from 'moment';
import 'moment-timezone';
import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import { getFromApi } from './../utils/api_deprecated';
import logger, { codeTypes, severityTypes } from './../utils/userActionsLogger';

class FaqCategory {
    @persist @observable reference = null;
    @persist @observable name = null;
    @persist @observable priority = null;
    @observable expanded = false;
    @persist('list', Faq) @observable faqs = [];
}

class Faq {
    @persist @observable reference = null;
    @persist @observable title = null;
    @persist @observable media_type = null;
    @persist @observable media_url = null;
    @persist @observable text = null;
    @persist @observable priority = null;
}

class supportStore {

    @persist('list', FaqCategory) @observable faqCategories = [];

    getFaq(faqCategoryReference, faqReference) {
        const category = this.faqCategories.find(item => item.reference === faqCategoryReference);

        if (!category) {
            return null;
        }

        const faq = category.faqs.find(item => item.reference === faqReference);
        logger(
            severityTypes.INFO,
            codeTypes.SUCCESS,
            'open faq reference action',
            `faq reference: ${faq.reference}`
        );

        return faq;
    }

    hasImage(faq) {
        return faq.media_type === 'image';
    }
    hasVideo(faq) {
        return faq.media_type === 'video';
    }

    @action
    async reset() {
        return await this.list();
    }

    @action
    async list() {
        const response = await getFromApi('/faqs');
        if (response && response.status === 'success') {
            this.faqCategories = response.data.faq_categories;
            return true;
        }
        return false;
    }
}

export default supportStore = new supportStore();
