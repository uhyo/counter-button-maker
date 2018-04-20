import { CounterPageContent } from '../../defs/page';

/**
 * Fetch data of counter page.
 */
export function fetchCounterPageContent(
  id: string,
): Promise<CounterPageContent> {
  // tmp
  return Promise.resolve({
    id,
    title: 'にゃんぱすーボタン',
    description:
      'にゃんぱすーをシェアできる全く新しい画期的なWEBサービスですのん',
    button: 'にゃんぱすー',
  });
}
