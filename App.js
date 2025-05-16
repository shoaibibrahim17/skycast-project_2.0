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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

const { width, height } = Dimensions.get('window');

export default function App() {
  // State hooks for various app functionalities
  const [activeTab, setActiveTab] = useState('skycast_now'); // Manages active tab
  const [location, setLocation] = useState(''); // Stores user input for location
  const [loading, setLoading] = useState(false); // Manages loading state for API calls
  const [result, setResult] = useState(null); // Stores the final prank result
  const [showRealWeather, setShowRealWeather] = useState(false); // Toggles "real weather" button (still a prank)
  const [fakeData, setFakeData] = useState(null); // Stores temporarily displayed fake weather data
  const [darkMode, setDarkMode] = useState(false); // Manages dark mode state
  const [usedRoasts, setUsedRoasts] = useState([]); // Stores used roasting lines to avoid repetition
  const [weatherFact, setWeatherFact] = useState(null); // Stores the currently displayed weather fact
  const [prankCount, setPrankCount] = useState(0); // Counts how many times the user has been pranked
  const [feedbackText, setFeedbackText] = useState(''); // Stores user feedback input
  const [feedbackLoading, setFeedbackLoading] = useState(false); // Manages loading state for feedback submission
  const [feedbackSuccess, setFeedbackSuccess] = useState(false); // Indicates successful feedback submission

  // Array of subtitles for the app header
  const subtitles = [
    "Made with the help of Tony Stark (kinda)",
    "Your Friendly Neighborhood Weather Report",
    "Powered by Stark Industries (Not Really)",
    "The Weather App Loki Would Use",
    "Assembled in a cave! With a box of scraps!",
    "Bringing you the weather, whether you like it or no",
    "We predict the weather... poorly",
    "Even the Asgardians use this app to predict the weather",
  ];
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0); // Index for cycling through subtitles

  // Refs for animations and other components
  const viewShotRef = useRef(); // Ref for taking screenshots
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation value for fade-in effect
  const slideAnim = useRef(new Animated.Value(50)).current; // Animation value for slide-up effect
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Animation value for scale effect
  const rotateLogo = useRef(new Animated.Value(0)).current; // Animation value for logo rotation
  const factFadeAnim = useRef(new Animated.Value(1)).current; // Animation value for weather fact fade
  const tabFadeAnim = useRef(new Animated.Value(1)).current; // Animation value for tab switching fade

  // Refs for sound objects
  const prankSoundRef = useRef(null);
  const clickSoundRef = useRef(null);

  // Array of roasting lines for the prank
  const roastingLines = [
    'Pro tip: Windows exist for a reason!',
    "Thanos snapped... and the weather changed.",
    "Weather app developers hate this one simple trick...",
    "Save data and battery - just look outside!",
    "Congratulations! You've just been bamboozled!",
    "Modern problems require medieval solutions!",
    "Breaking news: Outside still exists!",
    "This is why your phone battery lasts longer than mine.",
    "Weather forecasting technology since 100,000 BC.",
    "I'm not lazy, I'm resource efficient!",
    "5 out of 5 grandparents recommend this method.",
    "Weather forecast accuracy: 100% guaranteed!",
    "Your weather radar is called a window, try it sometime.",
    "Why use satellites when you have eyeballs?",
    "App usage time: 30 seconds. Time wasted: 30 seconds.",
    "Weather forecasting, reinvented for the lazy generation!",
    "Our advanced algorithm = looking out the window.",
    "Spoiler alert: The weather is right there!",
    "Downloading weather data the old-fashioned way - using your eyes.",
    "The only weather app with zero server costs!",
    "Congratulations on taking the longest route to check the weather!",
    "Forecasting with 100% less technology, 100% more common sense.",
    "Opening a window: Nature's weather API.",
    "This app was sponsored by the Window Manufacturing Association.",
    "Most revolutionary weather technology since the thermometer!",
    "Even cavemen knew to just look outside.",
    "We've secretly replaced their weather app with actual windows. Let's see if they notice!",
    "Warning: Prolonged usage may result in self-awareness.",
    "The most environmentally friendly weather app - uses zero electricity!",
    "When technology fails, windows prevail.",
    "Meteorologists HATE this one simple trick!",
    "This app is 80% sarcasm, 20% weather.",
    "Powered by a team of highly trained hamsters.",
    "Accuracy not guaranteed. Sanity not guaranteed.",
    "We predict the weather with the accuracy of a broken clock... twice a day!",
    "I am Iron Man... I mean, Weather Man.",
    "This app is my weapon... my *weather* weapon.",
  ];

  // Array of loading messages displayed during "API call"
  const loadingMessages = [
    "Analyzing cloud patterns...",
    "Connecting to weather satellites...",
    "Fetching meteorological data...",
    "Calculating precipitation probability...",
    "Scanning atmospheric conditions...",
    "Interrogating weather fairies...",
    "Bribing the weather gods...",
    "Converting weather data to emojis...",
    "Performing advanced weather magic...",
    "Consulting with meteorologists...",
    "Downloading weather from the Cloud...",
    "Calibrating the flux capacitor...",
    "Summoning weather spirits...",
    "Consulting the magic 8-ball...",
    "Asking Jarvis for the forecast...",
    "Harnessing the power of the Tesseract...",
    "Consulting the Ancient One...",
    "Checking with Nick Fury...",
  ];

  // Array of weather facts
  const weatherFacts = [
    "🌧️ A single thunderstorm can use more energy than an atomic bomb!",
    "❄️ No two snowflakes are exactly alike, but they all have six sides.",
    "🌪️ The fastest recorded wind speed on Earth was 253 mph during a tropical cyclone in Australia.",
    "🔥 The highest temperature ever recorded on Earth was 134°F (56.7°C) in Death Valley, California.",
    "🧊 The coldest temperature ever recorded was -128.6°F (-89.2°C) in Antarctica.",
    "⚡ Lightning strikes Earth about 8.6 million times per day!",
    "☂️ The wettest place on Earth is Mawsynram, India, with an average of 467 inches of rain per year.",
    "🌈 Rainbows are actually full circles, but we usually only see half from the ground.",
    "🌞 It takes sunlight about 8 minutes to reach Earth.",
    "☔ The fastest raindrop can fall at speeds of 18 mph!",
    "🌩️ Thunder is the sound of lightning rapidly heating the air around it.",
    "☁️ A typical cloud weighs about 1.1 million pounds!",
    "🌡️ The air temperature decreases about 5.4°F for every 1,000 feet you go up in elevation.",
    "❄️ About 1 million billion snowflakes fall each second across the Earth during a snowstorm.",
    "🧠 Humans are surprisingly good weather predictors - about 70% accurate just by looking at the sky!",
    "🍌 Bananas are berries, but strawberries aren't.  (Not weather-related, but interesting!)",
    "🦆 Ducks can sleep with one eye open. (Also not weather, but still cool!)",
    "The weather is often stranger than anything we could imagine.  (Just like the multiverse!)",
    "Some people can literally 'smell' rain coming. (Like a superpower!)",
  ];

  const [currentLoadingMsg, setCurrentLoadingMsg] = useState(loadingMessages[0]); // Current loading message
  const loadingMsgInterval = useRef(null); // Ref for loading message interval

  // Generates fake weather data for a given location
  const generateFakeWeather = (locationName) => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorms', 'Windy', 'Clear', 'Foggy', 'Snowy', 'Apocalyptic', 'Bifrost', 'Quantum Realm'];
    const temps = Math.floor(Math.random() * 40) + -5; // Random temperature
    const humidity = Math.floor(Math.random() * 100); // Random humidity
    const windSpeed = Math.floor(Math.random() * 60); // Random wind speed
    const extraInfo = [
      '',
      'Expect strong winds and mild disappointment.',
      'Possible chance of meatballs.',
      'Bring an umbrella, or don\'t. We\'re not the boss of you.',
      'Weather conditions may vary wildly.  Good luck.',
      'Consider staying indoors and questioning your life choices.',
      'You might want to build an ark.',
      'The end is nigh.  (Weather-wise)',
      'Please consult a higher power for accurate forecast.',
      'Warning: This forecast may be completely fabricated.',
      'Watch out for falling debris.',
      'May cause temporary loss of sanity.',
      'You have my word, the weather will be... interesting.',
      'Brace for impact!',
      "It's about to get weird.",
    ];

    return {
      location: locationName,
      temperature: temps,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity,
      windSpeed,
      high: temps + Math.floor(Math.random() * 10),
      low: temps - Math.floor(Math.random() * 12),
      extra: extraInfo[Math.floor(Math.random() * extraInfo.length)],
    };
  };

  // Special messages for specific locations
  const specialLocations = {
    'north pole': "It's cold. Really cold. Genius!",
    hawaii: "It's a tropical paradise, what did you expect?",
    sahara: 'Hot. Sand. More sand. What else do you need to know?',
    atlantis: '100% chance of being underwater. Forever.',
    'your room': 'Maybe clean it first, then check the weather?',
    mars: 'No atmosphere, extreme cold, dust storms. Not great for picnics.',
    narnia: 'Always winter, never Christmas. Unless Aslan says otherwise.',
    mordor: 'One does not simply check the weather in Mordor.',
    hogwarts: 'Enchanted ceiling in the Great Hall. No app needed.',
    gotham: 'Dark and brooding, with a chance of Batman.',
    wakanda: 'Weather technology centuries ahead of this app.',
    westeros: "Winter is coming. Or it's here already. Or it's summer. We're not sure.",
    'bikini bottom': "It's already underwater, what more do you want to know?",
    'springfield': "Expect yellow skies and a general sense of unease.",
    'sunnydale': "High chance of vampires.  And rain.",
    'mount doom': "Volcanic activity.  Bring a fire extinguisher.",
    'the shire': "Pleasant weather for hobbits.  Slight chance of orcs.",
    'neverland': "Weather is whatever you believe it to be.",
    'asgard': "Prepare for thunder, lightning, and the occasional rainbow bridge.",
    'titan': "Dusty.  Very dusty.  And possibly crowded.",
    'xandar': "Beautiful skies, but watch out for Ronan.",
    'knowhere': "Expect the unexpected.  And maybe some weird creatures.",
  };

  // Gets a random roasting line, avoiding immediate repetition
  const getRandomRoast = () => {
    const availableRoasts = roastingLines.filter(r => !usedRoasts.includes(r));
    if (availableRoasts.length === 0) { // If all roasts used, reset
      setUsedRoasts([]);
      return roastingLines[Math.floor(Math.random() * roastingLines.length)];
    }
    const roast = availableRoasts[Math.floor(Math.random() * availableRoasts.length)];
    setUsedRoasts(prev => [...prev, roast]);
    return roast;
  };

  // Gets a random weather fact
  const getRandomWeatherFact = () => weatherFacts[Math.floor(Math.random() * weatherFacts.length)];

  // Runs the fade-in, slide-up, and scale animations for the result card
  const runFadeInAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  };

  // Animates the logo rotation
  const spinLogo = () => {
    rotateLogo.setValue(0);
    Animated.timing(rotateLogo, { toValue: 2, duration: 2000, useNativeDriver: true }).start();
  };

  // Effect for cycling through subtitles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitleIndex(i => (i + 1) % subtitles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [subtitles.length]); // Added subtitles.length to dependencies

  // Effect for loading sounds and cycling weather facts
  useEffect(() => {
    async function loadSounds() {
      try {
        const { sound: prankSound } = await Audio.Sound.createAsync(require('./assets/prank-sound.wav'));
        prankSoundRef.current = prankSound;
        const { sound: clickSound } = await Audio.Sound.createAsync(require('./assets/click.mp3'));
        clickSoundRef.current = clickSound;
      } catch (e) {
        console.log('Error loading sounds', e);
      }
    }
    loadSounds();

    setWeatherFact(getRandomWeatherFact()); // Set initial fact
    const factInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(factFadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(factFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start(() => setWeatherFact(getRandomWeatherFact()));
    }, 8000);

    return () => { // Cleanup function
      prankSoundRef.current?.unloadAsync();
      clickSoundRef.current?.unloadAsync();
      clearInterval(factInterval);
      if (loadingMsgInterval.current) { // Clear loading message interval on unmount
        clearInterval(loadingMsgInterval.current);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Effect for loading data from AsyncStorage
  useEffect(() => {
    async function loadStorage() {
      try {
        const count = await AsyncStorage.getItem('prankCount');
        if (count !== null) setPrankCount(parseInt(count));
        const savedRoasts = await AsyncStorage.getItem('usedRoasts');
        if (savedRoasts) setUsedRoasts(JSON.parse(savedRoasts));
        const savedDark = await AsyncStorage.getItem('darkMode');
        if (savedDark) setDarkMode(JSON.parse(savedDark));
      } catch (e) {
        console.log('Error loading saved data', e);
      }
    }
    loadStorage();
  }, []);

  // Effect for saving used roasts to AsyncStorage
  useEffect(() => {
    if (usedRoasts.length > 0) {
      AsyncStorage.setItem('usedRoasts', JSON.stringify(usedRoasts)).catch(console.error);
    }
  }, [usedRoasts]);

  // Effect for saving dark mode state to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem('darkMode', JSON.stringify(darkMode)).catch(console.error);
  }, [darkMode]);

  // Plays the click sound
  const playClickSound = async () => {
    try { await clickSoundRef.current?.replayAsync(); } catch { /* ignore errors */ }
  };

  // Plays the prank sound
  const playPrankSound = async () => {
    try { await prankSoundRef.current?.replayAsync(); } catch { /* ignore errors */ }
  };

  // Captures a screenshot of the result card and shares it
  const captureAndShareScreenshot = async () => {
    try {
      playClickSound();
      if (!viewShotRef.current) return;
      const uri = await viewShotRef.current.capture();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share this weather prank!', UTI: 'public.png' });
      } else {
        Alert.alert('Error', 'Sharing is not supported on this device');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to share screenshot');
    }
  };

  // Toggles dark mode
  const toggleDarkMode = () => {
    playClickSound();
    setDarkMode(d => !d);
  };

  // Shares the prank message
  const onShare = async () => {
    try {
      playClickSound();
      await Share.share({
        message: `Get pranked by SkyC⚡st! I just got bamboozled checking the weather for ${result?.location || location || ''}! Try it!`,
      });
    } catch {
      Alert.alert('Error', 'Unable to share');
    }
  };

  // Handles the weather search logic
  const handleSearch = () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    playClickSound();
    fadeAnim.setValue(0); slideAnim.setValue(50); scaleAnim.setValue(0.8); // Reset animations
    setResult(null); // Clear previous result
    setFakeData(null); // Clear previous fake data
    setLoading(true); // Show loading indicator

    let msgIndex = 0;
    if (loadingMsgInterval.current) { // Clear any existing interval
      clearInterval(loadingMsgInterval.current);
    }
    setCurrentLoadingMsg(loadingMessages[msgIndex]); // Set initial loading message
    loadingMsgInterval.current = setInterval(() => { // Start cycling loading messages
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setCurrentLoadingMsg(loadingMessages[msgIndex]);
    }, 1500);

    const weatherData = generateFakeWeather(location); // Generate fake weather

    // Simulate API call delay (4 seconds)
    setTimeout(() => {
      clearInterval(loadingMsgInterval.current); // Stop loading messages
      loadingMsgInterval.current = null; // Clear interval ref
      setFakeData(weatherData); // Show fake weather data
      setLoading(false); // <<<<----- KEY CHANGE: Hide loading indicator to show fakeData

      // Simulate time to view fake data (2 seconds)
      setTimeout(() => {
        setFakeData(null); // Clear fake data
        let message = `Weather forecast for ${location}: Go check outside!`;
        // Check for special location messages
        for (const [key, val] of Object.entries(specialLocations)) {
          if (location.toLowerCase().includes(key)) {
            message = `Weather forecast for ${location}: ${val}`;
            break;
          }
        }
        setResult({ location, message, roast: getRandomRoast() }); // Set final prank result
        runFadeInAnimation(); // Trigger result card animation
        spinLogo(); // Spin the logo
        // Provide haptic feedback
        if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        else Vibration.vibrate(300);
        playPrankSound(); // Play prank sound
        updatePrankCount(); // Update prank counter
      }, 2000);
    }, 4000);
  };

  // Updates the prank count in state and AsyncStorage
  const updatePrankCount = async () => {
    try {
      const newCount = prankCount + 1;
      await AsyncStorage.setItem('prankCount', newCount.toString());
      setPrankCount(newCount);
      if (newCount >= 1) setShowRealWeather(true); // Show "real weather" button after first prank
    } catch {
      console.log('Failed to update prank count');
    }
  };

  // Interpolated value for logo rotation animation
  const spin = rotateLogo.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '360deg', '0deg'],
  });

  // Gets theme colors based on dark mode state
  const getThemeColors = () => {
    if (darkMode) return {
      gradientColors: ['#1a237e', '#121858', '#0a0e33'],
      cardBg: 'rgba(30, 30, 50, 0.5)',
      text: '#fff',
      subText: '#e0e0e0',
      inputBg: 'rgba(60, 60, 80, 0.5)',
      buttonBg: '#bb4444', // Darker red for dark mode
      accentColor: '#ffcc00',
      factBg: 'rgba(30, 30, 50, 0.6)',
      tabActive: '#bb4444',
      tabInactive: '#555',
      inputBorder: 'rgba(100, 100, 120, 0.7)',
    };
    return {
      gradientColors: ['#4c669f', '#3b5998', '#192f6a'],
      cardBg: 'rgba(255, 255, 255, 0.15)',
      text: '#fff',
      subText: '#e0e0e0',
      inputBg: 'rgba(255, 255, 255, 0.2)',
      buttonBg: '#ff6b6b', // Original red for light mode
      accentColor: '#ffcc00',
      factBg: 'rgba(0, 0, 0, 0.2)',
      tabActive: '#ff6b6b',
      tabInactive: '#aaa',
      inputBorder: 'rgba(255,255,255,0.3)',
    };
  };

  const themeColors = getThemeColors(); // Get current theme colors

  // Switches between Weather Mischief and Feedback tabs
  function switchTab(tabName) {
    if (tabName === activeTab) return; // Do nothing if already on the tab
    // Animate out the current tab content
    Animated.timing(tabFadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      setActiveTab(tabName); // Switch tab
      setFeedbackSuccess(false); // Reset feedback success message
      setFeedbackText(''); // Clear feedback text
      // Animate in the new tab content
      Animated.timing(tabFadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  }

  // Main render function
  return (
    <View style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={themeColors.gradientColors} style={styles.background}>
        {/* Tab Bar */}
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

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainContent}>
            <Animated.View style={{ flex: 1, width: '100%', opacity: tabFadeAnim }}>
              {/* Conditional rendering based on active tab */}
              {activeTab === 'skycast_now' ? (
                <>
                  {/* Header Section */}
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
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                      <Image
                        source={darkMode ? require('./assets/logo-dark.png') : require('./assets/logo.png')}
                        style={styles.logo}
                      />
                    </Animated.View>
                    <Text style={[styles.title, { color: themeColors.text }]}>SkyC⚡st</Text>
                    <Text style={[styles.subtitle, { color: themeColors.subText }]}>
                      {subtitles[currentSubtitleIndex]}
                    </Text>
                  </View>

                  {/* Search Section */}
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.inputBorder }]}
                      placeholder="Enter a location..."
                      placeholderTextColor="#bbb"
                      value={location}
                      onChangeText={setLocation}
                      onSubmitEditing={handleSearch}
                      returnKeyType="search"
                      editable={!loading && !fakeData && !result} // More precise editability
                    />
                    <TouchableOpacity
                      style={[styles.searchButton, { backgroundColor: themeColors.buttonBg }]}
                      onPress={handleSearch}
                      activeOpacity={0.7}
                      disabled={loading || fakeData !== null} // Disable while loading or showing fake data
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

                  {/* Conditional rendering for loading, fake data, or result */}
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
                              fakeData.condition.includes('Rain')
                                ? require('./assets/rain-icon.png')
                                : fakeData.condition.includes('Cloud')
                                  ? require('./assets/cloudy-icon.png')
                                  : fakeData.condition.includes('Sun')
                                    ? require('./assets/sun-icon.png')
                                    : fakeData.condition.includes('Snow')
                                      ? require('./assets/snow-icon.png')
                                      : fakeData.condition.includes('Thunder')
                                        ? require('./assets/thunder-icon.png')
                                        : fakeData.condition.includes('Bifrost')
                                          ? require('./assets/bifrost-icon.png')
                                          : fakeData.condition.includes('Quantum')
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
                            <TouchableOpacity style={[styles.shareButton, { backgroundColor: themeColors.buttonBg }]} onPress={onShare} activeOpacity={0.7}>
                              <Text style={styles.shareButtonText}>Share Prank</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.screenshotButton, { backgroundColor: themeColors.buttonBg }]} onPress={captureAndShareScreenshot} activeOpacity={0.7}>
                              <Text style={styles.shareButtonText}>Share Screenshot</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Animated.View>
                    </ViewShot>
                  ) : null}

                  {/* Weather Fact Section */}
                  <Animated.View
                    style={[styles.weatherFactContainer, { backgroundColor: themeColors.factBg, opacity: factFadeAnim }]}>
                    <Text style={[styles.weatherFactText, { color: themeColors.text }]}>{weatherFact}</Text>
                  </Animated.View>
                </>
              ) : (
                // Feedback Tab Content
                <View style={styles.feedbackContainer}>
                  <Text style={[styles.feedbackTitle, { color: themeColors.text }]}>We value your feedback! (Not really)</Text>
                  <Text style={[styles.feedbackDescription, { color: themeColors.subText }]}>Please let us know your thoughts or suggestions below.  Or don't.  It's a prank app.</Text>
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
                        Alert.alert('Error', 'Please enter your feedback before submitting.  Or just close the app.');
                        return;
                      }
                      setFeedbackLoading(true);
                      try {
                        const existing = await AsyncStorage.getItem('userFeedbacks');
                        const arr = existing ? JSON.parse(existing) : [];
                        arr.push({ feedback: feedbackText.trim(), date: new Date().toISOString() });
                        await AsyncStorage.setItem('userFeedbacks', JSON.stringify(arr));
                        setFeedbackSuccess(true);
                        setFeedbackText('');
                        Keyboard.dismiss();
                        if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        else Vibration.vibrate(200);
                      } catch {
                        Alert.alert('Error', 'Failed to save feedback.  Try turning it off and on again.');
                      } finally {
                        setFeedbackLoading(false);
                      }
                    }}
                    disabled={feedbackLoading || !feedbackText.trim()}
                    activeOpacity={0.7}>
                    <Text style={styles.feedbackSubmitButtonText}>{feedbackLoading ? 'Submitting...' : 'Submit Feedback'}</Text>
                  </TouchableOpacity>
                  {feedbackSuccess && (
                    <Text style={[styles.feedbackSuccessText, { color: themeColors.accentColor }]}>Thank you for your feedback! 🙌  (We're probably not going to read it)</Text>
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

// Styles for the application
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: { // Added style for the ScrollView
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    // height: '100%', // flex: 1 is usually sufficient here
  },
  scrollContainer: {
    flexGrow: 1, // Ensures content can scroll if it overflows
    paddingBottom: 30, // Padding at the bottom for scrollable content
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content to the top
    padding: 20,
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40, // Adjust for status bar
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120,120,120,0.5)', // Themed border color might be better
    backgroundColor: 'transparent',
    width: '100%',
  },
  tabButton: {
    marginHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 3, // Active tab indicator
  },
  tabButtonText: {
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
    width: '100%',
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: -15, // Adjusted for better placement
    right: 0,
  },
  darkModeText: {
    fontSize: 18,
    marginRight: 5,
  },
  darkModeSwitch: {
    transform: [{ scale: 0.8 }],
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  searchContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1, // Make border always visible
  },
  searchButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  realWeatherButton: {
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  realWeatherButtonText: {
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 20,
  },
  loadingImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  viewShotContainer: { // Used for capturing screenshot
    width: '100%',
    alignItems: 'center',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  weatherCard: { // Styling for the card displaying weather/prank info
    width: '100%',
    maxWidth: 400, // Max width for better layout on larger screens
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    // Adding some shadow for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4, // Elevation for Android shadow
  },
  fakeDataContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  locationText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  mainWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 15,
  },
  tempText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  conditionText: {
    fontSize: 20,
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
    flex: 1,
    paddingHorizontal: 5,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weatherMessage: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: 'bold',
  },
  roastText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  nameSign: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  shareButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  shareButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5, // Ensures space between buttons
    alignItems: 'center',
  },
  screenshotButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
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
    marginTop: 25,
    marginBottom: 10,
  },
  weatherFactText: {
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  feedbackContainer: {
    width: '100%',
    minHeight: 400,
    marginTop: 30,
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
  feedbackInput: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  feedbackSubmitButton: {
    height: 50,
    width: '100%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackSubmitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackSuccessText: {
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
  extraInfoText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
});
