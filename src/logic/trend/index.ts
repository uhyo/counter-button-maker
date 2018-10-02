import { BackgroundDef } from '../../defs/page';
import { Runtime } from '../../defs/runtime';

/**
 * Trend object.
 */
export interface Trend {
  /**
   * ID of this button.
   */
  id: string;
  /**
   * title of this button.
   */
  title: string;
  /**
   * background definition of this button.
   */
  background: BackgroundDef;
  /**
   * number used for sorting.
   */
  sortNumber: number;
}

/**
 * update recent access time.
 */
export async function notifyCounterPageAccess(
  runtime: Runtime,
  id: string,
): Promise<void> {
  const { firebase, firebaseGlobal } = runtime;
  if (firebaseGlobal == null) {
    // clinet should have firebaseGlobal.
    return;
  }
  const db = firebase.database();
  const ref = db.ref(`/recentaccess/${id}`);
  return ref.set(firebaseGlobal.database.ServerValue.TIMESTAMP);
}
