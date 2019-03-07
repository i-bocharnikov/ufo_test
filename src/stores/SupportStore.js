import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist';
import _ from 'lodash';

import { getFromApi } from './../utils/api_deprecated';

class Guide {
  @persist @observable reference = null;
  @persist @observable title = null;
  @persist @observable media_type = null;
  @persist @observable media_url = null;
  @persist @observable text = null;
  @persist @observable priority = null;
}

class GuideCategory {
  @persist @observable reference = null;
  @persist @observable name = null;
  @persist @observable priority = null;
  @persist('list', Guide) @observable faqs = [];
}

export default class SupportStore {
  @persist('list', GuideCategory) @observable guideCategories = [];
  @observable chosenCategoryRef = null;
  @observable chosenGuide = null;

  /*
   * @description Get list of filtred guides
   */
  @computed
  get guideList() {
    if (this.chosenCategoryRef) {
      const category = _.find(this.guideCategories, [ 'reference', this.chosenCategoryRef ]);
      return _.get(category, 'faqs', []);
    }

    /* if category wasn't cosen return guides from all categories */
    return this.guideCategories.reduce((arr, item) => [ ...arr, ...item.faqs ], []);
  }

  /*
   * @returns {boolean}
   * @description Fetch list of guides from server
   */
  @action
  fetchGuides = async () => {
    const response = await getFromApi('/faqs');

    if (response && response.status === 'success') {
      this.guideCategories = response.data.faq_categories;
      return true;
    }

    return false;
  };
}
