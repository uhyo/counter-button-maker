import { observable, action } from 'mobx';

/**
 * Store for newly creating a counter page.
 */
export class NewStore {
  @observable id: string = '';
  @observable public title: string = '';
  @observable public description: string = '';
  @observable public buttonLabel: string = '';
  @observable public buttonBg: string = '#42bf99';
  @observable public buttonColor: string = '#ffffff';
  @observable
  public backgroundType: 'default' | 'gradient' | 'image' = 'default';
  @observable public backgroundRepeat: boolean = false;
  /**
   * Background image when uploaded.
   */
  @observable public backgroundImage: Blob | null = null;
  /**
   * URL of background image.
   */
  @observable public backgroundImageURL: string | null = null;
  /**
   * Gradient start.
   */
  @observable public gradientStart: string = '#42f4d9';
  /**
   * Gradient end.
   */
  @observable public gradientEnd: string = '#adddf4';
  /**
   * Whether description and label is under auto control.
   */
  @observable public auto: boolean = true;

  @action
  public update(query: UpdateQuery): void {
    if (query.buttonLabel != null || query.description != null) {
      this.auto = false;
    } else if (query.title != null && this.auto) {
      // auto completion of description and buttonLabel
      const r = query.title.match(/^(.+)ボタン$/);
      if (r != null) {
        query.description = `${
          r[1]
        }をシェアできる全く新しい画期的なWEBサービスです。`;
        query.buttonLabel = r[1];
      }
    }
    // update url.
    if (
      query.backgroundImage !== undefined &&
      query.backgroundImage !== this.backgroundImage
    ) {
      if (this.backgroundImageURL != null) {
        URL.revokeObjectURL(this.backgroundImageURL);
      }
      this.backgroundImageURL =
        query.backgroundImage != null
          ? URL.createObjectURL(query.backgroundImage)
          : null;
    }
    Object.assign(this, query);
  }
}

export type UpdateQuery = Partial<
  Pick<
    NewStore,
    | 'id'
    | 'title'
    | 'description'
    | 'buttonLabel'
    | 'buttonBg'
    | 'buttonColor'
    | 'backgroundType'
    | 'backgroundRepeat'
    | 'backgroundImage'
    | 'gradientStart'
    | 'gradientEnd'
  >
>;
