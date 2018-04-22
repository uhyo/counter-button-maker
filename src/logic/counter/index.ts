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
