import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

import { SPRING_CONFIG } from '@/config/animations/spring';

import { AppTheme } from '@/styles/theme';

export function AnimatedTitle() {
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
		visibility.value = withSpring(1, SPRING_CONFIG);
	}, []);

	return (
		<Animated.Text key="onboarding.title" style={[styles.title, animatedStyle]}>
			Welcome to PVP
		</Animated.Text>
	);
}

export const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		color: AppTheme.color.text.foreground,
		marginTop: 24,
	},
});
