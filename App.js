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
  cardBg: 'rgba(255, 255, 255, 0.88)', // Slightly transparent white for a softer look
  tabActive: '#4c669f',
  tabInactive: '#999999',
  factBg: 'rgba(220, 235, 250, 0.85)', // Light, slightly blueish, semi-transparent
};

const darkTheme = {
  gradientColors: ['#1A2980', '#26D0CE'], // Dark blue to turquoise
  text: '#FFFFFF',
  subText: '#BBBBBB',
  accentColor: '#26D0CE',
  inputBg: '#333333',
  inputBorder: '#555555',
  buttonBg: '#26D0CE',
  cardBg: 'rgba(20, 30, 55, 0.8)', // Dark, slightly desaturated blue, semi-transparent
  tabActive: '#26D0CE',
  tabInactive: '#666666',
  factBg: 'rgba(40, 50, 70, 0.8)', // Dark, desaturated blue-grey, semi-transparent
};

// --- SUBTITLES ---
const SUBTITLES = [
  "Made with the help of Tony Stark (kinda)",
  "Your Friendly Neighborhood Weather Report",
  "Powered by Stark Industries (Not Really)",
  "The Weather App Loki Would Use",
  "Developed by someone who uses headphones, just to avoid people.",
  "I don't speak much, but my app does",
  "Bringing you the weather, whether you like it or no",
  "We predict the weather... poorly",
  "Even the Asgardians use this app to predict the weather",
];


// --- FAKE WEATHER FACTS ---
const WEATHER_FACTS = [
  "The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, USA.",
  "The coldest temperature recorded was −89.2°C (−128.6°F) in Antarctica.",
  "Rain has a smell — it's caused by a compound called petrichor.",
  "Lightning strikes the Earth about 100 times every second.",
  "A single bolt of lightning is five times hotter than the surface of the sun.",
  "Clouds look white because they scatter all colors of sunlight equally.",
  "The fastest wind speed ever recorded was 253 mph during Cyclone Olivia in 1996.",
  "Tornadoes can have winds up to 300 mph.",
  "The deadliest natural disaster was the 1931 China floods, which killed up to 4 million people.",
  "Antarctica is the driest, coldest, and windiest continent on Earth.",
  "Snow isn't always white — it can appear red, orange, or even green due to algae.",
  "Hurricanes are called typhoons in the Pacific and cyclones in the Indian Ocean.",
  "A cubic mile of fog contains less than a gallon of water.",
  "Some clouds can weigh over a million pounds.",
  "Weather forecasts are usually 80-90% accurate for 3 days out.",
  "Tropical storms get their names from a rotating list by the World Meteorological Organization.",
  "Wind chill measures how cold it feels, not actual temperature.",
  "Dew forms when the air cools to its dew point, causing water vapor to condense.",
  "Lightning can strike the same place more than once — especially tall structures.",
  "The eye of a hurricane is the calmest part of the storm.",
  "Thunder is caused by the rapid expansion of air heated by lightning.",
  "Most tornadoes last less than 10 minutes.",
  "Fog is essentially a cloud that touches the ground.",
  "The Sahara Desert sometimes gets snow — rare, but it happens!",
  "Heat waves kill more people in the U.S. than hurricanes, floods, and tornadoes combined.",
  "Weather balloons can reach altitudes of over 20 miles (32 km).",
  "The jet stream influences weather patterns globally.",
  "Rainbows are full circles, but we usually see only a half-arc.",
  "Polar vortexes are large pockets of very cold air that circle the poles.",
  "Air pressure drops as you go higher in the atmosphere.",
  "Humidity makes hot temperatures feel hotter by slowing sweat evaporation.",
  "A thunderstorm is classified as severe if it has hail larger than 1 inch or winds over 58 mph.",
  "El Niño is a warming of ocean water that affects global weather patterns.",
  "Meteorologists use Doppler radar to detect storm movement and intensity.",
  "A barometer measures atmospheric pressure.",
  "A hygrometer measures humidity levels in the air.",
  "Snowflakes always have six sides but no two are exactly alike.",
  "The Coriolis effect causes wind to rotate clockwise in the Northern Hemisphere.",
  "UV radiation is stronger at higher altitudes and near the equator.",
  "Atmospheric rivers are long, narrow regions in the atmosphere that carry moisture — like rivers in the sky.",
  "The ozone layer protects us from harmful ultraviolet radiation.",
  "Dust storms can transport particles thousands of miles across the ocean.",
  "Some birds and insects can sense changes in air pressure before a storm.",
  "The smell before rain comes from plant oils and soil bacteria.",
  "Cold fronts typically bring heavy rain or thunderstorms.",
  "Warm fronts often bring light rain followed by clear skies.",
  "Weather satellites monitor cloud patterns, temperature, and moisture from space.",
  "The Earth's atmosphere is made mostly of nitrogen and oxygen.",
  "Thunder can be heard up to 10 miles from a lightning strike.",
  "A halo around the sun or moon can be a sign of an incoming storm.",
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

// --- Utility function to shuffle an array (Fisher-Yates shuffle, public domain, see MDN) ---
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- LOADING MESSAGES ---
const LOADING_MESSAGES = [
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

const RAW_TRY_MORE_STRINGS = [
  "Wanna try more? It's weather, not your ex’s mood swings!",
  "Keep trying — maybe one day I’ll actually care. 😌",
  "You think I'm gonna go serious now? Cute. Really cute.",
  "The sky said no. Try harder.",
  "Aur try karo... shayad NASA ka weather mil jaaye. 🚀",
  "Yeh Skycast hai, IMD nahi. Expectations kam rakho. 📉",
  "Aur jagah try karni hai? Duniya ghoom ke aa ja. 🌍",
  "Kya dhoondh raha hai bhai? Mausam ya apni kismat? 🤷",
  "Still no weather? Tere phone ko bhi sharam aa rahi hai ab. 😬",
  "Beta, yeh Skycast hai – weather ki memes, not reports. 😜",
  "Mausam toh theek hai, tu thoda unstable lag raha. 😅",
  "Doosri jagah bhi try kar lo... roasting toh milegi hi. 😏",
  "Aur tap karo... shayad mausam bhi roya de tumpe. 😢",
  "Kaunse planet ka weather chahiye ab? Mars? 🚀",
  "Tum more locations try karo... hum roast banate rahenge. 🍳",
  "Another location? What do you expect, Hogwarts forecast? 🧙‍♂️",
  "You’re acting like I owe you real data. Bold. 😌",
  "Keep searching... maybe you’ll find a real app. 🤫",
  "Changing location won't change your fate, buddy. 😎",
  "You really think I’m that functional? That’s adorable. 🥺",
  "This is a roast app, not a meteorology degree. 🎓",  
  "Weather still broken. So are your hopes.💔",
  "I’d tell you the weather, but where’s the fun in that?",
  "You must really believe in second chances.", // This was the last element before the misplaced ones
  "Sorry, still no clouds. Just your cloudy judgment. ☁️", // Moved inside
  "Nope. Not this city either. Try your hometown trauma. 🏠", // Moved inside
  "This app is powered by sarcasm, not satellites. 🛰", // Moved inside, now the last element
];

const RAW_FEEDBACK_STRINGS = [
  "Tell me how much you loved it. Or hated it. I’ll pretend to listen.",
  "Was the roast medium or well-done? 👨‍🍳 Drop a review!",
  "Feedback time! Be honest... but not too honest. I’m sensitive. 😢",
  "Your opinion matters.* (*only if it's 5 stars)",
  "Tap below to make my developer ego feel better. 🫶",
  "Rate the app. Don’t rate your life decisions. Too late for that.",
  "Say something nice or I’ll add your location to the roast list.",
  "Leave feedback or I'll make this app ask every 5 minutes 😈",
  "You survived the roast. Now return the favor with a review.",
  "Review de de bhai, itna mazaak kiya ab serious ho ja thoda. 😄",
  "Bhai bata de kaisa laga... roast achha tha ya emotional damage hua? 😅",
  "Tu feedback de, warna agla update mein tu target hoga. 🎯",
  "Acha laga ho toh likh de. Bura laga toh dil pe mat le. ❤️",
  "Maza aaya? Feedback mein bata de warna coding waste ho gayi meri. 😭",
  "Feedback doge toh meri Dua milega. Nahi diya toh bhi chalega. 🙏",
  "App ka future tera review pe depend karta hai... maybe. 😌",
  "5 star de do, warna developer coding chhod dega. 😢",
  "Tera feedback is app ka oxygen hai. Mat rok bhai! 💨",
  "Ek line likh de – chhota sa feedback, bada farq. 📝",
  "App acha laga toh review de, nahi toh dil se dua de. ❤️",
  "Chhoti si rating, badi si khushi. 😇",
  "Bhai dil pe mat le, bas feedback de. 🤲",
  "Tu review de, main tujhe shabaashi dunga. Verbal. Free. 😁",
  "Hey, don’t leave me hanging. Rate me before I roast again. 🔥",
  "Tell me what you think. Unless it’s mean. Then don’t. 😇",
  "Be the reason this app feels special today. 🥺",
  "Your feedback matters... unlike the actual weather here. 🌤",
  "Loved it? Say so. Hated it? Whisper it softly. 🤫",
  "Come on, you smiled. At least a 4-star for that. ⭐",
  "App: Roasts you. You: Reviews it. Balance. ⚖️",
  "Leave a review or I’ll send more fake forecasts. 🌀",
  "Help me roast better next time. Your words, my fire. 🔥",
  "Want more chaos in the next update? Say it in a review. 😈",
  "Sharing is caring. Even when it's about being insulted. 💌",
  "Tap below to tell me how much you cried. 😭",
  "If you laughed, rated. If you cringed, rated twice. 🔁",
  "Be honest. This isn't a government form. 📝",
  "Reviews keep me alive. And slightly arrogant. 🤭",
  "Tell me your thoughts. Preferably not at 3AM. 🌙",
  "Click yes and feel morally superior. ✨",
  "Even the clouds are waiting on your review. ☁️",
  "Your review could change the course of... this app. Maybe."
];

// Helper to create dialog objects with varying titles/buttons
const createDialogObjects = (messages, type) => {
  const titles = type === 'tryMore' ?
    ["Try More Locations!", "Try More Locations!", "Try More Locations!", "Try More Locations!", "Try More Locations!"] :
    ["Your Thoughts?", "Feedback Time!", "Spill the Tea!", "Rate This Chaos!", "Well...?"];
  const buttonTexts = type === 'tryMore' ?
    ["Let's Do It!", "Hit Me!", "Why Not?", "Okay, Fine.", "Try Again!"] :
    ["Submit It!", "Alright.", "Done.", "Send Thoughts", "Maybe Later"];

  if (!messages || messages.length === 0) return [];

  return messages.map((msg, index) => ({
    title: titles[index % titles.length],
    message: msg,
    buttonText: buttonTexts[index % buttonTexts.length]
  }));
};

const TRY_MORE_MESSAGES = createDialogObjects(RAW_TRY_MORE_STRINGS, 'tryMore');
const FEEDBACK_MESSAGES = createDialogObjects(RAW_FEEDBACK_STRINGS, 'feedback');


export default function App() {
  // State hooks for various app functionalities
  const [activeTab, setActiveTab] = useState('skycast_now'); // Manages active tab
  const [location, setLocation] = useState(''); // Stores user input for location
  const [loading, setLoading] = useState(false); // Manages loading state for API calls
  const [result, setResult] = useState(null); // Stores the final prank result
  const [showRealWeather, setShowRealWeather] = useState(false); // Toggles visibility of "Show Real Weather" button
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [fakeData, setFakeData] = useState(null); // Stores fake weather data
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0); // Index for rotating subtitles
  const [weatherFact, setWeatherFact] = useState(''); // Stores the current weather fact
  const [currentLoadingMsg, setCurrentLoadingMsg] = useState(LOADING_MESSAGES[0]); // Dynamic loading messages
  const [loadingDots, setLoadingDots] = useState(''); // For the fake loading dot animation
  const [dynamicCardBg, setDynamicCardBg] = useState(null); // For dynamic weather card background
  const [lastRandomRoastIndex, setLastRandomRoastIndex] = useState(-1); // To track the last random roast
  const [shuffledWeatherFacts, setShuffledWeatherFacts] = useState([]); // For non-repeating facts
  const [currentFactIndex, setCurrentFactIndex] = useState(0); 
  const [hasShownTryMoreLocationsPrompt, setHasShownTryMoreLocationsPrompt] = useState(false); // New prompt
  const [hasShownFeedbackPrompt, setHasShownFeedbackPrompt] = useState(false); 
  const [prankCount, setPrankCount] = useState(0); 
  
  // State for non-repeating dialog messages
  const [shuffledTryMoreDialogs, setShuffledTryMoreDialogs] = useState([]);
  const [currentTryMoreDialogIndex, setCurrentTryMoreDialogIndex] = useState(0);
  const [shuffledFeedbackDialogs, setShuffledFeedbackDialogs] = useState([]);
  const [currentFeedbackDialogIndex, setCurrentFeedbackDialogIndex] = useState(0);

  // Feedback tab states
  const [feedbackText, setFeedbackText] = useState(''); // Stores user's feedback text
  const [feedbackUserName, setFeedbackUserName] = useState(''); // Stores user's name for feedback
  const [feedbackLoading, setFeedbackLoading] = useState(false); // Manages loading state for feedback submission
  const [feedbackSuccess, setFeedbackSuccess] = useState(false); // Tracks if feedback submission was successful

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current; // For prank result card fade in/out
  const slideAnim = useRef(new Animated.Value(50)).current; // For prank result card slide up
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // For prank result card zoom in
  const factFadeAnim = useRef(new Animated.Value(1)).current; // For weather fact fade
  const tabFadeAnim = useRef(new Animated.Value(1)).current; // For tab content fade

  // Ref for ViewShot (screenshot)
  const viewShotRef = useRef();

  // --- Effects ---
  useEffect(() => {
    loadSettings(); // Load user preferences (dark mode)

    // Set initial subtitle and weather fact
    const initialSubtitleIndex = Math.floor(Math.random() * SUBTITLES.length);
    setCurrentSubtitleIndex(initialSubtitleIndex);

    // Set up interval for rotating subtitles
    const subtitleInterval = setInterval(() => {
      setCurrentSubtitleIndex((prevIndex) => (prevIndex + 1) % SUBTITLES.length);
    }, 7000); // Rotate every 7 seconds

    return () => {
      clearInterval(subtitleInterval); // Clear interval on unmount
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect for initializing and shuffling weather facts
  useEffect(() => {
    const initialShuffledFacts = shuffleArray(WEATHER_FACTS);
    setShuffledWeatherFacts(initialShuffledFacts);
    if (initialShuffledFacts.length > 0) {
      setWeatherFact(initialShuffledFacts[0]);
      setCurrentFactIndex(1); // Next fact will be at index 1
      // Initial fade-in for the first fact
      factFadeAnim.setValue(0); // Ensure opacity is 0 before fading in
      Animated.timing(factFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      setWeatherFact("No weather facts available at the moment!"); // Fallback
    }
  }, []); // Runs once on mount

  // useEffect to initialize shuffled dialogs
  useEffect(() => {
    if (TRY_MORE_MESSAGES.length > 0) {
      setShuffledTryMoreDialogs(shuffleArray([...TRY_MORE_MESSAGES]));
      setCurrentTryMoreDialogIndex(0);
    }
    if (FEEDBACK_MESSAGES.length > 0) {
      setShuffledFeedbackDialogs(shuffleArray([...FEEDBACK_MESSAGES]));
      setCurrentFeedbackDialogIndex(0);
    }
  }, []); // Runs once on mount

  // useEffect for automatically updating weather facts from the shuffled list
  useEffect(() => {
    if (WEATHER_FACTS.length === 0) {
        setWeatherFact("No weather facts to display!");
        return;
    }
    if (shuffledWeatherFacts.length === 0 && WEATHER_FACTS.length > 0) return; // Wait for initialization

    const interval = setInterval(() => {
      let nextFactToSet;
      let nextIndexToSet;

      if (currentFactIndex >= shuffledWeatherFacts.length) {
        const newShuffledFacts = shuffleArray(WEATHER_FACTS);
        setShuffledWeatherFacts(newShuffledFacts);
        nextFactToSet = newShuffledFacts.length > 0 ? newShuffledFacts[0] : "No facts available.";
        nextIndexToSet = newShuffledFacts.length > 0 ? 1 : 0;
      } else {
        nextFactToSet = shuffledWeatherFacts[currentFactIndex];
        nextIndexToSet = currentFactIndex + 1;
      }
      setWeatherFact(nextFactToSet);
      setCurrentFactIndex(nextIndexToSet);

      Animated.sequence([
        Animated.timing(factFadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(factFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 7000); // Update fact every 7 seconds

    return () => clearInterval(interval);
  }, [shuffledWeatherFacts, currentFactIndex, factFadeAnim]);


  // Get current theme colors based on dark mode state
  const themeColors = darkMode ? darkTheme : lightTheme;

  // Function to toggle dark mode and save preference
  const toggleDarkMode = async () => {
    // Play sound before setting state to avoid potential race condition if sound play is slow
    await playSoundAsset(require('./assets/click-sound.mp3'), 'toggleDarkModeClick');
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Failed to save dark mode setting:', error);
    }
  };

  // Function to load user settings (dark mode)
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

  // --- Generic Sound Playing Function ---
  const playSoundAsset = async (asset, soundNameForLog = 'sound') => {
    console.log(`Attempting to play ${soundNameForLog}...`);
    if (!asset) {
      console.error(`Asset for ${soundNameForLog} is undefined or null. Cannot play sound.`);
      return; // Exit if asset is not valid
    }
    let soundObject = null;
    try {
      soundObject = new Audio.Sound(); 
      await soundObject.loadAsync(asset); 
      console.log(`${soundNameForLog} loaded successfully.`);
      await soundObject.playAsync(); 
      console.log(`${soundNameForLog} playback started.`);
      
      soundObject.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log(`${soundNameForLog} finished playing.`);
          await soundObject.unloadAsync(); 
          console.log(`${soundNameForLog} unloaded.`);
        } else if (status.isLoaded && status.error) {
          
          console.error(`Error during ${soundNameForLog} playback:`, status.error);
          await soundObject.unloadAsync().catch(e => console.error(`Error unloading ${soundNameForLog} after playback error:`, e));
        }
      });
    } catch (error) {
      
      console.error(`Error with ${soundNameForLog}:`, error);
      if (soundObject) {
        try {
          await soundObject.unloadAsync(); 
          console.log(`${soundNameForLog} unloaded after catch.`);
        } catch (unloadError) {
          console.error(`Error unloading ${soundNameForLog} in catch block:`, unloadError);
        }
      }
    }
  };

  // Specific sound playing functions using the generic helper
  const playClickSound = async () => {
    await playSoundAsset(require('./assets/click-sound.mp3'), 'clickSound');
  };

  const playResultSound = async () => {
    await playSoundAsset(require('./assets/result-sound.mp3'), 'resultSound');
  };
 

  
  const rotateLoadingMessage = () => {
    const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
    setCurrentLoadingMsg(LOADING_MESSAGES[randomIndex]);
  };

  
  const handleSearch = async () => {
    if (!location.trim()) {
      await playClickSound(); // Await sound before showing alert
      Alert.alert('Location Required', 'Please enter a location to get your highly scientific forecast.');
      return;
    }

    await playClickSound(); // Await sound
    Keyboard.dismiss(); // Dismiss keyboard
    setLoading(true);
    setResult(null); // Clear previous result
    setFakeData(null); // Clear previous fake data
    setShowRealWeather(false); // Hide the real weather button until a prank is delivered
    setDynamicCardBg(null); // Clear previous dynamic background

    const loadingInterval = setInterval(rotateLoadingMessage, 2000); // Rotate loading messages

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const lowerCaseLocation = location.toLowerCase();
      let prankResult = null;
      let isFakeData = false;

      // --- Your existing prank logic ---
      if (lowerCaseLocation.includes('north pole') || lowerCaseLocation.includes('siberia')) {
        prankResult = { location, message: "Warning: Extremely high probability of frostbite and existential dread.", roast: "You're probably just trying to escape your responsibilities, aren't you?" };
      } else if (lowerCaseLocation.includes('desert') || lowerCaseLocation.includes('sahara')) {
        prankResult = { location, message: "Expect weather hotter than your last hot take.", roast: "Hope you packed enough water. And maybe a camel." };
      } else if (lowerCaseLocation.includes('chernobyl') || lowerCaseLocation.includes('fukushima')) {
        prankResult = { location, message: "Forecast: A glowing chance of mutation and existential anxiety.", roast: "Are you sure you want to visit? Your hair might get an unexpected glow-up." };
      } else if (lowerCaseLocation.includes('atlantic triangle') || lowerCaseLocation.includes('bermuda')) {
        prankResult = { location, message: "Forecast: Unpredictable disappearances and possible alien encounters.", roast: "Your plane might get a free upgrade to an interstellar cruise." };
      } else if (lowerCaseLocation.includes('mount doom') || lowerCaseLocation.includes('mordor')) {
        prankResult = { location, message: "Expect fiery skies, volcanic ash, and an oppressive sense of evil.", roast: "One does not simply walk into the weather forecast of Mordor." };
      } else if (lowerCaseLocation.includes('asgard')) {
        isFakeData = true;
        prankResult = { location, temperature: '∞', condition: 'Bifrost Bridge Activity', humidity: 'N/A', windSpeed: 'Gale', high: '∞', low: '∞', extra: 'Occasional Rainbow Bridge transport.' };
      } else if (lowerCaseLocation.includes('quantum realm') || lowerCaseLocation.includes('multiverse')) {
        isFakeData = true;
        prankResult = { location, temperature: 'Fluctuating', condition: 'Quantum Instability', humidity: 'Variable', windSpeed: 'Temporal Gusts', high: 'Unknowable', low: 'Unknowable', extra: 'Warning: May cause spontaneous existence changes.' };
      } else {
        // Default random prank
        const randomPranks = [
          { message: "Forecast: 90% chance of you still being awesome. 10% chance of rain.", roast: "Don't let the weather dampen your sparkle, you magnificent human." },
          { message: "Outlook: Slightly cloudy with a high probability of sarcasm.", roast: "Prepare for a day as unpredictable as your Wi-Fi signal." },
          { message: "Weather Alert: Expect a shower of compliments. (Not from us, though).", roast: "You're doing great, sweetie. The weather, however, is just 'meh'." },
          { message: "Today's forecast: Mostly awkward silences, followed by a slight breeze of indifference.", roast: "Sounds like your last family gathering, right?" },
          { message: "It's gonna be a 'stay in bed and question all your life choices' kind of day.", roast: "Perfect for binge-watching that show you regret starting." },
          { message: "The weather is as confused as you are about your career path.", roast: "At least one of you will figure it out eventually." },
          { message: "Expect a high chance of 'why am I even here?' moments.", roast: "Don't worry, it's not just you. It's the atmosphere." },
        ];
        // Adding the new roast messages
        const newRoasts = [
          { message: "Go Check Outside!", roast: "Pro tip: Windows exist for a reason!" },
          { message: "Go Check Outside!", roast: "Thanos snapped... and the weather changed." },
          { message: "Go Check Outside!", roast: "You wanted a forecast? I predict disappointment" },
          { message: "Go Check Outside!", roast: "Save data and battery - just look outside!" },
          { message: "Go Check Outside!", roast: "Sky said 'no', just like everyone else in your life" },
          { message: "Go Check Outside!", roast: "Location not found. Just like your ambition" },
          { message: "Go Check Outside!", roast: "Breaking news: Outside still exists!" },
          { message: "Go Check Outside!", roast: "This is why your phone battery lasts longer than mine." },
          { message: "Go Check Outside!", roast: "Aapka future bhi iss weather jaisa unclear hai" },
          { message: "Go Check Outside!", roast: "The air quality is better than your decision making" },
          { message: "Go Check Outside!", roast: "5 out of 5 grandparents recommend this method." },
          { message: "Go Check Outside!", roast: "Even this fake app is more responsive than you" },
          { message: "Go Check Outside!", roast: "Your weather radar is called a window, try it sometime." },
          { message: "Go Check Outside!", roast: "Why use satellites when you have eyeballs?" },
          { message: "Go Check Outside!", roast: "App usage time: 30 seconds. Time wasted: 30 seconds." },
          { message: "Go Check Outside!", roast: "Weather forecasting, reinvented for the lazy generation!" },
          { message: "Go Check Outside!", roast: "Our advanced algorithm = looking out the window." },
          { message: "Go Check Outside!", roast: "Mausam kya hi bataayein, tu khud hi disaster hai" },
          { message: "Go Check Outside!", roast: "Downloading weather data the old-fashioned way - using your eyes." },
          { message: "Go Check Outside!", roast: "The only weather app with zero server costs!" },
          { message: "Go Check Outside!", roast: "Congratulations on taking the longest route to check the weather!" },
          { message: "Go Check Outside!", roast: "Forecasting with 100% less technology, 100% more common sense." },
          { message: "Go Check Outside!", roast: "Opening a window: Nature's weather API." },
          { message: "Go Check Outside!", roast: "This app was sponsored by the Window Manufacturing Association." },
          { message: "Go Check Outside!", roast: "Most revolutionary weather technology since the thermometer!" },
          { message: "Go Check Outside!", roast: "Even cavemen knew to just look outside." },
          { message: "Go Check Outside!", roast: "We've secretly replaced their weather app with actual windows. Let's see if they notice!" },
          { message: "Go Check Outside!", roast: "You are like a group project, mostly useless" },
          { message: "Go Check Outside!", roast: "Your GPA is lower than today's humidity" },
          { message: "Go Check Outside!", roast: "When technology fails, windows prevail." },
          { message: "Go Check Outside!", roast: "The weather is fine. Your time management? Not so much." },
          { message: "Go Check Outside!", roast: "If stress had a season, you'd be the entire forecasst" },
          { message: "Go Check Outside!", roast: "Even the clouds are more stable than your semester plan" },
          { message: "Go Check Outside!", roast: "Skycast says: chill outside, regret inside" },
          { message: "Go Check Outside!", roast: "You're here to check weather? Go check your internal marks" },
          { message: "Go Check Outside!", roast: "That 'Go Check Outside' hit harder than your last breakup" },
          { message: "Go Check Outside!", roast: "This apps roasts you, bur your crush ignores you" },
          { message: "Go Check Outside!", roast: "Tera focus bhi Mausam ki tarah change hote rehta hai" },
          { message: "Go Check Outside!", roast: "Sharma ji ka beta know the weather. You? still confused" },
          { message: "Go Check Outside!", roast: "This app roasts harder than Salman Khan's shirt flies off" },
          { message: "Go Check Outside!", roast: "You're trying too hard, like DC trying to catch up Marvel" },
          { message: "Go Check Outside!", roast: "The sky is blue, Your future still unclear" },
          { message: "Go Check Outside!", roast: "Roses are red, weather is grey, stop checking this app and go study today." },
          { message: "Go Check Outside!", roast: "Tu chand sa hai... par humare uni Wi-Fi signal jaisa - kabhi hota hi nahi" },
          { message: "Go Check Outside!", roast: "You're camping harder than a noob in Call of Duty(Sazid -no offense)" },
          { message: "Go Check Outside!", roast: "You give mixed signals - just like Delhi weather" },
          { message: "Go Check Outside!", roast: "The guy who made this app barely talks IRL, but he built something that bullies people daily. Balance." },
          { message: "Go Check Outside!", roast: "Skycast is coded with care.. by someone who fears eye contact but not roasting people." },
          { message: "Go Check Outside!", roast: "Don't blame the app, blame the soft-spoken dev with a dark sense of humor." },
          { message: "Go Check Outside!", roast: "This app is like its creator -  on the outside, chaos inside" },
          
        ];
        randomPranks.push(...newRoasts); // Append the new roasts to the existing array

        let randomIndex;
        if (randomPranks.length > 1) {
          do {
            randomIndex = Math.floor(Math.random() * randomPranks.length);
          } while (randomIndex === lastRandomRoastIndex);
        } else if (randomPranks.length === 1) {
          randomIndex = 0;
        } else {
          // Fallback if randomPranks is somehow empty, though unlikely
          randomIndex = 0;
        }
        setLastRandomRoastIndex(randomIndex);
        const randomPrank = randomPranks[randomIndex];
        prankResult = { location, ...randomPrank };
      }
      // --- End of prank logic ---

      if (isFakeData) {
        setFakeData(prankResult);
      } else {
        setResult(prankResult);
      }

      setPrankCount(prevCount => prevCount + 1); // Increment prank count
      // --- Set Conditional Card Background Color ---
      let newCardBg = null;
      const contentStringForBg = (prankResult.message || prankResult.condition || '').toLowerCase();

      if (contentStringForBg.includes('hot') || contentStringForBg.includes('desert') || contentStringForBg.includes('fiery') || contentStringForBg.includes('sun')) {
        newCardBg = 'rgba(255, 165, 0, 0.8)'; // Warm Orange
      } else if (contentStringForBg.includes('cold') || contentStringForBg.includes('snow') || contentStringForBg.includes('frostbite') || contentStringForBg.includes('siberia')) {
        newCardBg = 'rgba(173, 216, 230, 0.85)'; // Light Blue
      } else if (contentStringForBg.includes('thunder') || contentStringForBg.includes('rain') || contentStringForBg.includes('storm') || contentStringForBg.includes('gale')) {
        newCardBg = 'rgba(100, 149, 237, 0.8)'; // Cornflower Blue / Stormy
      } else if (contentStringForBg.includes('quantum') || contentStringForBg.includes('bifrost') || contentStringForBg.includes('multiverse') || contentStringForBg.includes('chernobyl') || contentStringForBg.includes('bermuda') || contentStringForBg.includes('doom') || contentStringForBg.includes('mordor')) {
        newCardBg = 'rgba(128, 0, 128, 0.8)'; // Purple / Mysterious
      }
      setDynamicCardBg(newCardBg); // Set the dynamic background, or null to use theme default
      // --- End Conditional Card Background Color ---

      setShowRealWeather(true); // Show real weather button after prank
    } catch (error) {
      console.error('Error in handleSearch logic:', error);
      Alert.alert('Error', 'Failed to fetch forecast. The weather gods are busy.');
    } finally {
      setLoading(false);
      clearInterval(loadingInterval); // Stop loading message rotation
    }
  };

  // Share functionality
  const onShare = async () => {
    await playClickSound(); // Await sound
    if (result) {
      try {
        const shareMessage = `SkyC⚡st says for ${result.location}: "${result.message}" ${result.roast} #SkyCastPrank #WeatherPrank`;
        await Share.share({ message: shareMessage });
      } catch (error) {
        console.error('Error sharing:', error.message);
        Alert.alert('Share Failed', 'Could not share the prank. Try again!');
      }
    }
  };

  // Screenshot and share functionality
  const captureAndShareScreenshot = async () => {
    await playClickSound(); // Await sound
    try {
      // Ensure viewShotRef.current and its capture method are available
      if (viewShotRef.current && typeof viewShotRef.current.capture === 'function') {
        const uri = await viewShotRef.current.capture();
        if (uri) {
          await Sharing.shareAsync(uri);
        } else {
          console.warn('Screenshot URI is undefined');
          Alert.alert('Screenshot Failed', 'Could not capture screenshot URI.');
        }
      } else {
        console.error('viewShotRef.current is not defined or capture is not a function');
        Alert.alert('Screenshot Failed', 'Screenshot component is not ready.');
      }
    } catch (error) {
      console.error('Error capturing or sharing screenshot:', error);
      Alert.alert('Screenshot Failed', 'Could not capture or share screenshot.');
    }
  };

  // Animation effect for prank result card
  useEffect(() => {
    if (result || fakeData) {
      playResultSound(); // This will play the sound defined in playResultSound
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Reset initial values for animations
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      scaleAnim.setValue(0.8);

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
      ]).start(() => {
        // After animation completes, if it's the first prank and alert hasn't been shown
        // This callback runs once per successful animation tied to a new result/fakeData/prankCount
        if (prankCount === 1 && !hasShownTryMoreLocationsPrompt) {
          // Only show "Try More" on the very first prank, if not already shown
          let dialogToShow;
          if (shuffledTryMoreDialogs.length > 0) {
            if (currentTryMoreDialogIndex >= shuffledTryMoreDialogs.length) {
              const newShuffled = shuffleArray([...TRY_MORE_MESSAGES]);
              setShuffledTryMoreDialogs(newShuffled);
              dialogToShow = newShuffled.length > 0 ? newShuffled[0] : { title: "Psst!", message: "Try another location!", buttonText: "Okay!" };
              setCurrentTryMoreDialogIndex(newShuffled.length > 0 ? 1 : 0);
            } else {
              dialogToShow = shuffledTryMoreDialogs[currentTryMoreDialogIndex];
              setCurrentTryMoreDialogIndex(prev => prev + 1);
            }
            Alert.alert(dialogToShow.title, dialogToShow.message, [{ text: dialogToShow.buttonText }]);
            setHasShownTryMoreLocationsPrompt(true);
          }
        } else if (prankCount >= 2 && !hasShownFeedbackPrompt) {
          // Show "Feedback" on the second or subsequent pranks, if not already shown
          let dialogToShow;
          if (shuffledFeedbackDialogs.length > 0) {
            if (currentFeedbackDialogIndex >= shuffledFeedbackDialogs.length) {
              const newShuffled = shuffleArray([...FEEDBACK_MESSAGES]);
              setShuffledFeedbackDialogs(newShuffled);
              dialogToShow = newShuffled.length > 0 ? newShuffled[0] : { title: "Hey!", message: "Got feedback?", buttonText: "Sure" };
              setCurrentFeedbackDialogIndex(newShuffled.length > 0 ? 1 : 0);
            } else {
              dialogToShow = shuffledFeedbackDialogs[currentFeedbackDialogIndex];
              setCurrentFeedbackDialogIndex(prev => prev + 1);
            }
            Alert.alert(dialogToShow.title, dialogToShow.message, [{ text: dialogToShow.buttonText }]);
            setHasShownFeedbackPrompt(true);
          }
        }
      });
    } else {
      // When result/fakeData are cleared (e.g., new search), reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      scaleAnim.setValue(0.8);
    }
  }, [result, fakeData, prankCount, shuffledTryMoreDialogs, currentTryMoreDialogIndex, shuffledFeedbackDialogs, currentFeedbackDialogIndex]); // Added dialog state dependencies


  // Animation for tab switching
  const switchTab = async (tabName) => {
    if (activeTab === tabName) return; // Do nothing if already on the tab
    await playClickSound(); // Play sound on tab switch

    // Animate out the current tab content
    Animated.timing(tabFadeAnim, {
      toValue: 0,
      duration: 150, // Fast fade out
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tabName); // Switch tab
      // Animate in the new tab content
      Animated.timing(tabFadeAnim, {
        toValue: 1,
        duration: 250, // Slower fade in
        useNativeDriver: true,
      }).start();
    });
  };


  // --- Feedback Submission ---
  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter your feedback before submitting. Or just close the app.');
      return;
    }
    await playClickSound(); // Await sound
    setFeedbackLoading(true);
    const feedbackData = {
      feedback_message: feedbackText.trim(),
      user_name: feedbackUserName.trim() || 'Anonymous SkyC⚡st User',
      submission_date: new Date().toLocaleString(), // More readable date format
    };
    try {
      // IMPORTANT: Replace 'YOUR_EMAILJS_SERVICE_ID' with your actual Service ID from EmailJS
      // and ensure your template_id and user_id are correct.
      const emailJsData = {
        service_id: 'my_awesome_service_id', // <<<<----- YOUR ACTUAL ID WILL GO HERE
        template_id: 'template_hddwqhm',       // Your EmailJS Template ID
        user_id: 'sGTlSc79GW0mB6ocv',          // Your EmailJS User ID (Public Key)
        template_params: feedbackData,
      };
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailJsData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`EmailJS Error ${response.status}: ${errorText}`);
      }
      console.log('Feedback email sent successfully via fetch to EmailJS!');

      // Optionally save to AsyncStorage as a backup or local log
      const existingFeedbacks = await AsyncStorage.getItem('userFeedbacks');
      const feedbacksArray = existingFeedbacks ? JSON.parse(existingFeedbacks) : [];
      feedbacksArray.push(feedbackData); // Save the structured feedback
      await AsyncStorage.setItem('userFeedbacks', JSON.stringify(feedbacksArray));

      setFeedbackSuccess(true);
      setFeedbackText('');
      setFeedbackUserName('');
      Keyboard.dismiss();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Full error object during feedback submission:', error);
      Alert.alert('Submission Error', `Failed to send feedback. ${error.message || 'Please try again.'}`);
      setFeedbackSuccess(false); // Ensure success is false on error
    } finally {
      setFeedbackLoading(false);
    }
  };
  // --- End Feedback Submission ---


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

        {/* KeyboardAvoidingView as the outer container for scrolling content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }} // KAV takes up available space
        >
          {/* ScrollView nested inside KAV */}
          <ScrollView
            style={{ flex: 1 }} // ScrollView also takes up available space within KAV
            contentContainerStyle={{ flexGrow: 1, padding: 20 }} // Allows content to grow and adds padding
            keyboardShouldPersistTaps="handled"
          >
            {/* Animated.View for tab content fade, now with flex: 1 */}
            <Animated.View style={{ flex: 1, opacity: tabFadeAnim }}>
              {activeTab === 'skycast_now' ? (
                <>
                  {/* Header Section */}
                  <View style={styles.header}>
                    <View style={styles.darkModeContainer}>
                      <Text style={[styles.darkModeText, { color: themeColors.text }]}>{darkMode ? '🌙' : '☀️'}</Text>
                      <Switch
                        value={darkMode}
                        onValueChange={toggleDarkMode}
                        trackColor={{ false: '#767577', true: themeColors.buttonBg }} // Use theme color for active track
                        thumbColor={darkMode ? themeColors.accentColor : '#f4f3f4'} // Use theme color for thumb
                        ios_backgroundColor="#3e3e3e"
                        style={styles.darkModeSwitch}
                      />
                    </View>
                    <View> {/* Removed Animated.View and transform for logo as it wasn't used */}
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

                  {/* Search Section */}
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.inputBorder }]}
                      placeholder="Enter a location..."
                      placeholderTextColor="#bbb"
                      value={location}
                      onChangeText={setLocation}
                      onSubmitEditing={handleSearch} // Trigger search on submit
                      returnKeyType="search" // Show search button on keyboard
                      editable={!loading} // Disable input while loading
                    />
                    <TouchableOpacity
                      style={[styles.searchButton, { backgroundColor: themeColors.buttonBg }]}
                      onPress={handleSearch}
                      activeOpacity={0.7}
                      disabled={loading} // Disable button while loading
                    >
                      <Text style={styles.searchButtonText}>
                        {loading ? 'Forecasting...' : 'Get Forecast'}
                      </Text>
                    </TouchableOpacity>

                    {showRealWeather && (
                      <TouchableOpacity
                        style={[styles.realWeatherButton, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder }]}
                        onPress={async () => {
                          await playClickSound(); // Ensure click sound plays
                          Alert.alert('Wait For It...', 'This is still a prank app! 😂\n\n Keep Pranking your friends 😉');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.realWeatherButtonText, { color: themeColors.text }]}>Show Real Weather</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Wrapper for dynamic content to stabilize layout and ensure scrollability */}
                  <View style={styles.dynamicContentWrapper}>
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        {/* <Image source={require('./assets/loading-weather.gif')} style={styles.loadingImage} /> */} {/* GIF Removed */}
                        <Text style={[styles.loadingText, { color: themeColors.text }]}>{currentLoadingMsg}{loadingDots}</Text>
                        {/* Added loadingDots here */}
                      </View>
                    ) : fakeData ? (
                      // Fake Weather Data Card
                      <View style={styles.fakeDataContainer}>
                        <View
                          style={[
                            styles.weatherCard,
                            { backgroundColor: dynamicCardBg || themeColors.cardBg } // Apply dynamic or theme default
                          ]}
                        >
                          <Text style={[styles.locationText, { color: themeColors.text }]}>{fakeData.location}</Text>
                          <View style={styles.mainWeatherRow}>
                            <Image
                              source={
                                fakeData.condition?.includes('Rain') ? require('./assets/rain-icon.png') :
                                fakeData.condition?.includes('Cloud') ? require('./assets/cloudy-icon.png') :
                                fakeData.condition?.includes('Sun') ? require('./assets/sun-icon.png') :
                                fakeData.condition?.includes('Snow') ? require('./assets/snow-icon.png') :
                                fakeData.condition?.includes('Thunder') ? require('./assets/thunder-icon.png') :
                                fakeData.condition?.includes('Bifrost') ? require('./assets/bifrost-icon.png') :
                                fakeData.condition?.includes('Quantum') ? require('./assets/quantum-icon.png') :
                                require('./assets/wind-icon.png') // Default icon
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
                            <View style={styles.detailItem}><Text style={[styles.detailLabel, { color: themeColors.subText }]}>HUMIDITY</Text><Text style={[styles.detailValue, { color: themeColors.text }]}>{fakeData.humidity}%</Text></View>
                            <View style={styles.detailItem}><Text style={[styles.detailLabel, { color: themeColors.subText }]}>WIND</Text><Text style={[styles.detailValue, { color: themeColors.text }]}>{fakeData.windSpeed} km/h</Text></View>
                            <View style={styles.detailItem}><Text style={[styles.detailLabel, { color: themeColors.subText }]}>HIGH/LOW</Text><Text style={[styles.detailValue, { color: themeColors.text }]}>{fakeData.high}°/{fakeData.low}°</Text></View>
                          </View>
                        </View>
                      </View>
                    ) : result ? (
                      // Prank Result Card
                      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={styles.viewShotContainer}>
                        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
                          <View
                            style={[
                              styles.weatherCard,
                              { backgroundColor: dynamicCardBg || themeColors.cardBg } // Apply dynamic or theme default
                            ]}
                          >
                            {/* <Text style={[styles.locationText, { color: themeColors.text }]}>{result.location}</Text> */} {/* Removed this location display */}
                            <Image source={require('./assets/laugh-emoji.png')} style={styles.weatherIcon} />
                            <Text style={[styles.forecastTitle, { color: themeColors.subText }]}>
                              Weather Forecast for {result.location}
                            </Text>
                            <Text style={[styles.goCheckOutsideText, { color: themeColors.text }]}>
                              Go Check Outside!
                            </Text>
                            {/* <Text style={[styles.weatherMessage, { color: themeColors.text }]}>{result.message}</Text> */} {/* Commented out to display only one title above roast */}
                            <Text style={[styles.roastText, { color: themeColors.accentColor }]}>{result.roast}</Text>
                            <Text style={[styles.nameSign, { color: themeColors.subText }]}>- Sk Ibrahim</Text>
                            <View style={styles.shareButtonContainer}>
                              <TouchableOpacity style={[styles.screenshotButton, { backgroundColor: themeColors.buttonBg }]} onPress={captureAndShareScreenshot} activeOpacity={0.7}>
                                <Text style={styles.shareButtonText}>Share Screenshot</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Animated.View>
                      </ViewShot>
                    ) : (
                      // Empty state placeholder before any search
                      <Text style={[styles.emptyStateText, { color: themeColors.subText }]}>Enter a location to unlock the forecast...</Text>
                    )}
                  </View>

                  {/* Weather Fact Section */}
                  <Animated.View
                    style={[
                      styles.weatherFactContainer,
                      {
                        backgroundColor: themeColors.factBg,
                        opacity: factFadeAnim,
                        borderColor: themeColors.accentColor ? `${themeColors.accentColor}80` : 'rgba(120,120,120,0.5)' // Moved dynamic borderColor here
                      }]}>
                    <Text style={[styles.weatherFactText, { color: themeColors.text }]}>{weatherFact}</Text>
                  </Animated.View>
                </>
              ) : (
                // Feedback Tab Content
                <View style={styles.feedbackContainer}>
                  <Text style={[styles.feedbackTitle, { color: themeColors.text }]}>We value your feedback! (Not really)</Text>
                  <Text style={[styles.feedbackDescription, { color: themeColors.subText }]}>Please let us know your thoughts or suggestions below. Or don't. It's a prank app.</Text>
                  <TextInput
                    style={[styles.feedbackInput, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.inputBorder, height: 50, marginBottom: 10 }]}
                    placeholder="Your Name (Optional)"
                    placeholderTextColor="#bbbbbb"
                    value={feedbackUserName}
                    onChangeText={setFeedbackUserName}
                    editable={!feedbackLoading}
                    maxLength={100}
                  />
                  <TextInput
                    style={[styles.feedbackInput, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.inputBorder, height: 150 /* Explicit height for multiline */ }]}
                    placeholder="Type your feedback here... (if you must)"
                    placeholderTextColor="#bbbbbb"
                    value={feedbackText}
                    onChangeText={setFeedbackText}
                    multiline
                    editable={!feedbackLoading}
                    textAlignVertical="top" // Good for multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    style={[styles.feedbackSubmitButton, { backgroundColor: feedbackText.trim() ? themeColors.buttonBg : '#888', opacity: feedbackLoading ? 0.7 : 1 }]}
                    onPress={handleFeedbackSubmit} // Use the new handler
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
          </ScrollView>
        </KeyboardAvoidingView>

      </LinearGradient>
    </View>
  );
}

// Styles for the application
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // scrollViewFlex is no longer needed as flex is applied inline
  // scrollContainer paddingBottom is now handled by contentContainerStyle inline (padding: 20)
  // keyboardAvoidingViewContent is no longer needed as its properties are handled by inline styles
  // or are not applicable in the new structure.
  dynamicContentWrapper: {
    width: '100%',
    alignItems: 'center', // Centers content horizontally within this wrapper
    // minHeight: 450, // REMOVED: Allow wrapper to size to its content.
                      // This might cause elements below (like Weather Fact) to shift more.
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120,120,120,0.5)', // Consider theming this
    backgroundColor: 'transparent', // Ensure gradient shows through
    width: '100%',
  },
  tabButton: {
    marginHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 3, // Active tab indicator
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
    position: 'absolute', // Position it relative to the header
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
    fontSize: 36, // Increased title size
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 17, // Slightly increased subtitle size
    fontStyle: 'italic',
    marginBottom: 10, // Added more space below subtitle
    textAlign: 'center', // Added for better subtitle centering
    paddingHorizontal: 10, // Added for better subtitle centering
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
    // borderColor will be themed
  },
  searchButton: {
    width: '100%', // Take full width of parent
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    // Adding shadow to the search button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
    // borderColor will be themed
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
  viewShotContainer: { // Used for capturing screenshot
    width: '100%',
    alignItems: 'center',
    // This view now benefits from the minHeight of dynamicContentWrapper
  },
  weatherCard: { // Styling for the card displaying weather/prank info
    width: '95%', // Use percentage for responsiveness
    maxWidth: 400, // Max width for larger screens
    padding: 20, // Adjusted padding for a bit more breathing room
    borderRadius: 22, // Slightly more rounded corners for iOS feel
    // Adding some shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Softer shadow offset
    shadowOpacity: 0.08, // More subtle shadow opacity
    shadowRadius: 12, // More diffused shadow
    // elevation: 8, // Removing elevation for a more iOS-like shadow (shadow props above work for iOS)
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
  forecastTitle: { // Style for the "Weather Forecast for <Location>" text
    fontSize: 17, // Slightly adjusted font size
    textAlign: 'center',
    marginBottom: 10, // Space before the roast message
    fontWeight: '500', // Semi-bold
  },
  goCheckOutsideText: { // Style for the "Go Check Outside!" message
    fontSize: 30, // Increased font size
    fontWeight: 'bold', // Bold font
    textAlign: 'center',
    marginVertical: 15, // Add some vertical spacing around it
  },
  roastText: {
    fontSize: 17, // Slightly adjusted font size
    // fontStyle: 'italic', // Removed italic
    fontWeight: '600', // Made it semi-bold
    textAlign: 'center',
    marginBottom: 10,
  },
  nameSign: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.6, // Further reduced opacity for subtlety
    fontWeight: 'normal', // Ensure it's not unintentionally bold
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
  shareButton: { // Applied to "Share Prank" button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25, // Rounded corners
    flex: 1, // Allow button to take available space
    marginHorizontal: 5, // Space between buttons
    alignItems: 'center',
  },
  screenshotButton: { // Applied to "Share Screenshot" button
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
    padding: 20, // Increased padding
    borderRadius: 16, // Updated border radius
    marginTop: 25,
    borderWidth: 1, // Added border
    borderColor: '#ccc', // Updated border color
    backgroundColor: 'rgba(255,255,255,0.9)', // Updated background color
    shadowColor: '#000', // Updated shadow properties
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6, // Updated elevation
  },
  weatherFactText: {
    fontSize: 16, // Updated font size
    textAlign: 'center',
    fontWeight: '500', // Updated font weight
  },
  // Feedback Tab Styles
  emptyStateText: { // Style for the placeholder text
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40, // Give it some space from the search bar
    fontStyle: 'italic',
  },
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
    // height: 150, // Height is now specific to the multiline input
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 15, // Space between inputs
    borderWidth: 1,
    // borderColor will be themed
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
