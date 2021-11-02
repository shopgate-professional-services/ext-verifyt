import { SET_VERIFYT_SIZE } from '../constants';

/**
 * @param {string} size
 * @return {Object}
 */
export const setVerifytSize = size => ({
  type: SET_VERIFYT_SIZE,
  size,
});
