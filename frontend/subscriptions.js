import { main$, appDidStart$, logger } from '@shopgate/engage/core';
import { openPageExtern } from '@shopgate/pwa-core';
import { productIsReady$ } from '@shopgate/pwa-tracking/streams/product';
import { getProductRoute } from '@shopgate/engage/product';
import { getCurrentQuery } from '@shopgate/pwa-common/selectors/router';
import { shopNumber } from '@shopgate/pwa-common/helpers/config';
import {
  OPEN_DEEP_LINK,
} from '@shopgate/pwa-common/constants/ActionTypes';
import { sdkUrl, clientId, privacyUrl } from './config';
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

  const onRecommendation = (dispatch, data) => {
    console.log('verifytReady subscriptions Recommended size is ', data);
    dispatch(setVerifytSize(data.size));
    //dispatch(setVerifytSize('9.5'));
  };

  const getInitData = (state, action) => {
    // eslint-disable-next-line camelcase
    const { widget_init_payload = null } = getCurrentQuery(state) || {};

    // router.currentRoute.query.widget_init_payload

    const { productData } = action;

    console.warn(`shopgate-${shopNumber}:/${getProductRoute(productData.id)}`);
    return {
      product_identifier: {
        type: 'sku_group',
        value: productData.id, // productData.id,
      },
      client_id: clientId,
      // sku: productData.id,
      sku: productData.id,
      product_image_url: productData.featuredImageUrl, // optional
      privacy_notice: {
        url: privacyUrl,
      },
      ecomm_integ: {
        redirect_uri: `shopgate-${shopNumber}:/${getProductRoute(productData.id)}`,
        widget_init_payload,
        webview_mode: true,
      },
    };
  };

  subscribe(productIsReady$, ({ dispatch, action, getState }) => {
    console.warn(action, getState());

    if (window.VerifytClient && typeof window.VerifytClient.init === 'function') {
      setTimeout(() => {
        window.VerifytClient.openUrlHandler(({ url }) => {
          console.warn('VerifytClient.init openUrlHandler', url);
          openPageExtern({
            src: url,
          });
        });

        window.VerifytClient.onRecommendation((data) => {
          // console.log('Recommended size is ', data.sizingValue);
          console.log('VerifytClient.init Recommended size is ', data);
          onRecommendation(dispatch, data);
        });

        const initData = getInitData(getState(), action);
        console.warn('VerifytClient.init', initData);
        window.VerifytClient.init(initData);
      }, 100);
    } else {
      window.verifytReady = function () {
        const initData = getInitData(getState(), action);
        console.warn('verifytReady subscriptions.init', initData);
        window.VerifytClient.init(initData);

        window.VerifytClient.openUrlHandler(({ url }) => {
          console.warn('verifytReady subscriptions openUrlHandler', url);
          openPageExtern({
            src: url,
          });
        });

        window.VerifytClient.onRecommendation(data => onRecommendation(dispatch, data));
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

