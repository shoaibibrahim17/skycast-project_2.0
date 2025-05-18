import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Share,
  Vibration,
  StatusBar,
  Dimensions,
  Switch,
  Keyboard,
  Easing, // Import Easing for animated effects
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

const { width, height } = Dimensions.get('window');

// --- THEME COLORS ---
const lightTheme = {
  gradientColors: ['#6DD5FA', '#FF7F00'], // Light blue to orange
  text: '#333333',
  subText: '#555555',
  accentColor: '#FF7F00',
  inputBg: '#FFFFFF',
  inputBorder: '#CCCCCC',
  buttonBg: '#4c669f',
  cardBg: 'rgba(255, 255, 255, 0.9)',
  tabActive: '#4c669f',
  tabInactive: '#999999',
  factBg: 'rgba(255, 255, 255, 0.8)',
};

const darkTheme = {
  gradientColors: ['#1A2980', '#26D0CE'], // Dark blue to turquoise
  text: '#FFFFFF',
  subText: '#BBBBBB',
  accentColor: '#26D0CE',
  inputBg: '#333333',
  inputBorder: '#555555',
  buttonBg: '#26D0CE',
  cardBg: 'rgba(0, 0, 0, 0.6)',
  tabActive: '#26D0CE',
  tabInactive: '#666666',
  factBg: 'rgba(0, 0, 0, 0.7)',
};

// --- SUBTITLES ---
const SUBTITLES = [
  "No filter, just forecast.",
  "Weather, unadulterated.",
  "Forecasts, straight up.",
  "Your daily dose of meteorological mayhem."
];

// --- FAKE WEATHER FACTS ---
const WEATHER_FACTS = [
  "Did you know: Clouds are just the Earth's pillows. That's why it's always so sleepy.",
  "A single raindrop can weigh more than your entire life's regrets. Probably.",
  "The wind isn't just moving air, it's the Earth sighing dramatically.",
  "If you hear thunder, it means the sky is playing bowling. Don't worry, it's not very good.",
  "Sunsets are just the sun doing a mic drop after a long day of shining.",
  "Snowflakes are like tiny, frozen personal trainers - they make you work harder for warmth.",
  "Fog is just clouds coming down to give you a hug. A damp, vision-obscuring hug.",
  "Rainbows are proof that the sky has an excellent sense of fashion.",
  "Tornadoes are the Earth's way of demonstrating its spin moves.",
  "The weather forecast is usually 50% accurate. The other 50% is pure optimism.",
];

export default function App() {
  // State hooks
  const [activeTab, setActiveTab] = useState('skycast_now');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showRealWeather, setShowRealWeather] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [fakeData, setFakeData] = useState(null);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [weatherFact, setWeatherFact] = useState('');
  const [currentLoadingMsg, setCurrentLoadingMsg] = useState('Consulting the cosmic currents...');

  // Feedback tab states
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackUserName, setFeedbackUserName] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const factFadeAnim = useRef(new Animated.Value(1)).current;
  const tabFadeAnim = useRef(new Animated.Value(1)).current;

  const viewShotRef = useRef();

  // Effects
  useEffect(() => {
    loadSettings();
    rotateSubtitle(); // Initial call
    setRandomWeatherFact(); // Initial call
    const subtitleInterval = setInterval(rotateSubtitle, 7000);
    return () => clearInterval(subtitleInterval);
  }, []);

  const themeColors = darkMode ? darkTheme : lightTheme;

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const loadSettings = async () => {
    try {
      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      if (storedDarkMode !== null) {
        setDarkMode(JSON.parse(storedDarkMode));
      }
    } catch (error) {
      console.error('Failed to load dark mode setting:', error);
    }
  };

  const rotateSubtitle = () => {
    setCurrentSubtitleIndex((prevIndex) => (prevIndex + 1) % SUBTITLES.length);
  };

  const setRandomWeatherFact = () => {
    const randomIndex = Math.floor(Math.random() * WEATHER_FACTS.length);
    setWeatherFact(WEATHER_FACTS[randomIndex]);
    Animated.sequence([
      Animated.timing(factFadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(factFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  // --- Sound effects ---
  const playClickSound = async () => {
    console.log("Attempting to play click sound...");
    let soundObject = null;
    try {
      soundObject = new Audio.Sound();
      await soundObject.loadAsync(require('./assets/click-sound.mp3'));
      await soundObject.playAsync();
      // Unload the sound when playback is finished
      soundObject.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await soundObject.unloadAsync();
          console.log("Click sound unloaded.");
        }
      });
    } catch (error) {
      console.error('Error playing click sound:', error);
      if (soundObject) {
        await soundObject.unloadAsync().catch(e => console.error("Error unloading click sound after error:", e));
      }
    }
  };

  const playResultSound = async () => {
    console.log("Attempting to play result sound (click-sound.mp3)...");
    let soundObject = null;
    try {
      soundObject = new Audio.Sound();
      // As per your log, result sound is also click-sound.mp3. If you have a different prank sound, change the path.
      // e.g., require('./assets/prank-sound.wav')
      await soundObject.loadAsync(require('./assets/click-sound.mp3')); 
      await soundObject.playAsync();
      // Unload the sound when playback is finished
      soundObject.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await soundObject.unloadAsync();
          console.log("Result sound unloaded.");
        }
      });
    } catch (error) {
      console.error('Error playing result sound:', error);
      if (soundObject) {
        await soundObject.unloadAsync().catch(e => console.error("Error unloading result sound after error:", e));
      }
    }
  };
  // --- End Sound effects ---


  const loadingMessages = [
    "Consulting the cosmic currents...",
    "Rerouting atmospheric anomalies...",
    "Brewing a fresh batch of meteorological madness...",
    "Asking the squirrels about their nuts...",
    "Summoning the weather gnomes...",
    "Calibrating the prank-o-meter...",
    "Generating a forecast as reliable as your ex...",
    "Polishing the crystal ball...",
    "Hoping for a funny outcome...",
    "Verifying the prank's comedic integrity...",
  ];

  const rotateLoadingMessage = () => {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    setCurrentLoadingMsg(loadingMessages[randomIndex]);
  };

  const handleSearch = async () => {
    if (!location.trim()) {
      playClickSound();
      Alert.alert('Location Required', 'Please enter a location to get your highly scientific forecast.');
      return;
    }

    playClickSound();
    Keyboard.dismiss();
    setLoading(true);
    setResult(null);
    setFakeData(null);
    setShowRealWeather(false);
    setRandomWeatherFact();

    const loadingInterval = setInterval(rotateLoadingMessage, 2000);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const lowerCaseLocation = location.toLowerCase();
      let prankResult = null;
      let isFakeData = false;

      if (lowerCaseLocation.includes('north pole') || lowerCaseLocation.includes('siberia')) {
        prankResult = {
          location: location,
          message: "Warning: Extremely high probability of frostbite and existential dread.",
          roast: "You're probably just trying to escape your responsibilities, aren't you?",
        };
      } else if (lowerCaseLocation.includes('desert') || lowerCaseLocation.includes('sahara')) {
        prankResult = {
          location: location,
          message: "Expect weather hotter than your last hot take.",
          roast: "Hope you packed enough water. And maybe a camel.",
        };
      } else if (lowerCaseLocation.includes('chernobyl') || lowerCaseLocation.includes('fukushima')) {
        prankResult = {
          location: location,
          message: "Forecast: A glowing chance of mutation and existential anxiety.",
          roast: "Are you sure you want to visit? Your hair might get an unexpected glow-up.",
        };
      } else if (lowerCaseLocation.includes('atlantic triangle') || lowerCaseLocation.includes('bermuda')) {
        prankResult = {
          location: location,
          message: "Forecast: Unpredictable disappearances and possible alien encounters.",
          roast: "Your plane might get a free upgrade to an interstellar cruise.",
        };
      } else if (lowerCaseLocation.includes('mount doom') || lowerCaseLocation.includes('mordor')) {
        prankResult = {
          location: location,
          message: "Expect fiery skies, volcanic ash, and an oppressive sense of evil.",
          roast: "One does not simply walk into the weather forecast of Mordor.",
        };
      } else if (lowerCaseLocation.includes('asgard')) {
        isFakeData = true;
        prankResult = {
          location: location,
          temperature: '∞',
          condition: 'Bifrost Bridge Activity',
          humidity: 'N/A',
          windSpeed: 'Gale',
          high: '∞',
          low: '∞',
          extra: 'Occasional Rainbow Bridge transport.',
        };
      } else if (lowerCaseLocation.includes('quantum realm') || lowerCaseLocation.includes('multiverse')) {
        isFakeData = true;
        prankResult = {
          location: location,
          temperature: 'Fluctuating',
          condition: 'Quantum Instability',
          humidity: 'Variable',
          windSpeed: 'Temporal Gusts',
          high: 'Unknowable',
          low: 'Unknowable',
          extra: 'Warning: May cause spontaneous existence changes.',
        };
      }
      else {
        const randomPranks = [
          { message: "Forecast: 90% chance of you still being awesome. 10% chance of rain.", roast: "Don't let the weather dampen your sparkle, you magnificent human." },
          { message: "Outlook: Slightly cloudy with a high probability of sarcasm.", roast: "Prepare for a day as unpredictable as your Wi-Fi signal." },
          { message: "Weather Alert: Expect a shower of compliments. (Not from us, though).", roast: "You're doing great, sweetie. The weather, however, is just 'meh'." },
          { message: "Today's forecast: Mostly awkward silences, followed by a slight breeze of indifference.", roast: "Sounds like your last family gathering, right?" },
          { message: "It's gonna be a 'stay in bed and question all your life choices' kind of day.", roast: "Perfect for binge-watching that show you regret starting." },
          { message: "The weather is as confused as you are about your career path.", roast: "At least one of you will figure it out eventually." },
          { message: "Expect a high chance of 'why am I even here?' moments.", roast: "Don't worry, it's not just you. It's the atmosphere." },
          { message: "Prediction: You'll still procrastinate, regardless of the sunshine.", roast: "The weather is not your excuse anymore." },
          { message: "Forecast: Unbearably pleasant. You're welcome.", roast: "We aim to disappoint your expectations of meteorological drama." },
          { message: "The weather is currently practicing its 'I don't care' face.", roast: "Much like your teenager when you ask them to do chores." },
          { message: "Today's vibe: Overcast with a chance of forgetting your umbrella.", roast: "Some things never change, do they?" },
          { message: "Looks like a perfect day for making bad decisions.", roast: "The sky approves. Probably." },
          { message: "The weather is throwing shade. Literally.", roast: "It's not personal. It's just the clouds." },
          { message: "Don't bother checking the forecast, it's just going to be 'weather.'", roast: "Mind-blowing, isn't it?" },
          { message: "Warning: May experience an overwhelming urge to nap.", roast: "The weather is enabling your laziness." },
          { message: "The sky is feeling dramatic today. Bring popcorn.", roast: "It's like a reality TV show, but with more clouds." },
          { message: "Prepare for a day where you'll accidentally leave your keys inside.", roast: "The weather is just testing your memory." },
          { message: "Forecast: A strong possibility of impulse purchases.", roast: "The weather told me to buy it. Honest." },
          { message: "Today's temperature: Hot enough to fry an egg on the sidewalk, if you're into that.", roast: "Or just enjoy a nice, cooked breakfast inside." },
          { message: "Outlook: A sprinkle of chaos with a chance of unexpected laughter.", roast: "Sounds like your average Tuesday." },
        ];
        const randomPrank = randomPranks[Math.floor(Math.random() * randomPranks.length)];
        prankResult = { location: location, ...randomPrank };
      }

      if (isFakeData) {
        setFakeData(prankResult);
      } else {
        setResult(prankResult);
      }
      setShowRealWeather(true);
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert('Error', 'Failed to fetch forecast. The weather gods are busy.');
    } finally {
      setLoading(false);
      clearInterval(loadingInterval);
    }
  };

  const onShare = async () => {
    playClickSound();
    if (result) {
      try {
        const shareMessage = `SkyC⚡st says for ${result.location}: "${result.message}" ${result.roast} #SkyCastPrank #WeatherPrank`;
        await Share.share({
          message: shareMessage,
        });
      } catch (error) {
        console.error('Error sharing:', error.message);
        Alert.alert('Share Failed', 'Could not share the prank. Try again!');
      }
    }
  };

  const captureAndShareScreenshot = async () => {
    playClickSound();
    try {
      const uri = await viewShotRef.current.capture();
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Error capturing or sharing screenshot:', error);
      Alert.alert('Screenshot Failed', 'Could not capture or share screenshot.');
    }
  };

  useEffect(() => {
    if (result || fakeData) {
      playResultSound(); // This will play click-sound.mp3 as per current playResultSound logic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      scaleAnim.setValue(0.8);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      scaleAnim.setValue(0.8);
    }
  }, [result, fakeData]);

  const switchTab = (tabName) => {
    if (activeTab === tabName) return;
    Animated.timing(tabFadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tabName);
      Animated.timing(tabFadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={themeColors.gradientColors} style={styles.background}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, { borderBottomColor: activeTab === 'skycast_now' ? themeColors.tabActive : 'transparent' }]}
            onPress={() => switchTab('skycast_now')}
          >
            <Text style={[styles.tabButtonText, { color: activeTab === 'skycast_now' ? themeColors.tabActive : themeColors.tabInactive, fontWeight: activeTab === 'skycast_now' ? 'bold' : 'normal' }]}>
              SkyC⚡st Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, { borderBottomColor: activeTab === 'feedback' ? themeColors.tabActive : 'transparent' }]}
            onPress={() => switchTab('feedback')}
          >
            <Text style={[styles.tabButtonText, { color: activeTab === 'feedback' ? themeColors.tabActive : themeColors.tabInactive, fontWeight: activeTab === 'feedback' ? 'bold' : 'normal' }]}>
              Feedback
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollViewFlex}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingViewContent}
          >
            <Animated.View style={{ width: '100%', opacity: tabFadeAnim }}> {/* Removed flex: 1 */}
              {activeTab === 'skycast_now' ? (
                <>
                  <View style={styles.header}>
                    <View style={styles.darkModeContainer}>
                      <Text style={[styles.darkModeText, { color: themeColors.text }]}>{darkMode ? '🌙' : '☀️'}</Text>
                      <Switch
                        value={darkMode}
                        onValueChange={toggleDarkMode}
                        trackColor={{ false: '#767577', true: '#4c669f' }}
                        thumbColor={darkMode ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        style={styles.darkModeSwitch}
                      />
                    </View>
                    <View>
                      <Image
                        source={darkMode ? require('./assets/logo-dark.png') : require('./assets/logo.png')}
                        style={styles.logo}
                      />
                    </View>
                    <Text style={[styles.title, { color: themeColors.text }]}>SkyC⚡st</Text>
                    <Text style={[styles.subtitle, { color: themeColors.subText }]}>
                      {SUBTITLES[currentSubtitleIndex]}
                    </Text>
                  </View>

                  <View style={styles.searchContainer}>
                    <TextInput
                      style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.inputBorder }]}
                      placeholder="Enter a location..."
                      placeholderTextColor="#bbb"
                      value={location}
                      onChangeText={setLocation}
                      onSubmitEditing={handleSearch}
                      returnKeyType="search"
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={[styles.searchButton, { backgroundColor: themeColors.buttonBg }]}
                      onPress={handleSearch}
                      activeOpacity={0.7}
                      disabled={loading}
                    >
                      <Text style={styles.searchButtonText}>Get Forecast</Text>
                    </TouchableOpacity>

                    {showRealWeather && (
                      <TouchableOpacity
                        style={[styles.realWeatherButton, { backgroundColor: themeColors.inputBg }]}
                        onPress={() => {
                          playClickSound();
                          Alert.alert('Wait For It...', 'This is still a prank app! 😂\n\n Keep Pranking your friends 😉');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.realWeatherButtonText, { color: themeColors.text }]}>Show Real Weather</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.dynamicContentWrapper}>
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <Image source={require('./assets/loading-weather.gif')} style={styles.loadingImage} />
                        <Text style={[styles.loadingText, { color: themeColors.text }]}>{currentLoadingMsg}</Text>
                      </View>
                    ) : fakeData ? (
                      <View style={styles.fakeDataContainer}>
                        <View style={[styles.weatherCard, { backgroundColor: themeColors.cardBg }]}>
                          <Text style={[styles.locationText, { color: themeColors.text }]}>{fakeData.location}</Text>
                          <View style={styles.mainWeatherRow}>
                            <Image
                              source={
                                fakeData.condition?.includes('Rain')
                                  ? require('./assets/rain-icon.png')
                                  : fakeData.condition?.includes('Cloud')
                                    ? require('./assets/cloudy-icon.png')
                                    : fakeData.condition?.includes('Sun')
                                      ? require('./assets/sun-icon.png')
                                      : fakeData.condition?.includes('Snow')
                                        ? require('./assets/snow-icon.png')
                                        : fakeData.condition?.includes('Thunder')
                                          ? require('./assets/thunder-icon.png')
                                          : fakeData.condition?.includes('Bifrost')
                                            ? require('./assets/bifrost-icon.png')
                                            : fakeData.condition?.includes('Quantum')
                                              ? require('./assets/quantum-icon.png')
                                              : require('./assets/wind-icon.png')
                              }
                              style={styles.weatherIcon}
                            />
                            <View>
                              <Text style={[styles.tempText, { color: themeColors.text }]}>{fakeData.temperature}°C</Text>
                              <Text style={[styles.conditionText, { color: themeColors.subText }]}>{fakeData.condition}</Text>
                            </View>
                          </View>
                          {fakeData.extra ? (
                            <Text style={[styles.extraInfoText, { color: themeColors.accentColor }]}>{fakeData.extra}</Text>
                          ) : null}
                          <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                              <Text style={[styles.detailLabel, { color: themeColors.subText }]}>HUMIDITY</Text>
                              <Text style={[styles.detailValue, { color: themeColors.text }]}>{fakeData.humidity}%</Text>
                            </View>
                            <View style={styles.detailItem}>
                              <Text style={[styles.detailLabel, { color: themeColors.subText }]}>WIND</Text>
                              <Text style={[styles.detailValue, { color: themeColors.text }]}>{fakeData.windSpeed} km/h</Text>
                            </View>
                            <View style={styles.detailItem}>
                              <Text style={[styles.detailLabel, { color: themeColors.subText }]}>HIGH/LOW</Text>
                              <Text style={[styles.detailValue, { color: themeColors.text }]}>{fakeData.high}°/{fakeData.low}°</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ) : result ? (
                      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={styles.viewShotContainer}>
                        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
                          <View style={[styles.weatherCard, { backgroundColor: themeColors.cardBg }]}>
                            <Text style={[styles.locationText, { color: themeColors.text }]}>{result.location}</Text>
                            <Image source={require('./assets/laugh-emoji.png')} style={styles.weatherIcon} />
                            <Text style={[styles.weatherMessage, { color: themeColors.text }]}>{result.message}</Text>
                            <Text style={[styles.roastText, { color: themeColors.accentColor }]}>{result.roast}</Text>
                            <Text style={[styles.nameSign, { color: themeColors.accentColor }]}>- Sk Ibrahim</Text>
                            <View style={styles.shareButtonContainer}>
                              <TouchableOpacity style={[styles.screenshotButton, { backgroundColor: themeColors.buttonBg }]} onPress={captureAndShareScreenshot} activeOpacity={0.7}>
                                <Text style={styles.shareButtonText}>Share Screenshot</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Animated.View>
                      </ViewShot>
                    ) : null}
                  </View>

                  <Animated.View
                    style={[styles.weatherFactContainer, { backgroundColor: themeColors.factBg, opacity: factFadeAnim }]}>
                    <Text style={[styles.weatherFactText, { color: themeColors.text }]}>{weatherFact}</Text>
                  </Animated.View>
                </>
              ) : (
                <View style={styles.feedbackContainer}>
                  <Text style={[styles.feedbackTitle, { color: themeColors.text }]}>We value your feedback! (Not really)</Text>
                  <Text style={[styles.feedbackDescription, { color: themeColors.subText }]}>Please let us know your thoughts or suggestions below. Or don't. It's a prank app.</Text>
                  <TextInput
                    style={[styles.feedbackInput, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.inputBorder, height: 50, marginBottom: 10 }]}
                    placeholder="Your Name (Optional, if you want credit for your genius)"
                    placeholderTextColor="#bbbbbb"
                    value={feedbackUserName}
                    onChangeText={setFeedbackUserName}
                    editable={!feedbackLoading}
                    maxLength={100}
                  />
                  <TextInput
                    style={[styles.feedbackInput, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.inputBorder }]}
                    placeholder="Type your feedback here... (if you must)"
                    placeholderTextColor="#bbbbbb"
                    value={feedbackText}
                    onChangeText={setFeedbackText}
                    multiline
                    editable={!feedbackLoading}
                    textAlignVertical="top"
                    maxLength={500}
                  />
                  <TouchableOpacity
                    style={[styles.feedbackSubmitButton, { backgroundColor: feedbackText.trim() ? themeColors.buttonBg : '#888', opacity: feedbackLoading ? 0.7 : 1 }]}
                    onPress={async () => {
                      if (!feedbackText.trim()) {
                        Alert.alert('Error', 'Please enter your feedback before submitting. Or just close the app.');
                        return;
                      }
                      setFeedbackLoading(true);
                      const feedbackData = {
                        feedback_message: feedbackText.trim(),
                        user_name: feedbackUserName.trim() || 'Anonymous SkyC⚡st User',
                        submission_date: new Date().toLocaleString(),
                      };
                      try {
                        const emailJsData = {
                          service_id: 'YOUR_EMAILJS_SERVICE_ID', // <<<<----- REPLACE THIS WITH YOUR ACTUAL SERVICE ID
                          template_id: 'template_hddwqhm',
                          user_id: 'sGTlSc79GW0mB6ocv',
                          template_params: feedbackData,
                        };
                        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(emailJsData),
                        });
                        if (!response.ok) {
                          const errorText = await response.text();
                          throw new Error(`EmailJS Error ${response.status}: ${errorText}`);
                        }
                        console.log('Feedback email sent successfully via fetch to EmailJS!');
                        const existing = await AsyncStorage.getItem('userFeedbacks');
                        const arr = existing ? JSON.parse(existing) : [];
                        arr.push({ feedback: feedbackText.trim(), date: new Date().toISOString() });
                        await AsyncStorage.setItem('userFeedbacks', JSON.stringify(arr));

                        setFeedbackSuccess(true);
                        setFeedbackText('');
                        setFeedbackUserName('');
                        Keyboard.dismiss();
                        if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        else Vibration.vibrate(200);
                      } catch (error) {
                        console.error('Full error object during feedback submission:', error);
                        if (error.message && error.message.includes("EmailJS Error")) {
                          console.error("Detailed EmailJS Error:", error.message);
                        }
                        Alert.alert('Error', 'Failed to save feedback. Try turning it off and on again.');
                        setFeedbackSuccess(false);
                      } finally {
                        setFeedbackLoading(false);
                      }
                    }}
                    disabled={feedbackLoading || !feedbackText.trim()}
                    activeOpacity={0.7}>
                    <Text style={styles.feedbackSubmitButtonText}>{feedbackLoading ? 'Submitting...' : 'Submit Feedback'}</Text>
                  </TouchableOpacity>
                  {feedbackSuccess && (
                    <Text style={[styles.feedbackSuccessText, { color: themeColors.accentColor }]}>Thank you for your feedback! 🙌 (We're probably not going to read it)</Text>
                  )}
                </View>
              )}
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollViewFlex: { 
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, 
    paddingBottom: 30, 
  },
  keyboardAvoidingViewContent: {
    flex: 1, 
    alignItems: 'center', 
    padding: 20,
    width: '100%',
  },
  dynamicContentWrapper: {
    width: '100%',
    alignItems: 'center', 
    minHeight: 450, 
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120,120,120,0.5)',
    backgroundColor: 'transparent',
    width: '100%',
  },
  tabButton: {
    marginHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 3,
  },
  tabButtonText: {
    fontSize: 18, // Slightly larger for better readability
  },
  header: {
    alignItems: 'center',
    marginBottom: 20, // Adjusted margin
    marginTop: 20, // Adjusted margin
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0, // Adjusted to be within padding of keyboardAvoidingViewContent
    top: 0,   // Adjusted to be within padding of keyboardAvoidingViewContent
    padding: 10, // Added padding for better touch area
  },
  darkModeText: {
    marginRight: 5,
    fontSize: 18,
  },
  darkModeSwitch: {
    // transform: [{ scale: 0.8 }], // Can be adjusted if needed
  },
  logo: {
    width: 100, // Slightly larger logo
    height: 100,
    resizeMode: 'contain',
    marginBottom: 5, // Reduced margin
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center', // Center children like input and button
    marginBottom: 20,
    paddingHorizontal: 10, // Add horizontal padding
  },
  input: {
    width: '100%', // Take full width of parent
    padding: 15,
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  searchButton: {
    width: '100%', // Take full width of parent
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  realWeatherButton: {
    width: '100%', // Take full width of parent
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc', // Example border color
  },
  realWeatherButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
    // This view now benefits from the minHeight of dynamicContentWrapper
  },
  loadingImage: {
    width: 120, // Slightly larger
    height: 120,
    resizeMode: 'contain',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  fakeDataContainer: {
    width: '100%',
    alignItems: 'center',
    // This view now benefits from the minHeight of dynamicContentWrapper
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
    // This view now benefits from the minHeight of dynamicContentWrapper
  },
  viewShotContainer: {
    width: '100%',
    alignItems: 'center',
    // This view now benefits from the minHeight of dynamicContentWrapper
  },
  weatherCard: {
    width: '95%', // Use percentage for responsiveness
    maxWidth: 400, // Max width for larger screens
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center', // Center content within the card
  },
  locationText: {
    fontSize: 28, // Increased size
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  mainWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherIcon: {
    width: 80, // Adjusted size
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
  },
  tempText: {
    fontSize: 48, // Increased size
    fontWeight: 'bold',
  },
  conditionText: {
    fontSize: 22, // Increased size
    marginTop: -5, // Adjust position relative to temp
  },
  extraInfoText: {
    fontSize: 16, // Increased size
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12, // Adjusted for clarity
    fontWeight: 'bold', // Make labels bolder
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
  },
  weatherMessage: {
    fontSize: 24, // Larger for impact
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  roastText: {
    fontSize: 18, // Slightly larger
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  nameSign: {
    fontSize: 14,
    fontStyle: 'italic',
    alignSelf: 'flex-end', // Align to the right
    marginTop: 10,
    marginRight: 10, // Add some margin
  },
  shareButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-around', // Distribute space
    paddingHorizontal: 10, // Add padding if buttons are too close to edge
  },
  shareButton: { // This style seems to be unused, screenshotButton is used twice
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25, // Rounded corners
    flex: 1, // Allow button to take available space
    marginHorizontal: 5, // Space between buttons
    alignItems: 'center',
  },
  screenshotButton: { // Applied to both buttons in JSX
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25, // Rounded corners
    flex: 1, // Allow button to take available space
    marginHorizontal: 5, // Space between buttons
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  weatherFactContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 15,
    marginTop: 25, // Ensure space above
    marginBottom: 10, // Ensure space below for scrolling
  },
  weatherFactText: {
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Feedback Tab Styles
  feedbackContainer: {
    width: '100%',
    minHeight: 400, // Ensure it has some height
    marginTop: 30, // Consistent margin
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  feedbackDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  feedbackInput: { // Common style for both feedback inputs
    width: '100%',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 15, // Space between inputs
    borderWidth: 1,
    // height is specific, so set individually or adjust if multiline needs more
  },
  feedbackSubmitButton: {
    width: '100%',
    padding: 15, // Consistent padding
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10, // Space above button
  },
  feedbackSubmitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  feedbackSuccessText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

