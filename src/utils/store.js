import { AsyncStorage } from 'react-native';
import { create } from 'mobx-persist'


export const hydrate = create({
    storage: AsyncStorage,
    jsonify: true
})

