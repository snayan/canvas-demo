export interface BrowserObject {
  ios: boolean;
  android: boolean;
  mobile: boolean;
  pc: boolean;
}

function getBrowserObject(ua: string): BrowserObject {
  const browser = {} as BrowserObject;
  const isIos = ua.indexOf('iPhone') >= 0 || ua.indexOf('iPad') >= 0 || ua.indexOf('iPod') >= 0;
  const isAndroid = ua.indexOf('Android') > 0;

  browser.ios = isIos;
  browser.android = isAndroid;
  browser.mobile = isIos || isAndroid;
  browser.pc = !isIos && !isAndroid;

  return browser;
}

function detectBrowser(): BrowserObject {
  const ua = window.navigator.userAgent;
  const originalUrl = window.location.href;
  return getBrowserObject(ua);
}

const browser = detectBrowser();
export default browser;
