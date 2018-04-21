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
/**
 * Data of new counter page.
 */
export interface NewPageData {
  page: 'new';
}

export type BackgroundDef =
  | {
      type: 'gradient';
      from: string;
      to: string;
    }
  | {
      type: 'image';
      url: string;
    }
  | null;

export interface CounterPageContent {
  /**
   * Id of firestore document.
   */
  docid: string;
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
  buttonLabel: string;
  /**
   * Button background color.
   */
  buttonBg: string;
  /**
   * Button font color.
   */
  buttonColor: string;
  /**
   * Background.
   */
  background: BackgroundDef;
}

/**
 * One of the pages.
 */
export type PageData = TopPageData | NewPageData | CounterPageData;
