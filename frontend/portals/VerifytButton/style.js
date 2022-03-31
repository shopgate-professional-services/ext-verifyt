import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

const container = css({
  margin: `0 ${variables.gap.big}px`,
  boxShadow: `0 -1px 0 0 ${colors.darkGray}`,
}).toString();

export default {
  container,
};
