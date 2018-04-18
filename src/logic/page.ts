import { CounterPageData } from '../defs/page';

/**
 * Fetch data of counter page.
 */
export function fetchPageData(id: string): Promise<CounterPageData> {
  // tmp
  return Promise.resolve({
    title: 'にゃんぱすーボタン',
    description:
      'にゃんぱすーをシェアできる全く新しい画期的なWEBサービスですのん',
  });
}
