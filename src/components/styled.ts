import { ThemedStyledFunction } from 'styled-components';
/**
 * Utility for definining props of styledccomponents.
 * See https://github.com/styled-components/styled-components/issues/630
 */
export const withProps = <U>() => <P, T, O>(
  fn: ThemedStyledFunction<P, T, O>,
) => fn as ThemedStyledFunction<P & U, T, O & U>;
