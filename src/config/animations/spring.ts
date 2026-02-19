import type { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring';

export const SPRING_CONFIG: SpringConfig = {
	stiffness: 860,
	damping: 70,
	mass: 4,
	overshootClamping: false,
	energyThreshold: 6e-9,
	velocity: 0,
};
