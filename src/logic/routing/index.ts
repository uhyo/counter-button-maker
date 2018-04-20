import { tokensToRegExp, parse, Key } from 'path-to-regexp';
import { Route } from '../../defs/routing';
import { PageData } from '../../defs/page';

export interface RouteResult<Params, PD extends PageData> {
  route: Route<Params, PD>;
  params: Params;
}

export { Route };

/**
 * Routing controller.
 */
export class Routing {
  protected routes: Array<{
    regexp: RegExp;
    keys: Key[];
    route: Route<any, any>;
  }> = [];
  /**
   * Add a new route.
   */
  public add<Params, PD extends PageData>(
    path: string,
    route: Route<Params, PD>,
  ): void {
    // compile given path using path-to-regexp.
    const keys: Key[] = [];
    const regexp = tokensToRegExp(parse(path), keys);
    this.routes.push({
      regexp,
      keys,
      route,
    });
  }
  /**
   * Perform routing.
   */
  public route(path: string): RouteResult<any, any> | undefined {
    for (const r of this.routes) {
      // TODO
      const res = path.match(r.regexp);
      if (res != null) {
        // paramsオブジェクト
        const { keys } = r;
        const params: Record<string, string> = {};
        for (let i = 0; i < keys.length; i++) {
          params[keys[i].name] = res[i + 1];
        }
        return {
          route: r.route,
          params,
        };
      }
    }
  }
}
