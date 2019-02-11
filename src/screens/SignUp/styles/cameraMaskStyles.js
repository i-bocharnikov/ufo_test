import { StyleSheet, Dimensions } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CARD_RATIO = 1024 / 640;
export const CARD_WIDTH = SCREEN_WIDTH - 80;
export const CARD_HEIGHT = CARD_WIDTH / CARD_RATIO;
export const PADDING_WIDTH = (SCREEN_WIDTH - CARD_WIDTH) / 2;
export const PADDING_HEIGHT = (SCREEN_HEIGHT - CARD_HEIGHT) / 2;

export default StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFill,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },

  sample: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    opacity: 0.32
  },

  verticalOverlap: {
    width: SCREEN_WIDTH,
    height: PADDING_HEIGHT
  },

  horizontalOverlap: {
    width: PADDING_WIDTH,
    height: CARD_HEIGHT
  },

  labelArea: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: PADDING_HEIGHT + CARD_HEIGHT,
    justifyContent: 'flex-end',
    alignContent: 'center'
  },

  cardCameraLabel: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 20,
    textAlign: 'center',
    color: colors.TEXT_INVERT_COLOR,
    paddingHorizontal: 10,
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },

  blurMask: {
    backgroundColor: 'rgba(0,0,0,0.82)'
  }
});
