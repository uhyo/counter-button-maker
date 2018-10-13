import { Trend } from '.';
import { Runtime } from '../../defs/runtime';

/**
 * Number of trends fetched by server.
 */
export const trendNumber = 5;

/**
 * Fetch trend data once from database.
 */
async function loadSortedData(
  runtime: Runtime,
  path: string,
): Promise<Trend[]> {
  const db = runtime.firebase.database();
  const ref = db.ref(path);
  const trendsQuery = ref.orderByValue().limitToLast(trendNumber);
  const trendsSnapshot = await trendsQuery.once('value');
  const data = (trendsSnapshot.toJSON() || {}) as Record<string, number>;
  // sort data keys by value.
  const keys = Object.keys(data).sort((a, b) => data[b] - data[a]);
  // load counter data for each counter ids.
  return Promise.all(
    keys.map(async id => {
      const pageData = await runtime.fetchCounterPageContent(id);
      console.log(id, pageData);
      return {
        id,
        title: pageData != null ? pageData.title : '',
        background: pageData != null ? pageData.background : null,
        sortNumber: data[id],
      };
    }),
  );
}

/**
 * Fetch trend data once from database.
 */
export function loadTrends(runtime: Runtime): Promise<Trend[]> {
  return loadSortedData(runtime, '/recentaccess');
}

/**
 * Fetch ranking data once from database.
 */
export async function loadRanking(runtime: Runtime): Promise<Trend[]> {
  return loadSortedData(runtime, '/counters');
}
