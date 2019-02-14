import moment from 'moment';
import 'moment-timezone';
import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

import { getFromApi } from './../utils/api_deprecated';
import remoteLoggerService from '../utils/remoteLoggerService';

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

export default class SupportStore {
  @persist('list', FaqCategory) @observable faqCategories = [];

  async getFaq(faqCategoryReference, faqReference) {
    const category = this.faqCategories.find(
      item => item.reference === faqCategoryReference
    );

    if (!category) {
      return null;
    }

    const faq = category.faqs.find(item => item.reference === faqReference);
    await remoteLoggerService.info(
      'getFaq',
      `FAQ-${faq.reference}-${faq.title}`,
      faq
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
