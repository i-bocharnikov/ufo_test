import keys from './screenKeys';

function getCurrentRoute(state) {
  const findCurrentRoute = navState => {
    if (navState.index !== undefined) {
      return findCurrentRoute( navState.routes[navState.index] );
    }

    return navState.routeName;
  };

  return findCurrentRoute(state);
}

export const supportBackBtnState = {
  navBackScreenKey: keys.Home,
  unlistenedScreens: [
    keys.Support,
    keys.SupportGuideList,
    keys.SupportChat,
    keys.SupportFaq,
    keys.SupportGuide
  ]
};

export default function(prevState, newState, action) {
  /* handle state changing for supportBackBtnState */
  if (action.type !== 'Navigation/COMPLETE_TRANSITION') {
    const prevRoute = getCurrentRoute(prevState);

    if (supportBackBtnState.unlistenedScreens.indexOf(prevRoute) === -1) {
      supportBackBtnState.navBackScreenKey = prevRoute;
    }
  }
}
