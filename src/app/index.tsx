import { AnimatedLogoSvg } from "@/components/animated-logo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const BACK_LOGO_SIZE = 108;
const FRONT_LOGO_SIZE = 116;

const INITIAL_BACK_LOGO_ROTATION = 0.15
const INITIAL_FRONT_LOGO_ROTATION = 0.12

const HINT_MOVING_AREA = 30;

let directionState: 'idle' | 'unlocked' | 'locked' = 'idle'

function triggerReleaseHaptic () {
  directionState = 'idle'
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
}

function triggerUnlockHaptic () {
  if (directionState === 'unlocked'){
    return
  }

  directionState = 'unlocked';
  
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
}

function triggerLockHaptic () {
  if (directionState === 'idle' || directionState === 'locked'){
    return
  }

  directionState = 'locked';
  
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
}

function triggerIntroHaptic() {
  Haptics.selectionAsync();
}

export default function TabOneScreen() {
  const gestureProgress = useSharedValue(0);
  const uiProgress = useSharedValue(0);

  const titleIntro = useSharedValue(0)
  const descriptionIntro = useSharedValue(0)
  const logosIntro = useSharedValue(0)

  const handlePanGesture = Gesture.Pan()
    .onUpdate((event) => {
      const translationX = Math.min(event.translationX / 144, 1);

      if (translationX >= 1) {
        scheduleOnRN(triggerUnlockHaptic)
      }else {
        scheduleOnRN(triggerLockHaptic)
      }

      gestureProgress.value = translationX;
      uiProgress.value = translationX;
    })
    .onEnd(() => {
      gestureProgress.value = withSpring(0, {
        damping: 14,
        stiffness: 250,
        mass: 1,
        velocity: 6,
      });

      if (gestureProgress.value >= 1) {
        uiProgress.value = 1;
      } else {
        uiProgress.value = withTiming(0, {
          duration: 220,
        });
      }
      
      scheduleOnRN(triggerReleaseHaptic);
    });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
        opacity: titleIntro.value,
        transform: [
          { translateY: (1 - titleIntro.value) * 20 }
        ]
    }
  });

  const descriptionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: descriptionIntro.value,
      transform: [
        { translateY: (1 - descriptionIntro.value) * 20 }
      ]
    }
  });

  const logoContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        titleIntro.value,
        [0, 0.5],
        [0, 1],
        "clamp"
      ),
    }
  });

  const backLogoAnimatedStyle =  useAnimatedStyle(() => {
    const baseRotation = interpolate(
      logosIntro.value,
      [0, 1],
      [0, -INITIAL_BACK_LOGO_ROTATION]
    )

    let deltaRotation = 0

    if (gestureProgress.value > 0) {
      deltaRotation = interpolate(
        gestureProgress.value,
        [0, 1],
        [0, -(INITIAL_BACK_LOGO_ROTATION * 0.5)]
      )
    }

    if (gestureProgress.value < 0) {
      deltaRotation = interpolate(
        gestureProgress.value,
        [-1, 0],
        [INITIAL_BACK_LOGO_ROTATION, 0],
        "clamp"
      )
    }

    const rotation = baseRotation + deltaRotation

    const offset = FRONT_LOGO_SIZE / 2

    return {
      transform: [
        { translateX: offset },
        { translateY: offset },
        { rotateZ: `${rotation}rad` },
        { translateX: -offset },
        { translateY: -offset },
      ]
    }
  });

  const frontLogoAnimatedStyle = useAnimatedStyle(() => {
    const baseRotation = interpolate(
      logosIntro.value,
      [0, 1],
      [0, INITIAL_FRONT_LOGO_ROTATION]
    )

    let deltaRotation = 0

    if (gestureProgress.value > 0) {
      deltaRotation = interpolate(
        gestureProgress.value,
        [0, 1],
        [0, INITIAL_FRONT_LOGO_ROTATION * 1.5]
      )
    }

    if (gestureProgress.value < 0) {
      deltaRotation = interpolate(
        gestureProgress.value,
        [-1, 0],
        [-INITIAL_FRONT_LOGO_ROTATION, 0],
        "clamp"
      )
    }

    const rotation = baseRotation + deltaRotation
    
    const offset = FRONT_LOGO_SIZE / 2

    return {
      transform: [
        { translateX: offset },
        { translateY: offset },
        { rotateZ: `${rotation}rad` },
        { translateX: -offset },
        { translateY: -offset },
        { translateY:  "5%" }
      ]
    }
  });

  const hintAnimatedStyle = useAnimatedStyle(() => {
    const introOffset = interpolate(
      logosIntro.value,
      [0, 1],
      [-HINT_MOVING_AREA, 0],
    );

    const panOffset = interpolate(
      gestureProgress.value,
      [-1, 0, 1],
      [-HINT_MOVING_AREA, 0, HINT_MOVING_AREA],
    );

    return {
      opacity: interpolate(
        logosIntro.value,
        [0, 0.9],
        [0, 1]
      ),
      transform: [
        { translateX: introOffset + panOffset }
      ],
    }
  });

  useEffect(() => {
    titleIntro.value = withDelay(
      150,
      withSpring(1, {
        damping: 17,
        stiffness: 250,
        mass: 0.7,
      })
    );

    descriptionIntro.value = withDelay(
      400,
      withSpring(1, {
        damping: 17,
        stiffness: 250,
        mass: 0.7,
      })
    );

    const delay = 1200

    const timeout = setTimeout(() => {
      scheduleOnRN(triggerIntroHaptic)

      logosIntro.value = withSpring(1, {
        damping: 17,
        stiffness: 250,
        mass: 0.7,
      })
    }, delay)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <GestureHandlerRootView style={styles.root}>
      <GestureDetector gesture={handlePanGesture}>
        <View style={styles.container}>
          <Animated.View style={[styles.logoContainer, logoContainerAnimatedStyle]}>
            <Animated.View style={[styles.logoSquare, styles.backLogo, backLogoAnimatedStyle]} />
            <Animated.View style={[styles.logoSquare, styles.frontLogo, frontLogoAnimatedStyle]}>
              <AnimatedLogoSvg panX={uiProgress} />
            </Animated.View>
          </Animated.View>

          <View style={styles.content}>
            <Animated.Text style={[styles.title, titleAnimatedStyle]}>
              Welcome to PVP
            </Animated.Text>
            <Animated.Text style={[styles.description, descriptionAnimatedStyle]}>
              A delightfully simple todo app that{'\n'}respects your focus and privacy.
            </Animated.Text>

            <Animated.View style={[styles.hintContainer, hintAnimatedStyle]}>
              <Text style={styles.hint}>Slide to unlock</Text>
              <FontAwesome name="long-arrow-right" size={16} color="#999999" />
            </Animated.View>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000"
  },
  content: {
    paddingHorizontal: 48,
    marginTop: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: FRONT_LOGO_SIZE,
    height: FRONT_LOGO_SIZE,
    alignSelf: "center",
  },
  logoSquare: {
    position: "absolute",
    width: FRONT_LOGO_SIZE,
    height: FRONT_LOGO_SIZE,
    borderRadius: 28,
    backgroundColor: "#f3ecd7",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#000000",
    shadowRadius: 2,
    shadowOpacity: 0.1
  },
  backLogo: {
    width: BACK_LOGO_SIZE,
    height: BACK_LOGO_SIZE,
    borderRadius: 24,
    opacity: 0.5,
    zIndex: 0,
  },
  frontLogo: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
    marginTop: 24
  },
  description: {
    fontSize: 17,
    lineHeight: 20,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 18
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },
  hint: {
    fontSize: 16,
    textAlign: "center",
    color: "#999999",
  },
});
