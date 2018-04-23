import { CounterStream } from '../logic/counter/stream';
import { Trend } from '../logic/trend';

/**
 * Data of top page.
 */
export interface TopPageData {
  page: 'top';
  trends: Trend[];
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
/**
 * Page which is shown when 404 or other error.
 */
export interface ErrorPageData {
  page: 'error';
  code: number;
  path: string;
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
      timestamp: number;
      repeat: boolean;
    }
  | null;

export interface CounterPageContent {
  /**
   * Id of this counter.
   */
  id: string;
  /**
   * userif of owner.
   */
  uid: string;
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
export type PageData =
  | TopPageData
  | NewPageData
  | CounterPageData
  | ErrorPageData;
