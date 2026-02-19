import { StyleSheet, View } from 'react-native';
import {
	GestureDetector,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';

import { AnimatedDescription } from '@/components/animated-description';
import { AnimatedHint } from '@/components/animated-hint';
import { AnimatedLogo } from '@/components/animated-logo';
import { AnimatedTitle } from '@/components/animated-title';

import { useUnlockGesture } from '@/hooks/use-unlock-gesture';

import { AppTheme } from '@/styles/theme';

export default function OnboardingScreen() {
	const { handleUnlockGesture, panTranslationX, uiProgress } =
		useUnlockGesture();

	return (
		<GestureHandlerRootView style={styles.root}>
			<GestureDetector gesture={handleUnlockGesture}>
				<View style={styles.container}>
					<AnimatedLogo
						panTranslationX={panTranslationX}
						uiProgress={uiProgress}
					/>

					<View style={styles.content}>
						<AnimatedTitle />
						<AnimatedDescription />
						<AnimatedHint panTranslationX={panTranslationX} />
					</View>
				</View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: AppTheme.color.background.base,
	},
	content: {
		paddingHorizontal: 48,
		marginTop: 20,
		zIndex: 10,
	},
});
