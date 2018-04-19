import { observable, action } from 'mobx';
import { PageData } from '../defs/page';

/**
 * Store which stores info of current page.
 */
export class PageStore {
  @observable public page: PageData | null = null;

  @action
  public updatePage(page: PageData | null): void {
    this.page = page;
  }
}
