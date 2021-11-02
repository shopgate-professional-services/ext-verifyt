import { main$, appDidStart$, logger } from '@shopgate/engage/core';
import { openPageExtern } from '@shopgate/pwa-core';
import { productIsReady$ } from '@shopgate/pwa-tracking/streams/product';
import { getProductRoute } from '@shopgate/engage/product';
import { getCurrentQuery } from '@shopgate/pwa-common/selectors/router';
import {
  OPEN_DEEP_LINK,
} from '@shopgate/pwa-common/constants/ActionTypes';
import { sdkUrl, clientId } from './config';
import { setVerifytSize } from './action-creators';

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

    /*
    window.VerifytClient.onRecommendation((data) => {
      console.log('Recommended size is ', data.sizingValue);
    });
     */
  });

  subscribe(productIsReady$, ({ dispatch, action, getState }) => {
    console.warn(action, getState());

    const state = getState();

    const { widget_init_payload = null } = getCurrentQuery(state) || {};

    // router.currentRoute.query.widget_init_payload

    const { productData } = action;
    // TODO: check url for GET param widget_init_payload and init with it

    console.warn(`shopgate-31490:/${getProductRoute(productData.id)}`);

    if (window.VerifytClient && typeof window.VerifytClient.init === 'function') {
      setTimeout(() => {
        window.VerifytClient.openUrlHandler(({ url }) => {
          console.warn('VerifytClient.init openUrlHandler', url);
          openPageExtern({
            src: url,
          });
        });

        window.VerifytClient.onRecommendation((data) => {
          //console.log('Recommended size is ', data.sizingValue);
          console.log('VerifytClient.init Recommended size is ', data);
        });

        console.warn('VerifytClient.init');
        window.VerifytClient.init({
          product_identifier: {
            type: 'sku_group',
            value: '320440', // productData.id,
          },
          client_id: clientId,
          // sku: productData.id,
          sku: '320440',
          product_image_url: productData.featuredImageUrl, // optional
          ecomm_integ: {
            redirect_uri: `shopgate-31490:/${getProductRoute(productData.id)}`,
            widget_init_payload,
            webview_mode: true,
          },
        });
      }, 100);

    } else {
      window.verifytReady = function () {
        console.warn('verifytReady subscriptions');
        window.VerifytClient.init({
          product_identifier: {
            type: 'sku_group',
            value: '320440', // productData.id,
          },
          client_id: clientId,
          product_image_url: productData.featuredImageUrl, // optional
          ecomm_integ: {
            redirect_uri: `shopgate-31490:/${getProductRoute(productData.id)}`,
            widget_init_payload,
            webview_mode: true,
          },
        });

        window.VerifytClient.openUrlHandler(({ url }) => {
          console.warn('verifytReady subscriptions openUrlHandler', url);
          openPageExtern({
            src: url,
          });
        });

        window.VerifytClient.onRecommendation((data) => {
          //console.log('Recommended size is ', data.sizingValue);
          console.log('verifytReady subscriptions Recommended size is ', data);

          // dispatch(setVerifytSize(data.size));
          dispatch(setVerifytSize('9.5'));

          // TODO: add reducer + selector
          // component use select() from productContext on prop change

          // size: "USM 9.5"
        });
      };

    }
  });

  const deeplinkOpened$ = main$
    .filter(({ action }) => action.type === OPEN_DEEP_LINK);

  subscribe(deeplinkOpened$, ({ dispatch, action }) => {
    console.warn('deeplinkOpened$', action);
    // action.payload.link
  });
};

