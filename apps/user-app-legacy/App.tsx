
/* QA′ push overlay */
const __PushOverlay = () => {
  const [seen, setSeen] = useState(!!(globalThis as any).__PUSH_SEEN__</>);
  useEffect(() => {
    bindPushIndicator?.((v: boolean) => {
      (globalThis as any).__PUSH_SEEN__ = v;
      setSeen(true);
    });
    const sub = Linking.addEventListener('url', async ({ url }) => {
      if (url && url.includes('e2e-trigger-push')) {
        try {
          await Notifications.presentNotificationAsync({ title: 'E2E', body: 'local-notification' });
        } catch {}
      }
    });
    // initial URL
    Linking.getInitialURL().then(async (url) => {
      if (url && url.includes('e2e-trigger-push')) {
        try {
          await Notifications.presentNotificationAsync({ title: 'E2E', body: 'local-notification' });
        } catch {}
      }
    }).catch(()=>{});
    const t = setInterval(() => setSeen(!!(globalThis as any).__PUSH_SEEN__), 500);
    return (<>
<__PushOverlay />) => { try { sub.remove(); } catch {}; clearInterval(t); };
  }, []);
  if (!seen) return null;
  return <View testID="push-received" accessibilityLabel="push-received" />;
};

import { bindPushIndicator } from './src/push';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
(()=>{ registerForPushNotificationsAsync().then(()=>attachNotificationListeners()); })();
import { registerForPushNotificationsAsync, attachNotificationListeners } from './src/push';
import './src/observability';

// Phase D: global error handler → Sentry
try {
  const defaultHandler = (ErrorUtils as any)?.getGlobalHandler?.();
  (ErrorUtils as any)?.setGlobalHandler?.((e: any, isFatal?: boolean) => {
    try { (Sentry as any).captureException?.(e, { tags: { isFatal } }); } catch {}
    defaultHandler && defaultHandler(e, isFatal);
  });
} catch {}

// Sentry init (Phase C)
import * as Sentry from 'sentry-expo';
Sentry.init({
  tracesSampleRate: parseFloat(process.env.EXPO_PUBLIC_TRACES_SAMPLE_RATE || '0.2'),
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: false
});
import React, { useEffect } from 'react';
import { I18nManager, Text, View } from 'react-native';
import AppNavigator from './src/AppNavigator';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({ Yekan: require('./assets/fonts/Yekan.ttf') });

  useEffect(() => {
    try {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    } catch {}
  }, []);

  if (!fontsLoaded) return <View />;

  const oldRender = Text.render;
  // @ts-ignore – force default font family
  Text.render = function (...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, { style: [{ fontFamily: 'Yekan' }, origin.props.style] });
  };

  return <AppNavigator />;
}
