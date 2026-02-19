import FeatherIcon from '@expo/vector-icons/Feather';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
	interpolate,
	type SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

import { SPRING_CONFIG } from '@/config/animations/spring';
import { AppTheme } from '@/styles/theme';

const HINT_MOVING_AREA = 30;

type Props = {
	panTranslationX: SharedValue<number>;
};

export function AnimatedHint({ panTranslationX }: Props) {
	const visibility = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => {
		const introOffset = interpolate(
			visibility.value,
			[0, 1],
			[-HINT_MOVING_AREA, 0]
		);

		const panOffset = interpolate(
			panTranslationX.value,
			[-1, 0, 1],
			[-HINT_MOVING_AREA, 0, HINT_MOVING_AREA]
		);

		return {
			opacity: interpolate(visibility.value, [0, 0.9], [0, 1]),
			transform: [{ translateX: introOffset + panOffset }],
		};
	});

	useEffect(() => {
		const DELAY_IN_MS = 1200; // 👈 1.2s

		const timeout = setTimeout(() => {
			visibility.value = withSpring(1, SPRING_CONFIG);
		}, DELAY_IN_MS);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<Animated.View style={[styles.container, animatedStyle]}>
			<Text style={styles.text}>Slide to unlock</Text>
			<FeatherIcon
				name="arrow-right"
				size={20}
				color={AppTheme.color.text.mutedForeground}
			/>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		marginTop: 18,
	},
	text: {
		fontSize: 16,
		textAlign: 'center',
		color: AppTheme.color.text.mutedForeground,
	},
});
