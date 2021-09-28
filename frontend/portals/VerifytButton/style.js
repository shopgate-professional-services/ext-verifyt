import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

const container = css({
  margin: `0 ${variables.gap.big}px`,
  boxShadow: `0 -1px 0 0 ${colors.darkGray}`,
}).toString();

const grid = css({
  alignItems: 'center',
  minHeight: 50,
  position: 'relative',
  zIndex: 2,
}).toString();

const inner = css({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: 56,
  hyphens: 'auto',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
}).toString();

export default {
  container,
  grid,
  inner,
};
