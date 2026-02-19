import * as Haptics from "expo-haptics";
import { Platform, View } from 'react-native';
import Animated, { SharedValue, useAnimatedProps, useAnimatedReaction } from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

const AnimatedRect = Animated.createAnimatedComponent(Rect)

const LOGO_SIZE = 72;

const STROKE = 7;
const RADIUS = 18;
const SIZE = LOGO_SIZE;

const PERIMETER =
  (4 * (SIZE - 2 * RADIUS)) +
  (2 * Math.PI * RADIUS);

const TOP_EDGE_LENGTH = SIZE - 2 * RADIUS
const START_OFFSET = TOP_EDGE_LENGTH / 2

type Props = {
  panX: SharedValue<number>
}

const svgRotation = Platform.select({
  android: '90deg',
  default: '-90deg',
});

function triggerHaptic () {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
}

export function AnimatedLogoSvg({ panX }: Props) {
  const animatedBorderProps = useAnimatedProps(() => {
    const progress = Math.max(0, Math.min(panX.value, 1))

    return {
      strokeDashoffset: PERIMETER * (1 - progress) + START_OFFSET,
    }
  });

  useAnimatedReaction(
    () => panX.value,
    (current, previous) => {
      if (previous !== undefined && previous !== null) {
        const previousProgress = Math.max(0, Math.min(previous, 1));
        const currentProgress = Math.max(0, Math.min(current, 0))

        if (previousProgress < 1 && currentProgress >= 1) {
          scheduleOnRN(triggerHaptic)
        }
      }
    }
  );

  return (
    <View>
      <Svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: [{ rotate: svgRotation }] }}
      >
        <Rect
          x={STROKE / 2}
          y={STROKE / 2}
          width={SIZE - STROKE}
          height={SIZE - STROKE}
          rx={RADIUS}
          ry={RADIUS}
          stroke="rgb(245, 216, 122, 0.8)"
          strokeWidth={STROKE}
          fill="transparent"
        />

        <AnimatedRect
          x={STROKE / 2}
          y={STROKE / 2}
          width={SIZE - STROKE}
          height={SIZE - STROKE}
          rx={RADIUS}
          ry={RADIUS}
          stroke="#000000"
          strokeWidth={STROKE}
          fill="transparent"
          strokeDasharray={PERIMETER}
          animatedProps={animatedBorderProps}
          strokeLinecap="round"
        />
      </Svg>

      <Svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{position: 'absolute'}}
      >
        <Path
          d="M22 38 L32 48 L50 26"
          stroke="#000000"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  )
}