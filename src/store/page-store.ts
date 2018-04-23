import { observable, action } from 'mobx';
import { PageData } from '../defs/page';
import { Route } from '../defs/routing';

/**
 * Store which stores info of current page.
 */
export class PageStore {
  @observable public routePath: string = '';
  @observable public params: Record<string, string> = {};
  @observable public page: PageData | null = null;
  @observable public state: any;
  @observable public route: Route<any, any, any> | null = null;

  @action
  public updatePage<
    Params extends Record<string, string>,
    PD extends PageData,
    State
  >(
    routePath: string,
    route: Route<Params, PD, State> | null,
    params: Params,
    page: PageData | null,
    state: State,
  ): void {
    this.routePath = routePath;
    this.params = params;
    this.page = page;
    this.state = state;
    this.route = route;
  }

  @action
  public updatePageOnly(page: PageData | null) {
    this.page = page;
  }
}
