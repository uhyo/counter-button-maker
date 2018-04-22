import * as React from 'react';
import { Navigation } from '../logic/navigation';
import { bind } from 'bind-decorator';
import { handleError } from '../logic/error';

export interface IPropLink {
  href: string;
  navigation: Navigation;
}
/**
 * Link with navigation.
 */
export class Link extends React.PureComponent<IPropLink, {}> {
  public render() {
    const { href, children } = this.props;
    return <a href={href}>{children}</a>;
  }
  @bind
  protected handleClick(e: React.SyntheticEvent<any>): void {
    const { href, navigation } = this.props;
    e.preventDefault();
    navigation.move(href, 'push').catch(handleError);
  }
}
