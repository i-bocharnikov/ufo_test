import { StyleSheet } from 'react-native';

import { colors, fonts } from './../../../utils/global';

const GAP_BETWEEN = 9;

export default StyleSheet.create({
  bodyWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 32
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
    paddingVertical: 20
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
    marginBottom: 1
  },

  registrationStatus: {
    fontFamily: fonts.REGULAR,
    fontSize: 14,
    lineHeight: 18,
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: colors.INPUT_BG
  },

  referalBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    paddingHorizontal: 24,
    backgroundColor: colors.INPUT_BG
  },

  referalLabel: {
    fontSize: 17,
    fontFamily: fonts.LIGHT,
    flex: 1
  },

  referalImg: {
    height: 35,
    width: 28,
    resizeMode: 'contain',
    marginLeft: 8
  },

  inputIcon: {
    fontSize: 24,
    marginLeft: 8,
    color: colors.SUCCESS
  },

  cardIcon: {
    position: 'absolute',
    marginLeft: 0,
    top: 8,
    right: 12
  },

  cardsWrapper: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 24,
    marginBottom: 100
  },

  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  cardCameraLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.LIGHT
  }
});
