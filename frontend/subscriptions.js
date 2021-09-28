import { appDidStart$, logger } from '@shopgate/engage/core';
import { productIsReady$ } from '@shopgate/pwa-tracking/streams/product';
import { sdkUrl, clientId } from './config';

export default (subscribe) => {
  const ready = false;

  subscribe(appDidStart$, ({ getState }) => {
    if (!sdkUrl) {
      logger.warn('verifyt: No sdk url configured');
      return;
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.crossorigin = 'anonymous';
    script.src = sdkUrl;
    const parent = document.getElementsByTagName('head')[0];
    parent.appendChild(script);
  });

    return;
  subscribe(productIsReady$, ({ dispatch, action }) => {
    console.warn(action);
    return;

    // TODO: check url for GET param widget_init_payload and init with it

    if (window.VerifytClient && typeof window.VerifytClient.init === 'function') {

      window.VerifytClient.init({
        client_id: clientId,
        sku: '<sku-of-your-product>',
        product_image_url: '<url-path-to-product-image>', // optional
        ecomm_integ: {
          redirect_uri: '<redirect-uri>',
          widget_init_payload: null,
          webview_mode: true,
        },
        product_identifier: {
          type: '<identifier-type>',
          value: '<product-identifier-value>',
        },
      });
    } else {
      window.verifytReady = function () {

      };
    }
  });
/*
  subscribe(deeplinkOpened$, ({ dispatch, action }) => {
    console.warn(action.payload.link);

    // TODO:
    const deeplinkOpened$ = main$
      .filter(({ action }) => action.type === OPEN_DEEP_LINK);
  });

 */
};

