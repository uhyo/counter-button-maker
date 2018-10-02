import { TrendStore } from '../store/trend-store';
import * as React from 'react';
import { observer } from 'mobx-react';
import { Link } from './link';
import { SmallNotes } from './paragraph';
import { Navigation } from '../logic/navigation';
import styled from 'styled-components';
import { BgThumbnail } from './bg-thumbnail';
import { trendNumber } from '../logic/trend/loader';

export interface IPropTrends {
  trendStore: TrendStore;
  navigation: Navigation;
  type: 'trends' | 'ranking';
}

@observer
export class Trends extends React.Component<IPropTrends, {}> {
  public render() {
    const { trendStore, type, navigation } = this.props;

    const loading =
      type === 'trends' ? trendStore.trendsLoading : trendStore.rankingLoading;
    const trends = type === 'trends' ? trendStore.trends : trendStore.ranking;

    return !loading ? (
      <TrendList>
        {trends.map(({ id, title, background }) => (
          <Link href={`/${id}`} navigation={navigation} key={id}>
            <TrendContainer>
              <BgThumbnail bg={background} />
              <TrendText>{title}</TrendText>
            </TrendContainer>
          </Link>
        ))}
      </TrendList>
    ) : (
      // show placeholders
      <TrendList>
        {new Array(trendNumber).fill(0).map((_, i) => {
          return (
            <TrendContainer key={i}>
              <BgThumbnail bg={{ type: 'placeholder' }} />
              <PlaceholderText>読み込み中</PlaceholderText>
            </TrendContainer>
          );
        })}
      </TrendList>
    );
  }
}

const TrendList = styled.ul`
  padding: 0;
  list-style-type: none;
  line-height: 1.2em;
`;

const TrendContainer = styled.li`
  display: flex;
  flex-flow: row nowrap;
  margin: 0.8em 0;
`;

const TrendText = styled.span`
  max-height: 80px;
  align-self: center;
  overflow: hidden;
`;

const PlaceholderText = styled(TrendText)`
  color: #666666;
`;
