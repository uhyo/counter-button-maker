import { Trend } from '.';
import { Runtime } from '../../defs/runtime';

/**
 * Fetch trend data once from database.
 */
export async function loadTrends(runtime: Runtime): Promise<Trend[]> {
  const db = runtime.firebase.database();
  const ref = db.ref('/recentaccess');
  const trendsQuery = ref.orderByValue().limitToLast(5);
  const trendsSnapshot = await trendsQuery.once('value');
  const data: Record<string, number> = trendsSnapshot.toJSON();
  // load counter data for each counter ids.
  console.log(data);
  return Promise.all(
    Object.keys(data).map(async id => {
      const pageData = await runtime.fetchCounterPageContent(id);
      console.log(id, pageData);
      return {
        id,
        title: pageData != null ? pageData.title : '',
      };
    }),
  );
}
