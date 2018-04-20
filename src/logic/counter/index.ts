import { CounterPageContent } from '../../defs/page';

/**
 * Fetch data of counter page.
 */
export function fetchCounterPageContent(
  id: string,
): Promise<CounterPageContent> {
  // tmp
  return Promise.resolve<CounterPageContent>({
    id,
    title: 'にゃんぱすーボタン',
    description:
      'にゃんぱすーをシェアできる全く新しい画期的なWEBサービスですのん',
    buttonLabel: 'にゃんぱすー',
    buttonBg: '#c8c0da',
    buttonColor: '#796bae',
    background: {
      type: 'image',
      url: '/static/back.jpg',
    },
  });
}
