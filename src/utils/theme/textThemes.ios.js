import sizes from './sizes';
import colors from './colors';

const SP_FONT = 'Sofia Pro';

export default {
  SP_LIGHT: {
    fontFamily: SP_FONT,
    fontSize: sizes.DEFAULT_FONT_SIZE,
    color: colors.TEXT_DEFAULT_COLOR,
    fontWeight: '300'
  },
  SP_REGULAR: {
    fontFamily: SP_FONT,
    fontSize: sizes.DEFAULT_FONT_SIZE,
    color: colors.TEXT_DEFAULT_COLOR,
    fontWeight: '400'
  },
  SP_BOLD: {
    fontFamily: SP_FONT,
    fontSize: sizes.DEFAULT_FONT_SIZE,
    color: colors.TEXT_DEFAULT_COLOR,
    fontWeight: '700'
  },
  SP_SEMIBOLD: {
    fontFamily: SP_FONT,
    fontSize: sizes.DEFAULT_FONT_SIZE,
    color: colors.TEXT_DEFAULT_COLOR,
    fontWeight: '600'
  }
};
