import { SPRING_CONFIG } from '@/config/animations/spring';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export function useUnlockGesture() {
	const panTranslationX = useSharedValue(0);
	const uiProgress = useSharedValue(0);

	const handleUnlockGesture = Gesture.Pan()
		.onUpdate((event) => {
			const translationX = event.translationX / 144;

			if (translationX >= 1) {
				scheduleOnRN(triggerUnlockHaptic);
			} else {
				scheduleOnRN(triggerLockHaptic);
			}

			panTranslationX.value = translationX;
			uiProgress.value = Math.min(translationX, 1);
		})
		.onEnd(() => {
			panTranslationX.value = withSpring(0, SPRING_CONFIG);

			if (panTranslationX.value >= 1) {
				uiProgress.value = 1;
			} else {
				uiProgress.value = withTiming(0, {
					duration: 220,
				});
			}

			scheduleOnRN(triggerReleaseHaptic);
		});

	return {
		handleUnlockGesture,
		panTranslationX,
		uiProgress,
	};
}

let directionState: 'idle' | 'unlocked' | 'locked' = 'idle';

function triggerReleaseHaptic() {
	directionState = 'idle';

	if (Platform.OS === 'android') {
		Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Gesture_End);
	} else {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
	}
}

function triggerUnlockHaptic() {
	if (directionState === 'unlocked') {
		return;
	}

	directionState = 'unlocked';

	if (Platform.OS === 'android') {
		Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
	} else {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
	}
}

function triggerLockHaptic() {
	if (directionState === 'idle' || directionState === 'locked') {
		return;
	}

	directionState = 'locked';

	if (Platform.OS === 'android') {
		Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Gesture_End);
	} else {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
	}
}
