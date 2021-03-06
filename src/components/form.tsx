import * as React from 'react';
import styled from 'styled-components';
import { phone } from './media';

/**
 * Form wrapper.
 */
export const Form = styled.form`
  padding-bottom: 1em;
`;
/**
 * One form field.
 */
export class Field extends React.PureComponent<
  {
    title: string;
  },
  {}
> {
  public render() {
    const { title, children } = this.props;
    return (
      <FieldWrapper>
        <FieldTitle>{title}</FieldTitle>
        <FieldInput>{children}</FieldInput>
      </FieldWrapper>
    );
  }
}

const FieldWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  ${phone`
    flex-flow: column nowrap;
    align-items: stretch;
  `} margin: 1.2em 0;
`;
const FieldTitle = styled.div`
  flex: 10em 0 0;
  align-self: center;
  text-align: right;
  padding-right: 1em;
  ${phone`
    flex: auto 0 0;
    align-self: stretch
    text-align: center;
    padding-right: 0;
    padding-bottom: 0.5em;
  `};
`;

const FieldInput = styled.div`
  flex: auto 1 1;
  text-align: left;
  ${phone`
    text-align: center;
  `};
`;

export const Input = styled.input`
  box-sizing: border-box;
  border: 1px solid #cccccc;
  box-shadow: inset 0 0 4px 1px #dddddd;
  border-radius: 0.8em;
  padding: 0.8em;
  width: 100%;
`;
