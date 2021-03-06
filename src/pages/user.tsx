import { observer } from 'mobx-react';
import * as React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import { Link } from '../components/link';

import { Button } from '../components/button';
import { Field, Input, Form } from '../components/form';
import { ChromePicker } from 'react-color';
import * as firebase from 'firebase';
import { firebase as getFirebase, firebaseui } from '../logic/firebase';
import { NewStore } from '../store/new-store';
import { Navigation } from '../logic/navigation';
import bind from 'bind-decorator';
import { handleError } from '../logic/error';
import { publishCounter, randomid } from '../logic/publish';
import styled from 'styled-components';
import { phone } from '../components/media';

interface IPropUserUI {
  user: firebase.User;
  newStore: NewStore;
  navigation: Navigation;
}
interface IStateUserUI {
  publishing: boolean;
  error: string;
}
/**
 * UI for logged-in user.
 */
@observer
export class UserUI extends React.Component<IPropUserUI, IStateUserUI> {
  protected formRef: HTMLFormElement | null = null;
  constructor(props: IPropUserUI) {
    super(props);
    this.state = {
      publishing: false,
      error: '',
    };
  }
  public render() {
    const { user, newStore, navigation } = this.props;
    const { publishing, error } = this.state;
    const {
      id,
      title,
      description,
      buttonLabel,
      buttonBg,
      buttonColor,
      backgroundType,
      backgroundRepeat,
      gradientStart,
      gradientEnd,
    } = newStore;
    return (
      <MuiThemeProvider>
        <div>
          <LoginInfo>
            {user.providerId}でログイン中　<a
              href="/new"
              onClick={this.handleLogout}
            >
              ログアウト
            </a>
          </LoginInfo>
          <Form innerRef={e => (this.formRef = e)} onSubmit={this.handleSubmit}>
            <Field title="ページ名">
              <TextField
                name="title"
                fullWidth
                hintText="ページ名を入力"
                required
                onChange={this.handleInputChange}
                value={title}
                errorText={
                  title.length > 1024
                    ? '1024文字以内で入力してください。'
                    : null
                }
              />
            </Field>
            <Field title="説明">
              <TextField
                name="description"
                fullWidth
                required
                hintText="ボタンの説明を入力"
                onChange={this.handleInputChange}
                value={description}
                multiLine
                rowsMax={5}
                errorText={
                  description.length > 1024
                    ? '1024文字以内で入力してください。'
                    : null
                }
              />
            </Field>
            <Field title="ボタンの文字列">
              <TextField
                name="buttonLabel"
                fullWidth
                required
                hintText="ボタンの文字列を入力"
                onChange={this.handleInputChange}
                value={buttonLabel}
                errorText={
                  buttonLabel.length > 128
                    ? '128文字以内で入力してください。'
                    : null
                }
              />
            </Field>
            <Field title="背景">
              <RadioButtonGroup
                name="backgroundType"
                valueSelected={backgroundType}
                onChange={this.handleInputChange}
              >
                <RadioButton
                  value="default"
                  label="デフォルトの背景画像を使用"
                  style={this.radioButtonStyle}
                />
                <RadioButton
                  value="image"
                  label="背景画像をアップロード"
                  style={this.radioButtonStyle}
                />
                <RadioButton
                  value="gradient"
                  label="グラデーション"
                  style={this.radioButtonStyle}
                />
              </RadioButtonGroup>
            </Field>
            {backgroundType === 'image' ? (
              <Field title="背景画像">
                <List>
                  <ListItem disabled>
                    <RaisedButton label="画像を選択" containerElement="label">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={this.handleUpload}
                      />
                    </RaisedButton>
                  </ListItem>
                  <Divider />
                  <ListItem
                    leftCheckbox={
                      <Checkbox
                        name="backgroundRepeat"
                        checked={backgroundRepeat}
                        onCheck={this.handleCheck}
                      />
                    }
                    primaryText="背景画像を繰り返す"
                  />
                </List>
              </Field>
            ) : backgroundType === 'gradient' ? (
              <Field title="背景グラデーション">
                <Pickers>
                  <div>
                    <ChromePicker
                      disableAlpha
                      color={gradientStart}
                      onChange={this.handleColorStartChange}
                    />
                  </div>
                  <div>
                    <ChromePicker
                      disableAlpha
                      color={gradientEnd}
                      onChange={this.handleColorEndChange}
                    />
                  </div>
                </Pickers>
              </Field>
            ) : null}
            <Field title="ボタンの背景色">
              <PickerWrapper>
                <ChromePicker
                  disableAlpha
                  color={buttonBg}
                  onChange={this.handleColorButtonBg}
                />
              </PickerWrapper>
            </Field>
            <Field title="ボタンの文字色">
              <PickerWrapper>
                <ChromePicker
                  disableAlpha
                  color={buttonColor}
                  onChange={this.handleColorButtonColor}
                />
              </PickerWrapper>
            </Field>
            <Field title="ボタンID（省略可）">
              <TextField
                name="id"
                fullWidth
                onChange={this.handleInputChange}
                value={id}
                floatingLabelText="ボタンIDはページのURLに使用されます。省略した場合はランダムに決められます。"
                errorText={
                  id && (id.length < 4 || id.length > 1024)
                    ? '4文字以上1024文字以下で入力してください。'
                    : id && !/^[-_a-zA-Z0-9]+$/.test(id)
                      ? 'IDに使用可能な文字は半角英数とハイフンマイナス・アンダーバーのみです。'
                      : null
                }
              />
            </Field>
            <p>
              <Button
                type="submit"
                disabled={publishing}
                style={{
                  backgroundColor: buttonBg,
                  color: buttonColor,
                }}
              >
                作成
              </Button>
            </p>
            {publishing ? (
              <>
                <p>ページを作成中……</p>
                <LinearProgress />
              </>
            ) : null}
            {error ? <ErrorInfo>{error}</ErrorInfo> : null}
            <Divider />
            <LoginInfo>
              <Link href="/" navigation={navigation}>
                トップページに戻る
              </Link>
            </LoginInfo>
          </Form>
        </div>
      </MuiThemeProvider>
    );
  }
  /**
   * Style for radio button.
   */
  protected radioButtonStyle: React.CSSProperties = {
    marginBottom: '8px',
    textAlign: 'left',
  };
  @bind
  protected handleLogout(e: React.SyntheticEvent<any>): void {
    e.preventDefault();
    getFirebase()
      .auth()
      .signOut()
      .catch(handleError);
  }
  @bind
  protected handleInputChange(e: React.SyntheticEvent<HTMLInputElement>): void {
    const t = e.currentTarget;
    const name = t.name;
    this.props.newStore.update({
      [name]: t.value,
    });
  }
  @bind
  protected handleCheck(
    e: React.MouseEvent<HTMLInputElement>,
    checked: boolean,
  ): void {
    const t = e.currentTarget;
    this.props.newStore.update({
      [t.name]: checked,
    });
  }
  @bind
  protected handleColorStartChange(color: { hex: string }): void {
    this.props.newStore.update({
      gradientStart: color.hex,
    });
  }
  @bind
  protected handleColorEndChange(color: { hex: string }): void {
    this.props.newStore.update({
      gradientEnd: color.hex,
    });
  }
  @bind
  protected handleColorButtonBg(color: { hex: string }): void {
    this.props.newStore.update({
      buttonBg: color.hex,
    });
  }
  @bind
  protected handleColorButtonColor(color: { hex: string }): void {
    this.props.newStore.update({
      buttonColor: color.hex,
    });
  }
  @bind
  protected handleUpload(e: React.SyntheticEvent<HTMLInputElement>): void {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    if (file == null) {
      this.props.newStore.update({
        backgroundImage: null,
      });
      return;
    }
    if (!/^image\/.+$/.test(file.type)) {
      // not image
      this.props.newStore.update({
        backgroundImage: null,
      });
      return;
    }
    // image!
    this.props.newStore.update({
      backgroundImage: file,
    });
  }
  @bind
  protected handleSubmit(e: React.SyntheticEvent<HTMLFormElement>): void {
    e.preventDefault();
    const id = this.props.newStore.id || randomid();
    this.setState({
      publishing: true,
      error: '',
    });
    publishCounter(id, this.props.newStore)
      .then(() => {
        // yeah!
        this.props.navigation.move(`/${id}`, 'push').catch(handleError);
      })
      .catch(err => {
        this.setState({ publishing: false, error: String(err) });
        handleError(err);
      });
  }
}

const LoginInfo = styled.p`
  text-align: right;
`;
const ErrorInfo = styled.p`
  font-size: 0.9em;
  color: red;
`;

const Pickers = styled.div`
  display: flex;
  flex-flow: row wrap;

  > div {
    flex: auto 0 0;
    margin: 0.8em;
  }
`;
const PickerWrapper = styled.div`
  ${phone`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
`};
`;
