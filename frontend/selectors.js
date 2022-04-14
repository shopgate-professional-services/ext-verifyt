import { createSelector } from 'reselect';
import { getUserDisplayName, getUserEmail } from '@shopgate/engage/user';

export const getUserData = createSelector(
  getUserDisplayName,
  getUserEmail,
  (name, email) => {
    if (!email || !name) {
      return null;
    }

    return {
      name,
      email,
    };
  }
);
