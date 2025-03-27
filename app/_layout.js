import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../app/store/store";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
    <Stack screenOptions={{ headerShown: false }}/>
    </Provider>
    </GestureHandlerRootView>
  );
}
