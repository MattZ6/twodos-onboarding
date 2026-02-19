import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
} from 'react-native-reanimated';

import { SPRING_CONFIG } from '@/config/animations/spring';

import { AppTheme } from '@/styles/theme';

export function AnimatedDescription() {
	const visibility = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: visibility.value,
			transform: [
				{ translateY: interpolate(visibility.value, [0, 1], [4, 0]) },
			],
		};
	});

	useEffect(() => {
		visibility.value = withDelay(400, withSpring(1, SPRING_CONFIG));
	}, []);

	return (
		<Animated.Text
			key="onboarding.description"
			style={[styles.description, animatedStyle]}
		>
			A delightfully simple todo app that{'\n'}respects your focus and privacy.
		</Animated.Text>
	);
}

export const styles = StyleSheet.create({
	description: {
		fontSize: 17,
		lineHeight: 20,
		textAlign: 'center',
		color: AppTheme.color.text.foreground,
		marginTop: 18,
	},
});
