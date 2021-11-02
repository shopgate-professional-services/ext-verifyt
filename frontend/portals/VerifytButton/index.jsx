import React, { useEffect, useContext } from 'react';
import { ProductContext, VariantContext } from '@shopgate/engage/product';
import styles from './style';

/**
 * @returns {JSX}
 */
const VerifytButton = () => {
  useEffect(() => {
    console.warn('VerifytButton did mount');
    if (window.VerifytClient) {
      console.warn('VerifytClient.parse()');
      window.VerifytClient.parse();
    } else {
      window.verifytReady = function () {
        //console.warn('verifytReady');
        window.VerifytClient.parse();
      };
    }
  }, []);

  return (
    <div>
      <h1>verifyt SDK</h1>
      <verifyt-sdk></verifyt-sdk>
    </div>
  );
};

export default VerifytButton;
