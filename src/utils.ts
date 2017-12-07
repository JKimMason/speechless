export function getNavigatorUserMedia(
  constraints: MediaStreamConstraints,
  successCallback: NavigatorUserMediaSuccessCallback,
  errorCallback: NavigatorUserMediaErrorCallback
): void {
  const navigator = window.navigator
  const navigatorAsAny = window.navigator as any
  if (navigator.getUserMedia) {
    navigator.getUserMedia(constraints, successCallback, errorCallback)
  } else if (navigatorAsAny.webkitGetUserMedia) {
    navigatorAsAny.webkitGetUserMedia(
      constraints,
      successCallback,
      errorCallback
    )
  } else if (navigatorAsAny.mozGetUserMedia) {
    navigatorAsAny.mozGetUserMedia(constraints, successCallback, errorCallback)
  } else if (
    navigatorAsAny.mediaDevices &&
    navigatorAsAny.mediaDevices.getUserMedia
  ) {
    navigatorAsAny.mediaDevices.getUserMedia(
      constraints,
      successCallback,
      errorCallback
    )
  } else {
    throw new Error('no userMedia support')
  }
}
