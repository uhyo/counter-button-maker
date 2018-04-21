import { CounterPageContent } from '../../defs/page';
import { Runtime } from '../../defs/runtime';

/**
 * Fetch data of counter page.
 */
export function fetchCounterPageContent(
  runtime: Runtime,
  id: string,
): Promise<CounterPageContent | null> {
  // tmp
  const firestore = runtime.firebase.firestore();
  const pages = firestore.collection('pages');
  const query = pages.where('id', '==', id).limit(1);
  return query.get().then<CounterPageContent | null>(snapshot => {
    if (snapshot.empty) {
      // Not found!
      // TODO
      return null;
    }
    const doc = snapshot.docs[0];
    return {
      docid: doc.id,
      ...doc.data(),
    } as CounterPageContent;
  });
}
