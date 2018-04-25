/**
 * Service name.
 */
export const serviceName = '押すと数が増えるボタンを作るサービス';

/**
 * Service description
 */
export const serviceDescription =
  'ボタンを押すと数が増えるという全く新しい画期的なWebサービスを1分で作って公開できる全く新しい画期的なWebサービスです。';

// XXX these should be in config file?
const storagePrefix =
  'https://firebasestorage.googleapis.com/v0/b/counter-button-maker.appspot.com/o/';
const proxyURL = 'https://img-buttons.uhyo.space/';
/**
 * Replace background image url by proxy.
 */
export function backgroundImageProxy(url: string): string {
  if (url.slice(0, storagePrefix.length) === storagePrefix) {
    return proxyURL + url.slice(storagePrefix.length);
  } else {
    return url;
  }
}
