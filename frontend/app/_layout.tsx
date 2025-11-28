import { Stack } from 'expo-router';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { StripeProvider } from '@stripe/stripe-react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const publishableKey = "pk_test_51RxlCmJRZA9qVgZRaQ33L2Frcm4mufUMmrubMdPQ4NH91B13odkqt0WxKwqxNNQnMwsWOtDBI5MIkfGMmeyiA4wb00P2yZMndS"
  return (
    <StripeProvider publishableKey={publishableKey}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
      </Stack>
      <Toast />
    </StripeProvider>
  );
}
