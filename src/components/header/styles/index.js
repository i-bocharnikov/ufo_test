import { StyleSheet } from 'react-native';
import { colors } from './../../../utils/global';

export default StyleSheet.create({
  headerMasterContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 20
  },

  activityMessages: {
    backgroundColor: colors.ERROR.string(),
    height: 15,
    width: '100%',
  },

  headerContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    width: '100%',
  },

  left: {
    flex: 0.15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  right: {
    flex: 0.15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    flex: 1,
    height: 35
  }
});