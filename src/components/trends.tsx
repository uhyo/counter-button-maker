import { TrendStore } from '../store/trend-store';
import * as React from 'react';
import { observer } from 'mobx-react';
import { Link } from './link';
import { SmallNotes } from './paragraph';
import { Navigation } from '../logic/navigation';
import styled from 'styled-components';

export interface IPropTrends {
  trendStore: TrendStore;
  navigation: Navigation;
}

@observer
export class Trends extends React.Component<IPropTrends, {}> {
  public render() {
    const {
      trendStore: { loading, trends },
      navigation,
    } = this.props;

    return !loading ? (
      <TrendList>
        {trends.map(({ id, title }) => (
          <li key={id}>
            <Link href={`/${id}`} navigation={navigation}>
              {title}
            </Link>
          </li>
        ))}
      </TrendList>
    ) : (
      <SmallNotes>取得中……</SmallNotes>
    );
  }
}

const TrendList = styled.ul`
  padding: 0;
  list-style-type: none;
  line-height: 1.8em;
`;
