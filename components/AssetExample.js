import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, Image } from 'react-native';

const taglines = [
  "Forecast So Good, It's Probably Wrong.",
  "Predicting Raindrops before they hit your head.",
  "We tell you when to carry an Umbrella (or not).",
  "Created by Sk Ibrahim & team (well, nobody)."
];

export default function SplashScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate floating icon up and down
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
      ])
    ).start();
  }, [floatAnim]);

  useEffect(() => {
    // Cycle taglines every 3 seconds with fade animation
    const interval = setInterval(() => {
      // 1. Fade out the current tagline
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // 2. After fade-out, update the tagline content
        setCurrentIndex((prev) => (prev + 1) % taglines.length);
        // 3. Then, fade in the new tagline
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000); // Note: The 3000ms interval triggers the start of this 1000ms animation sequence (500ms fade-out + 500ms fade-in).

    return () => clearInterval(interval);
  }, [fadeAnim]); // Added fadeAnim to dependency array for completeness, though it's a ref.

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ translateY: floatAnim }] }]}>
        {/* Replace below Image with your icon or SVG */}
        <Image
          source={require('./assets/sun-icon.png')} // Make sure this path is correct for your icon
          style={styles.icon}
          resizeMode="contain"
        />
      </Animated.View>

      <Text style={styles.title}>Skycast</Text>

      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        {taglines[currentIndex]}
      </Animated.Text>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87ceeb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    width: width * 0.4,
    height: width * 0.4,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
    letterSpacing: 4,
    // fontFamily: 'Montserrat', // Make sure you have loaded custom fonts if using them
  },
  tagline: {
    fontSize: 18,
    color: '#2563eb',
    fontWeight: '600',
    textAlign: 'center',
    height: 40, // keeps height stable during fade transitions
    // fontFamily: 'OpenSans', // Make sure you have loaded custom fonts if using them
  },
});
