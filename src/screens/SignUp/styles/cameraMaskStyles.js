import { StyleSheet, Dimensions } from 'react-native';

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
    opacity: 0.5
  },

  verticalOverlap: {
    width: SCREEN_WIDTH,
    height: PADDING_HEIGHT
  },

  horizontalOverlap: {
    width: PADDING_WIDTH,
    height: CARD_HEIGHT
  },

  blurMask: {
    backgroundColor: 'rgba(0,200,0,0.2)'
  },

  labelArea: {
    position: 'absolute',
    top: PADDING_HEIGHT,
    left: PADDING_WIDTH,
    bottom: PADDING_HEIGHT,
    right: PADDING_WIDTH,
    justifyContent: 'center',
    alignContent: 'center'
  }
});
