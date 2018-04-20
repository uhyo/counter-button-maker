import { CounterStream } from '../logic/counter/stream';

/**
 * Data of top page.
 */
export interface TopPageData {
  page: 'top';
}
/**
 * Data of counter page.
 */
export interface CounterPageData {
  page: 'counter';
  /**
   * Content of page.
   */
  content: CounterPageContent;
}

export interface CounterPageContent {
  /**
   * Id of this counter.
   */
  id: string;
  /**
   * Title of page.
   */
  title: string;
  /**
   * Description of page.
   */
  description: string;
  /**
   * Button label.
   */
  button: string;
}

/**
 * One of the pages.
 */
export type PageData = TopPageData | CounterPageData;
