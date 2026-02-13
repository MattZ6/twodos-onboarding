import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const BACK_LOGO_SIZE = 108;
const FRONT_LOGO_SIZE = 116;

const INITIAL_BACK_LOGO_ROTATION = 0.12
const INITIAL_FRONT_LOGO_ROTATION = 0.12

const triggerHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
}

export default function TabOneScreen() {
  const panX = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      panX.value = event.translationX / 144
    })
    .onEnd(() => {
      panX.value = withSpring(0, {
        damping: 10,
        stiffness: 250,
        mass: 1,
        velocity: 6,
      });
      
      scheduleOnRN(triggerHaptic)
    });

  const backLogoStyles =  useAnimatedStyle(() => {
    let rotation = interpolate(
      panX.value,
      [0, 1],
      [-INITIAL_BACK_LOGO_ROTATION, -(INITIAL_BACK_LOGO_ROTATION * 1.75 )],
    );

    if (panX.value < 0){
      rotation = interpolate(
        panX.value,
        [-1, 0],
        [0, -INITIAL_BACK_LOGO_ROTATION],
        "clamp"
      );
    }

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

  const frontLogoStyles = useAnimatedStyle(() => {
    let rotation = interpolate(
      panX.value,
      [0, 1],
      [INITIAL_FRONT_LOGO_ROTATION, INITIAL_FRONT_LOGO_ROTATION * 1.75 ],
    );

    if (panX.value < 0){
      rotation = interpolate(
        panX.value,
        [-1, 0],
        [0, INITIAL_FRONT_LOGO_ROTATION],
        "clamp"
      );
    }

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

  const hintTransforms = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            panX.value,
            [-1, 0, 1],
            [-35, 0, 35]
          ) 
        }
      ],
    }
  });
  

  return (
    <GestureHandlerRootView style={styles.root}>
      <GestureDetector gesture={panGesture}>

        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Animated.View style={[styles.logoSquare, styles.backLogo, backLogoStyles]} />
            <Animated.View style={[styles.logoSquare, styles.frontLogo, frontLogoStyles]} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Welcome to PVP</Text>
            <Text style={styles.description}>A delightfully simple todo app that{'\n'}respects your focus and privacy.</Text>

            <Animated.View style={[styles.hintContainer, hintTransforms]}>
              <Text style={styles.hint}>Slide to Unlock</Text>
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
    backgroundColor: "#f8e5a7",
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
    gap: 16,
    marginTop: 18,
  },
  hint: {
    fontSize: 16,
    textAlign: "center",
    color: "#999999",
  },
});
