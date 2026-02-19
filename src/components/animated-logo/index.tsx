import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
	interpolate,
	type SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { SPRING_CONFIG } from '@/config/animations/spring';

import { AppTheme } from '@/styles/theme';

import { AnimatedSvg } from './components/animated-svg';

const BACK_LOGO_SIZE = 108;
const FRONT_LOGO_SIZE = 116;

const INITIAL_BACK_LOGO_ROTATION = 0.15;
const INITIAL_FRONT_LOGO_ROTATION = 0.12;

function triggerIntroHaptic() {
	Haptics.selectionAsync();
}

type Props = {
	panTranslationX: SharedValue<number>;
	uiProgress: SharedValue<number>;
};

export function AnimatedLogo({ panTranslationX, uiProgress }: Props) {
	const logoVisibility = useSharedValue(0);

	const containerAnimatedStyle = useAnimatedStyle(() => {
		return {
			// opacity: interpolate(titleIntro.value, [0, 0.5], [0, 1], 'clamp'),
			opacity: 1,
		};
	});

	const backSquareAnimatedStyle = useAnimatedStyle(() => {
		const baseRotation = interpolate(
			logoVisibility.value,
			[0, 1],
			[0, -INITIAL_BACK_LOGO_ROTATION]
		);

		let deltaRotation = 0;

		if (panTranslationX.value > 0) {
			deltaRotation = interpolate(
				panTranslationX.value,
				[0, 1],
				[0, -(INITIAL_BACK_LOGO_ROTATION * 0.5)]
			);
		}

		if (panTranslationX.value < 0) {
			deltaRotation = interpolate(
				panTranslationX.value,
				[-1, 0],
				[INITIAL_BACK_LOGO_ROTATION, 0],
				'clamp'
			);
		}

		const rotation = baseRotation + deltaRotation;

		const offset = FRONT_LOGO_SIZE / 2;

		return {
			transform: [
				{ translateX: offset },
				{ translateY: offset },
				{ rotateZ: `${rotation}rad` },
				{ translateX: -offset },
				{ translateY: -offset },
			],
		};
	});

	const frontSquareAnimatedStyle = useAnimatedStyle(() => {
		const baseRotation = interpolate(
			logoVisibility.value,
			[0, 1],
			[0, INITIAL_FRONT_LOGO_ROTATION]
		);

		let deltaRotation = 0;

		if (panTranslationX.value > 0) {
			deltaRotation = interpolate(
				panTranslationX.value,
				[0, 1],
				[0, INITIAL_FRONT_LOGO_ROTATION * 1.5]
			);
		}

		if (panTranslationX.value < 0) {
			deltaRotation = interpolate(
				panTranslationX.value,
				[-1, 0],
				[-INITIAL_FRONT_LOGO_ROTATION, 0],
				'clamp'
			);
		}

		const rotation = baseRotation + deltaRotation;

		const offset = FRONT_LOGO_SIZE / 2;

		return {
			transform: [
				{ translateX: offset },
				{ translateY: offset },
				{ rotateZ: `${rotation}rad` },
				{ translateX: -offset },
				{ translateY: -offset },
				{ translateY: '5%' },
			],
		};
	});

	useEffect(() => {
		const DELAY_IN_MS = 1200; // 👈 1.2s

		const timeout = setTimeout(() => {
			scheduleOnRN(triggerIntroHaptic);

			logoVisibility.value = withSpring(1, SPRING_CONFIG);
		}, DELAY_IN_MS);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<Animated.View style={[styles.container, containerAnimatedStyle]}>
			<Animated.View
				style={[styles.square, styles.backSquare, backSquareAnimatedStyle]}
			/>
			<Animated.View
				style={[styles.square, styles.frontSquare, frontSquareAnimatedStyle]}
			>
				<AnimatedSvg panX={uiProgress} />
			</Animated.View>
		</Animated.View>
	);
}

export const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		width: FRONT_LOGO_SIZE,
		height: FRONT_LOGO_SIZE,
		alignSelf: 'center',
	},
	square: {
		position: 'absolute',
		width: FRONT_LOGO_SIZE,
		height: FRONT_LOGO_SIZE,
		borderRadius: 28,
		backgroundColor: AppTheme.color.background.logoSquare,
		shadowOffset: { width: 2, height: 2 },
		shadowColor: '#000000',
		shadowRadius: 2,
		shadowOpacity: 0.1,
	},
	backSquare: {
		width: BACK_LOGO_SIZE,
		height: BACK_LOGO_SIZE,
		borderRadius: 24,
		opacity: 0.5,
		zIndex: 0,
	},
	frontSquare: {
		zIndex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
