import * as firebaseNS from 'firebase';

// Receive from init script. available only in client.
export function firebase(): typeof firebaseNS {
  if ('undefined' !== typeof window) {
    return (window as any).firebase;
  }
  throw new Error('window is not defined');
}
export function firebaseApp(): firebaseNS.app.App {
  if ('undefined' !== typeof window) {
    return (window as any).__firebaseApp__;
  }
  throw new Error('window is not defined');
}
export function firebaseui(): any {
  if ('undefined' !== typeof window) {
    return (window as any).firebaseui;
  }
  throw new Error('window is not defined');
}
