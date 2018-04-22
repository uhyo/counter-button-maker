import * as React from 'react';
import styled from 'styled-components';

import { NormalPageWrapper } from './base';
import { Centralize } from '../components/center';
import {
  MainContent,
  MainContentDark,
  MainContentLight,
} from '../components/main-content';
import { phone } from '../components/media';
import * as firebase from 'firebase';
import { firebase as getFirebase, firebaseui } from '../logic/firebase';
import { bind } from 'bind-decorator';
import { handleError } from '../logic/error';
import { StoreConsumer } from '../store';
import { NewStore } from '../store/new-store';
import { observer } from 'mobx-react';
import { withProps } from '../components/styled';
import { Navigation } from '../logic/navigation';
import { publishCounter, randomid } from '../logic/publish';
import { Link } from '../components/link';
import { UserUI } from './user';

export interface IStateNewPage {
  loading: boolean;
  user: firebase.User | null;
  UserUIComponent: (typeof UserUI) | null;
}
/**
 * Render new counter page.
 */
export class NewPage extends React.Component<
  {
    navigation: Navigation;
  },
  IStateNewPage
> {
  protected ui: any;
  protected unregisterObserver: any;
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      UserUIComponent: null,
    };
  }
  public render() {
    const { loading, user, UserUIComponent } = this.state;
    return (
      <StoreConsumer>
        {({ new: newStore }) => (
          <PageWrapper forceDefault={user == null} newStore={newStore}>
            <Centralize maximize={user != null}>
              <MainContentLight>
                <h1>ボタンを作成</h1>
                {loading || (user != null && UserUIComponent == null) ? (
                  <p>読み込み中…</p>
                ) : user != null && UserUIComponent != null ? (
                  <UserUIComponent
                    user={user!}
                    newStore={newStore}
                    navigation={this.props.navigation}
                  />
                ) : (
                  <p>
                    ボタンの作者を識別するために、以下のいずれかのアカウントでログインが必要です。ボタンのページに作者のアカウントは表示されません。
                  </p>
                )}
                <div
                  id="firebase-auth"
                  style={{ display: user != null ? 'none' : 'block' }}
                />
              </MainContentLight>
            </Centralize>
          </PageWrapper>
        )}
      </StoreConsumer>
    );
  }
  public componentDidMount() {
    this.initAuthUI();
  }
  public componentDidUpdate(prevProps: {}, prevState: IStateNewPage) {
    if (!this.state.loading && prevState.user !== this.state.user) {
      const fb = getFirebase();
      const fauth = fb.auth();
      this.startAuthUI(fauth, fb);
    }
  }
  public componentWillUnmount() {
    if (this.ui != null) {
      // deteach the ui.
      this.ui.delete();
    }
    if (this.unregisterObserver != null) {
      this.unregisterObserver();
    }
  }
  protected initAuthUI(): any {
    const fb = getFirebase();
    const fui = firebaseui();
    const fauth = fb.auth();
    fb.auth().useDeviceLanguage();
    this.ui = new fui.auth.AuthUI(fauth);
    this.unregisterObserver = fauth.onAuthStateChanged(user => {
      if (!user && this.state.user) {
        // oh...
        this.ui.reset();
        this.setState({
          user: null,
        });
      } else {
        if (this.state.UserUIComponent == null) {
          // dynamically load it
          import('./user')
            .then(({ UserUI }) => {
              this.setState({
                UserUIComponent: UserUI,
              });
            })
            .catch(handleError);
        }
        this.setState({
          user,
        });
      }
    });

    this.startAuthUI(fauth, fb);
  }

  protected startAuthUI(fauth: firebase.auth.Auth, fb: typeof firebase) {
    this.ui.start('#firebase-auth', {
      callbacks: {
        uiShown: () => {
          this.setState({
            loading: false,
            user: fauth.currentUser,
          });
        },
        signInSuccess: (
          currentUser: any,
          crediential: any,
          redirectUrl: any,
        ) => {
          return false;
        },
      },
      signInSuccessUrl: '/new',
      signInOptions: [
        fb.auth.GoogleAuthProvider.PROVIDER_ID,
        fb.auth.TwitterAuthProvider.PROVIDER_ID,
        fb.auth.GithubAuthProvider.PROVIDER_ID,
      ],
    });
  }
}

@observer
class PageWrapper extends React.Component<
  {
    forceDefault: boolean;
    newStore: NewStore;
  },
  {}
> {
  public render() {
    const { forceDefault, newStore, children } = this.props;
    const {
      backgroundType,
      backgroundImage,
      backgroundImageURL,
      backgroundRepeat,
      gradientStart,
      gradientEnd,
    } = newStore;
    const useDefault =
      backgroundType === 'default' ||
      forceDefault ||
      (backgroundType === 'image' && backgroundImageURL == null);
    const backgroundImageValue = useDefault
      ? 'url(/static/back.jpg)'
      : backgroundType === 'image'
        ? `url(${backgroundImageURL})`
        : `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})`;
    const style = {
      backgroundImage: backgroundImageValue,
      backgroundRepeat:
        !useDefault && backgroundRepeat ? 'repeat' : 'no-repeat',
      backgroundSize: !useDefault && backgroundRepeat ? 'auto' : 'cover',
    };
    return <NormalPageWrapper style={style}>{children}</NormalPageWrapper>;
  }
}
