import { StyleSheet } from 'react-native';

import { colors, fonts } from './../../../utils/global';

const GAP_BETWEEN = 9;

export default StyleSheet.create({
  bodyWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 36,
  },

  inputBlock: {
    marginBottom: GAP_BETWEEN
  },

  cardsBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  cardWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.INPUT_BG,
    paddingVertical: 24
  },

  leftGap: {
    marginLeft: GAP_BETWEEN
  },

  topGap: {
    marginTop: GAP_BETWEEN
  },

  cardPickerImg: {
    width: 88,
    height: 68,
    resizeMode: 'contain',
    marginBottom: 4
  },

  cardPickerLabel: {
    fontFamily: fonts.REGULAR,
    fontSize: 14,
    lineHeight: 19.1,
    textAlign: 'center',
    marginTop: 8
  },

  cardThumb: {
    width: 82,
    height: 46,
    marginBottom: 1,
  },

  registrationStatus: {
    fontFamily: fonts.REGULAR,
    fontSize: 14,
    lineHeight: 36,
    textAlign: 'center',
    backgroundColor: colors.INPUT_BG
  }
});
