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
  /**
   * Whether to show sort number.
   */
  'show-number'?: boolean;
}

@observer
export class Trends extends React.Component<IPropTrends, {}> {
  public render() {
    const {
      trendStore,
      type,
      navigation,
      'show-number': showNumber,
    } = this.props;

    const loading =
      type === 'trends' ? trendStore.trendsLoading : trendStore.rankingLoading;
    const trends = type === 'trends' ? trendStore.trends : trendStore.ranking;

    return !loading ? (
      <TrendList>
        {trends.map(({ id, title, background, sortNumber }) => (
          <Link href={`/${id}`} navigation={navigation} key={id}>
            <TrendContainer>
              <BgThumbnail bg={background} />
              <TrendInfo>
                <TrendTextWrapper>
                  <TrendText>{title}</TrendText>
                  {showNumber ? <NumberText>{sortNumber}</NumberText> : null}
                </TrendTextWrapper>
              </TrendInfo>
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
              <TrendInfo>
                <TrendTextWrapper>
                  <PlaceholderText>読み込み中</PlaceholderText>
                </TrendTextWrapper>
              </TrendInfo>
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

  a {
    text-decoration: none;
  }
`;

const TrendContainer = styled.li`
  display: flex;
  flex-flow: row nowrap;
  margin: 0.8em 0;
`;

const TrendInfo = styled.div`
  display: flex;
  flex-flow: column nowrap;
  box-sizing: border-box;
  height: 80px;
`;

const TrendTextWrapper = styled.div`
  flex: auto 1 1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`;

const TrendText = styled.span`
  flex: auto 0 1;
  overflow: hidden;
`;

const PlaceholderText = styled(TrendText)`
  color: #666666;
`;

const NumberText = styled.div`
  flex: auto 0 0;
  color: #222222;
  font-size: 0.9em;
  font-family: 'Do Hyeon', sans-serif;
`;
