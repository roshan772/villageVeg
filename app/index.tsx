// app/index.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  Easing,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function StartScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Animation values
  const logoScale = useSharedValue(0.85);
  const logoOpacity = useSharedValue(0);
  const progress = useSharedValue(0);
  const textAnimation = useSharedValue(0);
  const glowAnimation = useSharedValue(0);

  useEffect(() => {
    // Logo breathe + fade in
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.92, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    logoOpacity.value = withTiming(1, { duration: 1600 });

    // Animated text reveal
    textAnimation.value = withDelay(
      400,
      withTiming(1, { duration: 2000, easing: Easing.out(Easing.cubic) }),
    );

    // Glow effect
    glowAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // Progress bar
    progress.value = withTiming(1, { duration: 3200, easing: Easing.linear });

    // Navigation
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  const animatedLogo = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: interpolate(
      glowAnimation.value,
      [0, 1],
      [0.3, 0.7],
      Extrapolate.CLAMP,
    ),
  }));

  const animatedText = useAnimatedStyle(() => {
    const translateY = interpolate(
      textAnimation.value,
      [0, 1],
      [30, 0],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(
      textAnimation.value,
      [0, 0.5, 1],
      [0, 0.5, 1],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const animatedProgress = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      {/* Gradient background layers */}
      <View style={styles.gradientLayer1} />
      <View style={styles.gradientLayer2} />

      <View style={styles.content}>
        {/* Animated glow behind logo */}
        <Animated.View style={[styles.glowCircle, animatedGlow]} />

        {/* Logo with elegant shadow */}
        <Animated.View style={styles.logoWrapper}>
          <View style={styles.logoBackground}>
            <Animated.Image
              source={require("../../villageVeg/assets/images/logo.png")}
              style={[styles.logo, animatedLogo]}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Animated "Village Veg" text with letter spacing */}
        <Animated.View style={[styles.titleContainer, animatedText]}>
          <Text style={styles.title}>
            <Text style={styles.titleWord}>Village</Text>
            <Text style={styles.titleSpacer}> </Text>
            <Text style={styles.titleWord}>Veg</Text>
          </Text>
          <View style={styles.underline} />
        </Animated.View>

        {/* Elegant tagline */}
        <Animated.Text
          entering={FadeIn.duration(1200).delay(1800)}
          style={styles.tagline}
        >
          Fresh from Farm to Table
        </Animated.Text>

        {/* Refined progress bar */}
        <Animated.View
          entering={FadeIn.duration(1000).delay(1400)}
          style={styles.progressContainer}
        >
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, animatedProgress]} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientLayer1: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: "#c8e6c9",
    opacity: 0.5,
  },
  gradientLayer2: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: "#a5d6a7",
    opacity: 0.3,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
    zIndex: 1,
  },
  glowCircle: {
    position: "absolute",
    top: -20,
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: "#66bb6a",
    opacity: 0.3,
  },
  logoWrapper: {
    marginBottom: 56,
  },
  logoBackground: {
    width: width * 0.52,
    height: width * 0.52,
    borderRadius: width * 0.26,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2e7d32",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.15)",
  },
  logo: {
    width: "75%",
    height: "75%",
  },
  titleContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#2e7d32",
    letterSpacing: -1.5,
    textAlign: "center",
    textShadowColor: "rgba(76, 175, 80, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleWord: {
    fontWeight: "900",
  },
  titleSpacer: {
    width: 8,
  },
  underline: {
    width: 80,
    height: 3,
    backgroundColor: "#4caf50",
    borderRadius: 1.5,
    marginTop: 12,
    opacity: 0.8,
  },
  tagline: {
    fontSize: 15,
    fontWeight: "400",
    color: "#388e3c",
    letterSpacing: 1.2,
    textAlign: "center",
    marginBottom: 72,
    fontStyle: "italic",
  },
  progressContainer: {
    width: "75%",
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "#c8e6c9",
    borderRadius: 2,
    overflow: "hidden",
    shadowColor: "#2e7d32",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 2,
  },
});
