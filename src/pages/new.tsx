import * as React from 'react';
import styled from 'styled-components';
import { NormalPageWrapper } from './base';
import { Centralize } from '../components/center';
import { MainContent } from '../components/main-content';
import * as firebase from 'firebase';
import { firebase as getFirebase, firebaseui } from '../logic/firebase';
import { bind } from 'bind-decorator';
import { handleError } from '../logic/error';

export interface IStateNewPage {
  loading: boolean;
  user: firebase.User | null;
}
/**
 * Render new counter page.
 */
export class NewPage extends React.PureComponent<{}, IStateNewPage> {
  protected ui: any;
  protected unregisterObserver: any;
  public state = {
    loading: true,
    user: null,
  };
  public render() {
    const { loading, user } = this.state;
    return (
      <NormalPageWrapper>
        <Centralize>
          <MainContent>
            <h1>ボタンを作成</h1>
            {loading ? (
              <p>読み込み中…</p>
            ) : user != null ? (
              <UserUI user={user} />
            ) : (
              <p>
                ボタンの作者を識別するために、以下のいずれかのアカウントでログインが必要です。ボタンのページに作者のアカウントは表示されません。
              </p>
            )}
            <div
              id="firebase-auth"
              style={{ display: user != null ? 'none' : 'block' }}
            />
          </MainContent>
        </Centralize>
      </NormalPageWrapper>
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

export interface IPropUserUI {
  user: firebase.User;
}
/**
 * UI for logged-in user.
 */
export class UserUI extends React.PureComponent<IPropUserUI, {}> {
  public render() {
    const { user } = this.props;
    return (
      <div>
        <p>
          {user.providerId}でログイン中　<a
            href="/new"
            onClick={this.handleLogout}
          >
            ログアウト
          </a>
        </p>
      </div>
    );
  }
  @bind
  protected handleLogout(e: React.SyntheticEvent<any>): void {
    e.preventDefault();
    getFirebase()
      .auth()
      .signOut()
      .catch(handleError);
  }
}
