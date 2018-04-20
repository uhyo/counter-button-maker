import { observable, action } from 'mobx';
import { PageData } from '../defs/page';

/**
 * Store which stores info of current page.
 */
export class PageStore {
  @observable public page: PageData | null = null;
  @observable public state: any;

  @action
  public updatePage(page: PageData | null): void {
    this.page = page;
  }

  @action
  public updateState(state: any): void {
    this.state = state;
  }
}
