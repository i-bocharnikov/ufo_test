import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist';
import _ from 'lodash';

import { driveStore } from './';
import { getFromApi } from '../utils/api_deprecated';

const GUIDE_TYPE = {
  FIND: 'location_find',
  RETURN: 'location_return'
};

class Guide {
  @persist @observable reference = null;
  @persist @observable type = null;
  @persist @observable priority = null;
  @persist @observable title = null;
  @persist @observable description = null;
  @persist @observable media_type = null;
  @persist @observable media_url = null;
}

class GuidePack {
  @persist @observable type = null;
  @persist @observable locationReference = null;
  @persist('list', Guide) @observable guides = [];
}

export default class GuideStore {
  constructor() {}

  @persist('list', Guide) @observable guidePacks = [];

  @computed get findGuides() {
    if (this.guidePacks === null || !driveStore.rental) {
      return [];
    }
    const guidePack = this.guidePacks.find(guidePack => {
      return (
        guidePack.type === GUIDE_TYPE.FIND &&
        guidePack.locationReference === driveStore.rental.location.reference
      );
    });

    if (!guidePack) {
      return [];
    }

    return guidePack.guides;
  }

  @computed get returnGuides() {
    if (this.guidePacks === null || !driveStore.rental) {
      return [];
    }
    const guidePack = this.guidePacks.find(guidePack => {
      return (
        guidePack.type === GUIDE_TYPE.RETURN &&
        guidePack.locationReference === driveStore.rental.location.reference
      );
    });
    if (!guidePack) {
      return [];
    }
    return guidePack.guides;
  }

  hasImage(guide) {
    return guide.media_type === 'image';
  }
  hasVideo(guide) {
    return guide.media_type === 'video';
  }

  @action
  async listFindGuides() {
    const guideType = GUIDE_TYPE.FIND;
    return await this.listGuides(guideType);
  }

  @action
  async listReturnGuides() {
    const guideType = GUIDE_TYPE.RETURN;
    return await this.listGuides(guideType);
  }

  @action
  async listGuides(guideType) {
    if (!driveStore.rental) {
      return false;
    }

    const locationReference = driveStore.rental.location.reference;
    const response = await getFromApi(`/guides/${guideType}/${locationReference}`);

    if (response && response.status === 'success') {
      const guidePackIndex = this.guidePacks.findIndex(guidePack =>
        guidePack.type === guideType && guidePack.locationReference === locationReference
      );

      if (guidePackIndex >= 0) {
        this.guidePacks.slice(guidePackIndex, guidePackIndex + 1);
      }

      const guidePack = new GuidePack();
      guidePack.type = guideType;
      guidePack.locationReference = locationReference;
      guidePack.guides = response.data.guides;
      this.guidePacks.push(guidePack);
      return true;
    }
    return false;
  }
}
