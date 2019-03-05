import { YellowBox } from 'react-native';

const IGNORED_WARNINGS = [
  'Module RNI18n requires main queue setup',
  'Require cycle:',
  'Remote debugger is in a background tab which may cause apps to perform slowly'
];

export function consoleWarnFilter() {
  const oldConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      IGNORED_WARNINGS.some(warning => args[0].startsWith(warning))
    ) {
      return;
    }

    return oldConsoleWarn.apply(console, args);
  };

  YellowBox.ignoreWarnings(IGNORED_WARNINGS);
}
