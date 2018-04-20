import { css } from 'styled-components';

/**
 * helper for defining media queries.
 */
export function phone(a: TemplateStringsArray, ...args: any[]) {
  return css`
    @media (max-width: 600px) {
      ${css(a, ...args)};
    }
  `;
}

export function notPhone(a: TemplateStringsArray, ...args: any[]) {
  return css`
    @media (min-width: 600px) {
      ${css(a, ...args)};
    }
  `;
}
