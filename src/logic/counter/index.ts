import { CounterPageContent } from '../../defs/page';
import { Runtime } from '../../defs/runtime';
import * as firebase from 'firebase';

/**
 * Fetch data of counter page from firebase.
 */
export function fetchCounterPageContent(
  firebase: firebase.app.App,
  id: string,
): Promise<CounterPageContent | null> {
  // tmp
  const firestore = firebase.firestore();
  const pages = firestore.collection('pages');
  const doc = pages.doc(id);
  return doc.get().then<CounterPageContent | null>(snapshot => {
    const doc = snapshot.data();
    if (!snapshot.exists || doc == null) {
      // Not found!
      // TODO
      return null;
    }
    return {
      id,
      ...doc,
    } as CounterPageContent;
  });
}

/**
 * Fetch data of counter page from api.
 */
export async function fetchCounterPageByAPI(
  id: string,
): Promise<CounterPageContent | null> {
  const resp = await fetch('/api/get-page?id=' + encodeURIComponent(id), {
    method: 'GET',
    cache: 'default',
  });
  if (!resp.ok) {
    // something went wrong
    return null;
  }
  return resp.json();
}
