import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';

export default StyleSheet.create({
  tabWrapper: {
    flex: 1
  },

  container: {
    flex: 1,
    backgroundColor: colors.BG_INVERT_TINT
  },

  scrollContainer: {
    paddingTop: 32,
    paddingHorizontal: 24
  },

  row: {
    flexDirection: 'row'
  },

  blockShadow: {
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 1
  },

  infoPreviewBlock: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.BG_INVERT,
    marginBottom: 18
  },

  infoPreviewIcon: {
    position: 'absolute',
    right: 16,
    top: 10,
    fontSize: 20,
    color: colors.SUCCESS_COLOR
  },

  previewEditLabel: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 15,
    color: colors.TEXT_LIGHT_COLOR,
    letterSpacing: 1.2,
    textDecorationLine: 'underline',
    position: 'absolute',
    right: 16,
    bottom: 16
  },

  infoPreviewTitle: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 20,
    color: colors.MAIN_COLOR,
    letterSpacing: 0.8,
    marginTop: 12
  },

  infoPreviewItem: {
    ...textThemes.SP_LIGHT,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: 1.4,
    marginTop: 10,
    marginBottom: 2,
    marginRight: 32
  },

  cardPickerBlock: {
    flex: 1,
    height: 164,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.BG_INVERT,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 18
  },

  cardPickerBlockIndent: {
    marginRight: 4
  },

  cardPickerImg: {
    height: 52,
    resizeMode: 'contain',
    marginBottom: 2,
    marginTop: 10
  },

  cardPickerLabel: {
    ...textThemes.SP_REGULAR,
    fontSize: 17,
    letterSpacing: 1.6,
    textAlign: 'center'
  },

  cardPickerEditPosition: {
    right: 4,
    bottom: 4
  },

  cardThumb: {
    width: 84,
    height: 42,
    marginBottom: 2
  },

  creditInfoBlock: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: colors.MAIN_COLOR
  },

  creditInfoBG: {
    position: 'absolute',
    left: 0,
    top: 24,
    height: 54,
    width: 46
  },

  creditTolltipBtn: {
    position: 'absolute',
    right: 16,
    top: 24
  },

  creditTolltipIcon: {
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 16
  },

  creditHeader: {
    ...textThemes.SP_SEMIBOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 20,
    letterSpacing: 0.5,
    marginBottom: 14
  },

  creditValue: {
    ...textThemes.SP_SEMIBOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 28,
    letterSpacing: 1.8,
    marginBottom: 10
  },

  creditDescription: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    marginHorizontal: 16
  },

  shareReferralTitle: {
    ...textThemes.SP_BOLD,
    fontSize: 28,
    letterSpacing: 0.4,
    textAlign: 'center',
    marginTop: 32
  },

  shareReferralDescr: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: 0.8,
    color: colors.MAIN_COLOR,
    textAlign: 'center',
    marginTop: 8
  },

  shareReferralBtn: {
    backgroundColor: colors.MAIN_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 22,
    marginBottom: 8
  },

  shareReferralCode: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 28,
    lineHeight: 28,
    letterSpacing: 1.2
  },

  shareReferralIcon: {
    position: 'absolute',
    right: 16,
    height: 28,
    width: 22,
    resizeMode: 'contain'
  },

  milesBlock: {
    alignItems: 'center',
    backgroundColor: colors.BG_INVERT,
    paddingVertical: 8,
    marginTop: 16,
    marginBottom: 16
  },

  milesTitle: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_LIGHT_COLOR,
    fontSize: 17,
    letterSpacing: 1.6
  },

  milesLabel: {
    ...textThemes.SP_BOLD,
    fontSize: 28,
    letterSpacing: 1.6,
    marginTop: 8
  },

  nextInputIndent: {
    marginTop: 24
  }
});
