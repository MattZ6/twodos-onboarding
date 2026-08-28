import FeatherIcons from '@expo/vector-icons/Feather';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loadingFonts, error] = useFonts({
		...FeatherIcons.font,
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loadingFonts) {
			SplashScreen.hideAsync();
		}
	}, [loadingFonts]);

	if (!loadingFonts) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<ThemeProvider value={DarkTheme}>
			<Stack screenOptions={{ headerShown: false }} />
		</ThemeProvider>
	);
}
