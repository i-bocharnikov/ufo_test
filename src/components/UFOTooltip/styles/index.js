import { StyleSheet } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

export const TAIL_SIZE = 20;
export const TAIL_INDENT = 20;

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  container: {
    backgroundColor: colors.BG_DEFAULT,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '55%',
    borderRadius: 6,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 0.2,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    elevation: 2
  },

  label: {
    ...textThemes.SP_REGULAR,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 12,
    lineHeight: 15
  },

  tail: {
    borderWidth: TAIL_SIZE / 2,
    borderColor: colors.BG_DEFAULT,
    position: 'absolute'
  },

  tailBottom: {
    bottom: -TAIL_SIZE,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderStartColor: 'transparent',
    borderRightColor: 'transparent',
    borderEndColor: 'transparent'
  },

  tailTop: {
    top: -TAIL_SIZE,
    borderBottomColor: colors.BG_DEFAULT,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderStartColor: 'transparent',
    borderRightColor: 'transparent',
    borderEndColor: 'transparent'
  },

  tailCenter: { alignSelf: 'center' },

  tailLeft: { left: TAIL_INDENT },

  tailRight: { right: TAIL_INDENT }
});
