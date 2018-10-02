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
        {trends.map(({ id, title, background }) => (
          <Link href={`/${id}`} navigation={navigation} key={id}>
            <TrendContainer>
              <BgThumbnail bg={background} />
              {title}
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
              <PlaceholderText>取得中……</PlaceholderText>
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
  line-height: 1.8em;
`;

const TrendContainer = styled.li`
  margin: 0.8em 0;
`;

const PlaceholderText = styled.span`
  color: #666666;
`;
