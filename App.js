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
  RefreshControl, // Added for pull-to-refresh
  Modal, // Import Modal
  Easing, // Import Easing for animated effects
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import emailjs, { EmailJSResponseStatus } from '@emailjs/react-native'; // Import the EmailJS SDK
import * as Location from 'expo-location'; // Import Location
import * as StoreReview from 'expo-store-review'; // For app rating
import ViewShot from 'react-native-view-shot';
// import { GestureHandlerRootView, PanGestureHandler, State as GestureState } from 'react-native-gesture-handler'; // For swipe gestures

const { width, height } = Dimensions.get('window');


const lightTheme = {
  gradientColors: ['#6DD5FA', '#FF7F00'], // Light blue to orange
  text: '#000000', // iOS often uses pure black or very dark gray for text
  subText: '#3c3c4399', // iOS secondary label color (opacity 60% of #3C3C43)
  accentColor: '#FF7F00',
  inputBg: '#f2f2f7', // iOS grouped table view cell background / input field background
  inputBorder: '#CCCCCC',
  buttonBg: '#4c669f',
  cardBg: 'rgba(255, 255, 255, 0.88)', // Slightly transparent white for a softer look
  tabActive: '#4c669f',
  tabInactive: '#999999',
  factBg: 'rgba(220, 235, 250, 0.85)', // Light, slightly blueish, semi-transparent
};

const darkTheme = {
  gradientColors: ['#1A2980', '#26D0CE'], // Dark blue to turquoise
  text: '#FFFFFF', // Pure white for text on dark backgrounds
  subText: '#ebebf599', // iOS secondary label color for dark mode (opacity 60% of #EBEBF5)
  accentColor: '#26D0CE',
  inputBg: '#2c2c2e', // iOS dark mode grouped table view cell background / input field background
  inputBorder: '#3a3a3c', // iOS dark mode separator color, can be used for subtle borders
  buttonBg: '#26D0CE',
  cardBg: 'rgba(20, 30, 55, 0.8)', // Dark, slightly desaturated blue, semi-transparent
  tabActive: '#26D0CE',
  tabInactive: '#666666',
  factBg: 'rgba(40, 50, 70, 0.8)', // Dark, desaturated blue-grey, semi-transparent
};


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


function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


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
    
];

const RAW_TRY_MORE_STRINGS = [
  "Wanna try more? It's weather, not your ex’s mood swings!",
  "Keep exploring more locations(Places) like a lost intern",
  "Keep trying — maybe one day I’ll actually care. 😌",
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
  "You must really believe in second chances.", 
  "Sorry, still no clouds. Just your cloudy judgment. ☁️", 
  "Nope. Not this city either. Try your hometown trauma. 🏠", 
  "This app is powered by sarcasm, not satellites. 🛰", 
  "This app roasts, but I'll compliment you... Maybe",
  "This app isn't your crush, it won't ignore you and reply you with a roast.. everytime",
]; 

const RAW_FEEDBACK_STRINGS = [
  "Tell me how much you loved it. Or hated it. I’ll pretend to listen.",
  "Loved it? Hated it? Say it. I wont't cry , Probably",
  "Say something nice or brutally honest. I'm sensitive but curious",
  "You have been roasted, now its your turn to roast me",
  "This app judged now, now judged it back",
  "Roast me back via the feedback form, I dare you",
  "Was the roasts good, or do I have to take extra classes in sarcasm",
  "Your review is more important than your attendance in college....For real",
  "Be honest, but not brutally honest. I'm sensitive remember?",
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

// Constant for the feedback prompt alert title
const FEEDBACK_PROMPT_TITLE = "Share Your Thoughts?";

const createDialogObjects = (messages, type) => {
  const titles = type === 'tryMore' ?
    ["Try More Locations!", "Try More Locations!", "Try More Locations!", "Try More Locations!", "Try More Locations!"] :
    [FEEDBACK_PROMPT_TITLE]; // Use the constant title for all feedback prompts
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

// --- IMPORTANT: Replace with your actual OpenWeatherMap API key ---
const OPENWEATHERMAP_API_KEY = 'ee04b5d5d93562ed5906455c42dbeb58';


export default function App() {
  
  const [activeTab, setActiveTab] = useState('skycast_now'); 
  const [location, setLocation] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [result, setResult] = useState(null); 
  const [showRealWeather, setShowRealWeather] = useState(false); 
  const [darkMode, setDarkMode] = useState(true); 
  const [fakeData, setFakeData] = useState(null); 
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0); 
  const [currentLoadingMsg, setCurrentLoadingMsg] = useState(LOADING_MESSAGES[0]); 
  const [loadingDots, setLoadingDots] = useState(''); 
  const [dynamicCardBg, setDynamicCardBg] = useState(null); // For dynamic weather card background
  const [shuffledWeatherFacts, setShuffledWeatherFacts] = useState([]); 
  const [currentFactIndex, setCurrentFactIndex] = useState(0); 
  const [hasShownTryMoreLocationsPrompt, setHasShownTryMoreLocationsPrompt] = useState(false); 
  const [hasShownFeedbackPrompt, setHasShownFeedbackPrompt] = useState(false); 
  const [prankCount, setPrankCount] = useState(0); 
  const [weatherFact, setWeatherFact] = useState(''); // Added missing weatherFact state
  const [usedRoastMessages, setUsedRoastMessages] = useState([]); // To track used roast messages
  
  // For non-repeating dialog messages
  const [shuffledTryMoreDialogs, setShuffledTryMoreDialogs] = useState([]);
  const [currentTryMoreDialogIndex, setCurrentTryMoreDialogIndex] = useState(0);
  const [shuffledFeedbackDialogs, setShuffledFeedbackDialogs] = useState([]);
  const [currentFeedbackDialogIndex, setCurrentFeedbackDialogIndex] = useState(0);

  // Feedback tab states
  const [feedbackText, setFeedbackText] = useState(''); 
  const [feedbackUserName, setFeedbackUserName] = useState(''); 
  const [feedbackLoading, setFeedbackLoading] = useState(false); 
  const [feedbackSuccess, setFeedbackSuccess] = useState(false); 
  const [dailyForecast, setDailyForecast] = useState([]); // For 7-day forecast
  // New states for real weather
  const [realWeatherData, setRealWeatherData] = useState(null);
  const [realWeatherError, setRealWeatherError] = useState(null);
  const [allHourlyForecastData, setAllHourlyForecastData] = useState([]); // To store all hourly data from API
  const [isShowingRealWeatherView, setIsShowingRealWeatherView] = useState(false);
  // State for Daily Forecast Modal
  const [isForecastModalVisible, setIsForecastModalVisible] = useState(false);
  const [selectedForecastDayData, setSelectedForecastDayData] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for RefreshControl
  const [successfulRealWeatherFetches, setSuccessfulRealWeatherFetches] = useState(0); // For rate prompt
  const [currentAppGradient, setCurrentAppGradient] = useState(lightTheme.gradientColors); // For dynamic gradients


  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(50)).current; 
  const scaleAnim = useRef(new Animated.Value(0.8)).current; 
  const rotateLogoAnim = useRef(new Animated.Value(0)).current; // For logo animation
  const factFadeAnim = useRef(new Animated.Value(1)).current; 
  const tabFadeAnim = useRef(new Animated.Value(1)).current; 
  const dot1Opacity = useRef(new Animated.Value(0.3)).current; // For loading dots
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;
  const forecastItemAnims = useRef( // For forecast item entrance animation
    Array(7).fill(null).map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;
  // const tabSlideAnimY = useRef(new Animated.Value(0)).current; // Removing slide animation for simplicity

  const tryMoreDialogTimeoutRef = useRef(null); // Ref for the "Try More Locations" dialog timeout
  // Ref for ViewShot (screenshot)
  const viewShotRef = useRef();

  // Helper function to get day of the week from a timestamp
const getDayOfWeek = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon"
};

// Helper function to interpret WMO codes from Open-Meteo
const getWeatherInfoFromWmoCode = (code) => {
  const wmoMap = {
    0: { condition: "Clear sky", iconName: "sun-icon.png", description: "Clear sky" },
    1: { condition: "Mainly clear", iconName: "sun-icon.png", description: "Mainly clear" },
    2: { condition: "Partly cloudy", iconName: "cloudy-icon.png", description: "Partly cloudy" },
    3: { condition: "Overcast", iconName: "cloudy-icon.png", description: "Overcast" },
    45: { condition: "Fog", iconName: "wind-icon.png", description: "Fog" }, // Using wind as placeholder for fog
    48: { condition: "Rime fog", iconName: "wind-icon.png", description: "Depositing rime fog" },
    51: { condition: "Light drizzle", iconName: "rain-icon.png", description: "Light drizzle" },
    53: { condition: "Moderate drizzle", iconName: "rain-icon.png", description: "Moderate drizzle" },
    55: { condition: "Dense drizzle", iconName: "rain-icon.png", description: "Dense drizzle" },
    56: { condition: "Light freezing drizzle", iconName: "snow-icon.png", description: "Light freezing drizzle" },
    57: { condition: "Dense freezing drizzle", iconName: "snow-icon.png", description: "Dense freezing drizzle" },
    61: { condition: "Slight rain", iconName: "rain-icon.png", description: "Slight rain" },
    63: { condition: "Moderate rain", iconName: "rain-icon.png", description: "Moderate rain" },
    65: { condition: "Heavy rain", iconName: "rain-icon.png", description: "Heavy rain" },
    66: { condition: "Light freezing rain", iconName: "snow-icon.png", description: "Light freezing rain" },
    67: { condition: "Heavy freezing rain", iconName: "snow-icon.png", description: "Heavy freezing rain" },
    71: { condition: "Slight snow fall", iconName: "snow-icon.png", description: "Slight snow fall" },
    73: { condition: "Moderate snow fall", iconName: "snow-icon.png", description: "Moderate snow fall" },
    75: { condition: "Heavy snow fall", iconName: "snow-icon.png", description: "Heavy snow fall" },
    77: { condition: "Snow grains", iconName: "snow-icon.png", description: "Snow grains" },
    80: { condition: "Slight rain showers", iconName: "rain-icon.png", description: "Slight rain showers" },
    81: { condition: "Moderate rain showers", iconName: "rain-icon.png", description: "Moderate rain showers" },
    82: { condition: "Violent rain showers", iconName: "rain-icon.png", description: "Violent rain showers" },
    85: { condition: "Slight snow showers", iconName: "snow-icon.png", description: "Slight snow showers" },
    86: { condition: "Heavy snow showers", iconName: "snow-icon.png", description: "Heavy snow showers" },
    95: { condition: "Thunderstorm", iconName: "thunder-icon.png", description: "Thunderstorm" },
    96: { condition: "Thunderstorm, slight hail", iconName: "thunder-icon.png", description: "Thunderstorm with slight hail" },
    99: { condition: "Thunderstorm, heavy hail", iconName: "thunder-icon.png", description: "Thunderstorm with heavy hail" },
  };
  return wmoMap[code] || { condition: "Unknown", iconName: "wind-icon.png", description: "Weather data unavailable" };
};

const iconMap = { // Map icon filenames to require statements
  'sun-icon.png': require('./assets/sun-icon.png'),
  'cloudy-icon.png': require('./assets/cloudy-icon.png'),
  'rain-icon.png': require('./assets/rain-icon.png'),
  'snow-icon.png': require('./assets/snow-icon.png'),
  'thunder-icon.png': require('./assets/thunder-icon.png'),
  'wind-icon.png': require('./assets/wind-icon.png'), // Default / Fog
  'bifrost-icon.png': require('./assets/bifrost-icon.png'), // For fake data
  'quantum-icon.png': require('./assets/quantum-icon.png'), // For fake data
};
  // --- Effects ---
  useEffect(() => {
    loadSettings(); // Load user preferences (dark mode)
    loadReviewRelatedData(); // Load data for rate prompt

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
    // const factSlideAnimY = new Animated.Value(0); // Removed for simpler fact animation
    const initialShuffledFacts = shuffleArray(WEATHER_FACTS);
    setShuffledWeatherFacts(initialShuffledFacts);
    if (initialShuffledFacts.length > 0) {
      setWeatherFact(initialShuffledFacts[0]);
      setCurrentFactIndex(1); // Next fact will be at index 1
      // Initial fade-in for the first fact
      factFadeAnim.setValue(0); // Ensure opacity is 0 before fading in
      Animated.parallel([
        Animated.timing(factFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
      ]).start();
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
    // const factSlideAnimY = new Animated.Value(0); // Removed for simpler fact animation
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
        Animated.timing(factFadeAnim, { toValue: 0, duration: 250, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        // The state update for weatherFact will happen here, then the fade-in starts
        Animated.timing(factFadeAnim, { toValue: 1, duration: 250, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
      ]).start();
    }, 7000); // Update fact every 7 seconds

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [shuffledWeatherFacts, currentFactIndex]); // factFadeAnim removed as it's a ref, factSlideAnimY is local

  // Effect for loading animation dots
  useEffect(() => {
    let animation;
    if (loading) {
      const createDotAnimation = (dotOpacity) => {
        return Animated.sequence([
          Animated.timing(dotOpacity, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(dotOpacity, { toValue: 0.3, duration: 400, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.delay(100), 
        ]);
      };

      animation = Animated.loop(
        Animated.stagger(250, [ 
          createDotAnimation(dot1Opacity),
          createDotAnimation(dot2Opacity),
          createDotAnimation(dot3Opacity),
        ])
      );
      animation.start();
    } else {
      dot1Opacity.setValue(0.3);
      dot2Opacity.setValue(0.3);
      dot3Opacity.setValue(0.3);
      if (animation) animation.stop();
    }
    return () => { if (animation) animation.stop(); };
  }, [loading, dot1Opacity, dot2Opacity, dot3Opacity]);

  // Effect for forecast item animations
  useEffect(() => {
    if (isShowingRealWeatherView && realWeatherData && dailyForecast.length > 0) {
      const animations = dailyForecast.map((_, index) => 
        Animated.parallel([
          Animated.timing(forecastItemAnims[index].opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(forecastItemAnims[index].translateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ])
      );
      Animated.stagger(80, animations).start();
    } else { forecastItemAnims.forEach(anim => { anim.opacity.setValue(0); anim.translateY.setValue(20); }); }
  }, [dailyForecast, isShowingRealWeatherView, realWeatherData, forecastItemAnims]);

  // Get current theme colors based on dark mode state
  const themeColors = darkMode ? darkTheme : lightTheme;
  useEffect(() => { setCurrentAppGradient(darkMode ? darkTheme.gradientColors : lightTheme.gradientColors); }, [darkMode]);

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

  // Load review related data
  const loadReviewRelatedData = async () => {
    try {
      const fetches = await AsyncStorage.getItem('successfulRealWeatherFetches');
      if (fetches !== null) setSuccessfulRealWeatherFetches(parseInt(fetches, 10));
    } catch (error) {
      console.error('Failed to load review related data:', error);
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

  // --- Daily Forecast Modal Functions ---
  const openForecastModal = (dayData) => {
    // Filter hourly data for the selected day
    const hourlyForDay = allHourlyForecastData.filter(
      (hourlyItem) => hourlyItem.datePart === dayData.dateString
    );
    
    setSelectedForecastDayData({
      ...dayData,
      hourly: hourlyForDay, // Add filtered hourly data to the selected day's data
      sunrise: dayData.sunrise, 
      sunset: dayData.sunset,
    });
    setIsForecastModalVisible(true);
    playClickSound();
  };

  const closeForecastModal = () => {
    setIsForecastModalVisible(false);
    // Delay clearing to allow modal to animate out smoothly if needed, though not strictly necessary with current setup
    setTimeout(() => setSelectedForecastDayData(null), 300); 
    playClickSound();
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
      await playClickSound(); 
      Alert.alert('Location Required', 'Please enter a location to get your highly scientific forecast.');
      return;
    }

    await playClickSound(); 
    Keyboard.dismiss(); 
    setLoading(true);
    setResult(null); 
    setFakeData(null); 
    setShowRealWeather(false); 
    setDynamicCardBg(null); 
    setRealWeatherData(null); // Clear previous real weather data
    setRealWeatherError(null); // Clear previous real weather error
    setIsShowingRealWeatherView(false); // No longer showing real weather view

    const loadingInterval = setInterval(rotateLoadingMessage, 2000); 

    try {
      
      await new Promise(resolve => setTimeout(resolve, 3000));

      const lowerCaseLocation = location.toLowerCase();
      let prankResult = null;
      let isFakeData = false;

      
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
       
        const randomPranks = [
          
          
          { message: "Weather Alert: Expect a shower of compliments. (Not from us, though).", roast: "You're doing great, sweetie. The weather, however, is just 'meh'." },
       
         
          { message: "The weather is as confused as you are about your career path.", roast: "At least one of you will figure it out eventually." },
          
        ];
        
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
          { message: "Go Check Outside!", roast: "You checking the forecast, but not my messages. Rude." },
          { message: "Go Check Outside!", roast: "Your CGPA is lower than the projector brighness in Room 109." },
          { message: "Go Check Outside!", roast: "you're the reason climate change seems okay." },
          { message: "Go Check Outside!", roast: "You're hotter than the hostel paneer on Sundays" },
           { message: "Go Check Outside!", roast: "You're hotter than the room temperature of our Classroom" },


          
        ];
        randomPranks.push(...newRoasts); // Append the roasts

        let availableRoasts = randomPranks.filter(
          prank => !usedRoastMessages.some(used => used.message === prank.message && used.roast === prank.roast)
        );

        if (availableRoasts.length === 0 && randomPranks.length > 0) {
          // All roasts shown, reset and use the full list
          setUsedRoastMessages([]);
          availableRoasts = [...randomPranks];
        }

        if (availableRoasts.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableRoasts.length);
          const randomPrank = availableRoasts[randomIndex];
          prankResult = { location, ...randomPrank };
          setUsedRoastMessages(prevUsed => [...prevUsed, randomPrank]);
        } else {
          // Fallback if randomPranks is somehow empty (should not happen with current constants)
          prankResult = { location, message: "Go Check Outside!", roast: "Looks like we're out of roasts for now!" };
        }
      }
      

      if (isFakeData) {
        setFakeData(prankResult);
      } else {
        setResult(prankResult);
      }

      setPrankCount(prevCount => prevCount + 1); 
      
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
      

      setShowRealWeather(true); // Show real weather button after prank
    } catch (error) {
      console.error('Error in handleSearch logic:', error);
      Alert.alert('Error', 'Failed to fetch forecast. The weather gods are busy.');
    } finally {
      setLoading(false);
      clearInterval(loadingInterval); 
    }
  };

  // --- Function to fetch real weather data ---
  const handleFetchRealWeather = async (searchQuery = location, coordinates = null) => {
    if (OPENWEATHERMAP_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
      Alert.alert('API Key Missing', 'Please add your OpenWeatherMap API key in the App.js file.');
      setLoading(false);
      return;
    }
    if (!searchQuery && !coordinates) {
      Alert.alert('Location Required', 'Please enter a location or use current location.');
      setLoading(false);
      return;
    }

    await playClickSound();
    Keyboard.dismiss();
    setLoading(true);
    setResult(null); // Clear prank result
    setFakeData(null); // Clear fake data
    setRealWeatherData(null);
    setDailyForecast([]); // Clear previous forecast
    setAllHourlyForecastData([]); // Clear previous hourly forecast
    setRealWeatherError(null);
    setIsShowingRealWeatherView(true); // Indicate we want to show the real weather view
    setCurrentAppGradient(darkMode ? darkTheme.gradientColors : lightTheme.gradientColors); // Reset gradient

    let lat, lon, displayName;

    try {
      if (coordinates) {
        lat = coordinates.latitude;
        lon = coordinates.longitude;
        try {
          const reverseGeoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`);
          const reverseGeoData = await reverseGeoResponse.json();
          if (reverseGeoResponse.ok && reverseGeoData.length > 0) {
            displayName = `${reverseGeoData[0].name}${reverseGeoData[0].country ? ', ' + reverseGeoData[0].country : ''}`;
            setLocation(displayName); // Update the input field with the fetched location name
          } else {
            displayName = "Current Location";
          }
        } catch (e) {
          console.error("Reverse geocoding error:", e);
          displayName = "Current Location";
        }
      } else {
        const geoResponse = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`
        );
        const geoData = await geoResponse.json();
        if (!geoResponse.ok || geoData.length === 0) {
          const errorMsg = (geoData && geoData.message) || 'City not found.';
          setRealWeatherError(errorMsg);
          Alert.alert('Geocoding Error', errorMsg);
          setLoading(false);
          return;
        }
        lat = geoData[0].lat;
        lon = geoData[0].lon;
        displayName = `${geoData[0].name}${geoData[0].country ? ', ' + geoData[0].country : ''}`;
      }

      // Step 2: Fetch weather data from Open-Meteo
      const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&timezone=auto&forecast_days=7`;
      const weatherResponse = await fetch(openMeteoUrl);
      const weatherData = await weatherResponse.json();

      if (weatherResponse.ok && weatherData.current && weatherData.daily) {
        const currentWmoInfo = getWeatherInfoFromWmoCode(weatherData.current.weather_code);
        
        setRealWeatherData({
          location: displayName,
          latitude: lat, // Store for potential refresh
          longitude: lon, // Store for potential refresh
          temperature: Math.round(weatherData.current.temperature_2m),
          condition: currentWmoInfo.condition, // Main condition text
          description: currentWmoInfo.description, // Detailed description
          iconName: currentWmoInfo.iconName, // Icon filename for local assets
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: Math.round(weatherData.current.wind_speed_10m), // Already in km/h
          high: Math.round(weatherData.daily.temperature_2m_max[0]), // Today's high
          low: Math.round(weatherData.daily.temperature_2m_min[0]),   // Today's low
        });

        const forecast = weatherData.daily.time.map((time, index) => {
          const dailyWmoInfo = getWeatherInfoFromWmoCode(weatherData.daily.weather_code[index]);
          return {
            dateString: time, // Keep the date string for filtering hourly data
            dt: new Date(time + "T00:00:00").getTime() / 1000, // Unix timestamp for start of day
            temp: {
              max: Math.round(weatherData.daily.temperature_2m_max[index]),
              min: Math.round(weatherData.daily.temperature_2m_min[index]),
            },
            weather: [{ // Keep similar structure for UI compatibility
              main: dailyWmoInfo.condition,
              description: dailyWmoInfo.description,
              iconName: dailyWmoInfo.iconName, // Icon filename
            }],
            sunrise: weatherData.daily.sunrise[index] ? new Date(weatherData.daily.sunrise[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
            sunset: weatherData.daily.sunset[index] ? new Date(weatherData.daily.sunset[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
          };
        }).slice(0, 7); // Ensure 7 days
        setDailyForecast(forecast);

        // Process and store all hourly data
        if (weatherData.hourly && weatherData.hourly.time) {
          const hourlyProcessed = weatherData.hourly.time.map((timeISO, index) => {
            const hourlyWmoInfo = getWeatherInfoFromWmoCode(weatherData.hourly.weather_code[index]);
            return {
              timeISO: timeISO, // Full ISO string "YYYY-MM-DDTHH:MM"
              datePart: timeISO.split('T')[0], // "YYYY-MM-DD"
              hourPart: timeISO.split('T')[1], // "HH:MM"
              temp: Math.round(weatherData.hourly.temperature_2m[index]),
              humidity: weatherData.hourly.relative_humidity_2m[index],
              precipitation_probability: weatherData.hourly.precipitation_probability[index],
              wind_speed: Math.round(weatherData.hourly.wind_speed_10m[index]),
              iconName: hourlyWmoInfo.iconName,
              condition: hourlyWmoInfo.condition,
            };
          });
          setAllHourlyForecastData(hourlyProcessed);
        }
        // Increment successful fetches and check for review prompt
        const newFetchCount = successfulRealWeatherFetches + 1;
        setSuccessfulRealWeatherFetches(newFetchCount);
        await AsyncStorage.setItem('successfulRealWeatherFetches', newFetchCount.toString());
        checkAndRequestReview(newFetchCount); // Check if it's time to ask for a review
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        const errorMsg = weatherData.reason || 'Failed to fetch weather data from Open-Meteo.';
        setRealWeatherError(errorMsg);
        Alert.alert('Weather API Error', errorMsg);
      }
    } catch (error) {
      console.error('Error fetching real weather:', error);
      setRealWeatherError('An error occurred. Please check your connection.');
      Alert.alert('Network Error', 'Could not connect to the weather service.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherForCurrentLocation = async () => {
    await playClickSound();
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert(
            'Location Permission Denied', 
            'SkyC⚡st needs your location to fetch the current weather. Please enable location services for this app in your device settings.',
            [{ text: 'OK' }]
        );
        setLoading(false);
        return;
    }
    try {
        let { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        await handleFetchRealWeather(null, coords); // Pass null for searchQuery, and coords
    } catch (error) {
        console.error("Error getting current location or weather:", error);
        Alert.alert("Error", "Could not fetch weather for current location. Ensure GPS is enabled.");
        setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await playClickSound();
    if (isShowingRealWeatherView && realWeatherData && typeof realWeatherData.latitude === 'number' && typeof realWeatherData.longitude === 'number') {
      await handleFetchRealWeather(null, { latitude: realWeatherData.latitude, longitude: realWeatherData.longitude });
    } else if (location.trim()) { // Fallback to last searched text if no coords available
      await handleFetchRealWeather(location);
    } else {
      // Optionally, try to fetch for current location if no other info is available
      // await fetchWeatherForCurrentLocation(); 
      // Or simply do nothing if no location context
      console.log("No location available to refresh.");
    }
    setRefreshing(false);
  }, [isShowingRealWeatherView, realWeatherData, location]); // Add dependencies

  const handleShareRealWeather = async () => { /* ... implementation ... */ };


  const spinLogo = () => {
      rotateLogoAnim.setValue(0);
      Animated.spring(rotateLogoAnim, {
          toValue: 1,
          friction: 6, // Adjust for bounciness
          tension: 50, // Adjust for speed
          useNativeDriver: true,
      }).start(() => {
          // Optional: Reset value if you want it to be ready for another discrete spin
          // rotateLogoAnim.setValue(0); 
      });
  };

  // Share functionality
  const onShare = async () => {
    await playClickSound(); 
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

  
  const captureAndShareScreenshot = async () => {
    await playClickSound(); 
    try {
      
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

      spinLogo(); // Spin the logo on new result
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }), // Slightly bouncier
      ]).start(() => {

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

    // Cleanup function for this effect
    return () => {
      if (tryMoreDialogTimeoutRef.current) {
        clearTimeout(tryMoreDialogTimeoutRef.current);
      }
    };
  }, [result, fakeData, prankCount, shuffledTryMoreDialogs, currentTryMoreDialogIndex, shuffledFeedbackDialogs, currentFeedbackDialogIndex]); // Added dialog state dependencies


 
  const switchTab = async (tabName) => {
    if (activeTab === tabName) return; // 
    await playClickSound(); 

    // Fade out the current tab content
    Animated.timing(tabFadeAnim, {
      toValue: 0,
      duration: 150, // A bit faster fade-out
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // Update the active tab state *after* the fade-out is complete
      // This ensures the old content is fully transparent before the new content is rendered
      setActiveTab(tabName);

      // Use requestAnimationFrame to ensure the UI has updated with the new activeTab
      // before starting the fade-in. This can help prevent flickering.
      requestAnimationFrame(() => {
        // Fade in the new tab content
        Animated.timing(tabFadeAnim, {
          toValue: 1,
          duration: 200, // A corresponding fade-in duration
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
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

    // These are your EmailJS credentials
    const serviceId = 'service_9et7so9';
    const templateId = 'template_hddwqhm';
    const publicKey = 'QIOPECGH-HoMwv4F2'; // This is your User ID / Public Key

    const feedbackData = {
      feedback_message: feedbackText.trim(),
      user_name: feedbackUserName.trim() || 'Anonymous SkyC⚡st User',
      submission_date: new Date().toLocaleString(), 
    };

    try {
      const response = await emailjs.send(
        serviceId,
        templateId,
        feedbackData, // These are your template_params
        { publicKey: publicKey } // Pass public key in options object
      );

      if (response.status === 200) {
        console.log('Feedback email sent successfully via EmailJS SDK!', response.text);

        // Save to AsyncStorage
        const existingFeedbacks = await AsyncStorage.getItem('userFeedbacks');
        const feedbacksArray = existingFeedbacks ? JSON.parse(existingFeedbacks) : [];
        feedbacksArray.push(feedbackData); // Save the structured feedback
        await AsyncStorage.setItem('userFeedbacks', JSON.stringify(feedbacksArray));

        setFeedbackSuccess(true);
        setFeedbackText('');
        setFeedbackUserName('');
        Keyboard.dismiss();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        // EmailJS SDK might return a non-200 status on soft failures or if the API itself returns an error handled by the SDK
        console.error('EmailJS SDK returned non-200 status:', response.status, response.text);
        Alert.alert('Submission Error', `Failed to send feedback: ${response.text || 'Unknown EmailJS error'}`);
        setFeedbackSuccess(false);
      }
    } catch (error) {
      if (error instanceof EmailJSResponseStatus) {
        // This catches errors specifically from the EmailJS SDK (e.g., network issues, auth problems detected by SDK)
        console.error('EmailJS SDK specific error during feedback submission:', error.status, error.text);
        Alert.alert('Submission Error', `Failed to send feedback. EmailJS Error ${error.status}: ${error.text || 'Please check your EmailJS configuration.'}`);
      } else {
        // General errors (e.g., programming errors before the SDK call, or unexpected issues)
        console.error('General error during feedback submission:', error);
        Alert.alert('Submission Error', `Failed to send feedback. ${error.message || 'An unexpected error occurred. Please try again.'}`);
      }
      setFeedbackSuccess(false); // Ensure success is false on error
    } finally {
      setFeedbackLoading(false);
    }
  };
  // --- End Feedback Submission ---
  const SUCCESSFUL_FETCHES_FOR_REVIEW = 5; 
  const MIN_DAYS_BETWEEN_REVIEW_PROMPTS = 14; 

  const checkAndRequestReview = async (currentFetchCount) => {
    try {
      const hasRated = await AsyncStorage.getItem('hasRatedApp');
      if (hasRated === 'true') return; 

      const lastPromptTimestampStr = await AsyncStorage.getItem('lastRatePromptTimestamp');
      const lastPromptTimestamp = lastPromptTimestampStr ? parseInt(lastPromptTimestampStr, 10) : 0;
      const now = Date.now();

      if (currentFetchCount >= SUCCESSFUL_FETCHES_FOR_REVIEW) {
        if (now - lastPromptTimestamp > MIN_DAYS_BETWEEN_REVIEW_PROMPTS * 24 * 60 * 60 * 1000) {
          if (await StoreReview.isAvailableAsync()) {
            Alert.alert(
              "Enjoying SkyC⚡st?",
              "If you like the app, would you mind taking a moment to rate it? It won't take more than a minute. Thanks for your support!",
              [
                { text: "Rate Now", onPress: async () => { StoreReview.requestReview(); await AsyncStorage.setItem('hasRatedApp', 'true'); } },
                { text: "Later", onPress: async () => await AsyncStorage.setItem('lastRatePromptTimestamp', now.toString()) },
                { text: "No, Thanks", onPress: async () => await AsyncStorage.setItem('hasRatedApp', 'true'), style: 'cancel' }
              ]
            );
          }
        }
      }
    } catch (error) { console.error("Error checking/requesting store review:", error); }
  };

  const logoRotation = rotateLogoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
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
            style={{ flex: 1 }}
          >
                <ScrollView
                  style={{ flex: 1 }} 
                  contentContainerStyle={{ flexGrow: 1, padding: 20 }} 
                  keyboardShouldPersistTaps="handled"
                  refreshControl={ 
                    activeTab === 'skycast_now' && (isShowingRealWeatherView || result || fakeData) ? (
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={themeColors.accentColor} 
                        colors={[themeColors.accentColor]} 
                      />
                    ) : undefined 
                  }
                >
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
                              trackColor={{ false: '#767577', true: themeColors.buttonBg }} 
                              thumbColor={darkMode ? themeColors.accentColor : '#f4f3f4'} 
                              ios_backgroundColor="#3e3e3e"
                              style={styles.darkModeSwitch}
                            />
                          </View>
                          <Animated.Image // Changed View to Animated.Image for rotation
                            source={darkMode ? require('./assets/logo-dark.png') : require('./assets/logo.png')}
                            style={[styles.logo, { transform: [{ rotate: logoRotation }] }]}
                          />
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
                            onSubmitEditing={handleSearch} 
                            returnKeyType="search" 
                            editable={!loading} 
                          >
                          </TextInput>
                          <TouchableOpacity
                            style={[styles.searchButton, { backgroundColor: themeColors.buttonBg }]}
                            onPress={handleSearch}
                            activeOpacity={0.7}
                            disabled={loading} 
                          >
                            <Text style={styles.searchButtonText}>
                              {loading ? 'Forecasting...' : 'Get Forecast'}
                            </Text>
                          </TouchableOpacity>

                          {showRealWeather && !isShowingRealWeatherView && ( 
                            <TouchableOpacity
                              style={[styles.realWeatherButton, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder, marginTop: 10 }]}
                              onPress={() => handleFetchRealWeather(location)} 
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
                              <Text style={[styles.loadingText, { color: themeColors.text }]}>{currentLoadingMsg}</Text>
                              <View style={styles.loadingDotsContainer}>
                                <Animated.Text style={[styles.loadingDot, { color: themeColors.text, opacity: dot1Opacity }]}>.</Animated.Text>
                                <Animated.Text style={[styles.loadingDot, { color: themeColors.text, opacity: dot2Opacity }]}>.</Animated.Text>
                                <Animated.Text style={[styles.loadingDot, { color: themeColors.text, opacity: dot3Opacity }]}>.</Animated.Text>
                              </View>
                            </View>
                          ) : isShowingRealWeatherView && realWeatherData ? (
                            <View style={styles.fakeDataContainer}> 
                              <View style={[styles.weatherCard, { backgroundColor: themeColors.cardBg }]}> 
                                {!loading && ( 
                                  <TouchableOpacity
                                    style={[styles.currentLocationButton, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder, marginBottom: 15 }]}
                                    onPress={fetchWeatherForCurrentLocation}
                                    disabled={loading} activeOpacity={0.7} >
                                    <Text style={[styles.currentLocationButtonIcon, { color: themeColors.text }]}>📍</Text>
                                    <Text style={[styles.currentLocationButtonText, { color: themeColors.text }]}>Use My Current Location</Text>
                                  </TouchableOpacity>)}
                                <Text style={[styles.locationText, { color: themeColors.text }]}>{realWeatherData.location}</Text>
                                <View style={styles.mainWeatherRow}>
                                  <Image                              
                                    source={iconMap[realWeatherData.iconName] || iconMap['wind-icon.png']}
                                    style={styles.weatherIcon}
                                  />
                                  <View>
                                    <Text style={[styles.tempText, { color: themeColors.text }]}>{realWeatherData.temperature}°C</Text>
                                    <Text style={[styles.conditionText, { color: themeColors.subText, textTransform: 'capitalize' }]}>{realWeatherData.description}</Text>
                                  </View>
                                </View>
                                <View style={styles.detailsRow}>
                                  <View style={styles.detailItem}><Text style={[styles.detailLabel, { color: themeColors.subText }]}>HUMIDITY</Text><Text style={[styles.detailValue, { color: themeColors.text }]}>{realWeatherData.humidity}%</Text></View>
                                  <View style={styles.detailItem}><Text style={[styles.detailLabel, { color: themeColors.subText }]}>WIND</Text><Text style={[styles.detailValue, { color: themeColors.text }]}>{realWeatherData.windSpeed} km/h</Text></View>
                                  <View style={styles.detailItem}><Text style={[styles.detailLabel, { color: themeColors.subText }]}>HIGH/LOW</Text><Text style={[styles.detailValue, { color: themeColors.text }]}>{realWeatherData.high}°/{realWeatherData.low}°</Text></View>
                                </View>
                                {dailyForecast.length > 0 && (
                                  <View style={styles.forecastSectionContainer}>
                                    <Text style={[styles.forecastSectionTitle, { color: themeColors.text }]}>7-Day Forecast</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.forecastScrollView}>
                                      {dailyForecast.map((day, index) => (
                                        <TouchableOpacity 
                                          key={index} 
                                          onPress={() => openForecastModal(day)} 
                                          activeOpacity={0.7}
                                          style={{ 
                                            opacity: forecastItemAnims[index].opacity,
                                            transform: [{ translateY: forecastItemAnims[index].translateY }],
                                          }}>
                                          <Animated.View style={[styles.forecastItemContainer, {backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}]}>
                                            <Text style={[styles.forecastDayText, { color: themeColors.text }]}>{getDayOfWeek(day.dt)}</Text>
                                            <Image
                                              source={iconMap[day.weather[0].iconName] || iconMap['wind-icon.png']}
                                              style={styles.forecastIcon}
                                            />
                                            <Text style={[styles.forecastTempText, { color: themeColors.text }]}>{Math.round(day.temp.max)}°</Text>
                                            <Text style={[styles.forecastTempText, { color: themeColors.subText, fontSize: 15 }]}>{Math.round(day.temp.min)}°</Text>
                                          </Animated.View>
                                        </TouchableOpacity>
                                      ))}
                                    </ScrollView>
                                  </View>
                                )}
                              </View>
                            </View>
                          ) : isShowingRealWeatherView && realWeatherError ? (
                            <Text style={[styles.emptyStateText, { color: themeColors.accentColor, marginTop: 20 }]}>{realWeatherError}</Text>
                          ) : fakeData ? (
                            <View style={styles.fakeDataContainer}>
                              <View
                                style={[
                                  styles.weatherCard,
                                  { backgroundColor: dynamicCardBg || themeColors.cardBg } 
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
                                      require('./assets/wind-icon.png') 
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
                            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={styles.viewShotContainer}>
                              <Animated.View style={[styles.resultContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
                                <View
                                  style={[
                                    styles.weatherCard,
                                    { backgroundColor: dynamicCardBg || themeColors.cardBg } 
                                  ]}
                                >
                                  <Image source={require('./assets/laugh-emoji.png')} style={styles.weatherIcon} />
                                  <Text style={[styles.forecastTitle, { color: themeColors.subText }]}>
                                    Weather Forecast for {result.location}
                                  </Text>
                                  <Text style={[styles.goCheckOutsideText, { color: themeColors.text }]}>
                                    Go Check Outside!
                                  </Text>
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
                              borderColor: themeColors.accentColor ? `${themeColors.accentColor}80` : 'rgba(120,120,120,0.5)' 
                            }]}>
                          <Text style={[styles.weatherFactText, { color: themeColors.text }]}>{weatherFact}</Text>
                        </Animated.View>
                      </>
                    ) : (
                      // Feedback Tab Content
                      <View style={styles.feedbackContainer}>
                        <Text style={[styles.feedbackTitle, { color: themeColors.text }]}>I value your feedback! (Not really)</Text>
                        <Text style={[styles.feedbackDescription, { color: themeColors.subText }]}>Please let me know your thoughts or suggestions below.</Text>
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
                          style={[styles.feedbackInput, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.inputBorder, height: 150  }]}
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
                          onPress={handleFeedbackSubmit} 
                          disabled={feedbackLoading || !feedbackText.trim()}
                          activeOpacity={0.7}>
                          <Text style={styles.feedbackSubmitButtonText}>{feedbackLoading ? 'Submitting...' : 'Submit Feedback'}</Text>
                        </TouchableOpacity>
                        {feedbackSuccess && (
                          <Text style={[styles.feedbackSuccessText, { color: themeColors.accentColor }]}>Thank you for your feedback! 🙌 (We're probably not going to read it)</Text>
                        )}

                        <View style={{ flex: 1 }} />
                        <View style={styles.bottomInfoContainer}>
                          <Text style={[styles.bottomInfoText, { color: themeColors.subText }]}>Skycast v2.0</Text>
                          <Text style={[styles.bottomInfoText, { color: themeColors.subText }]}>Made in Adilabad</Text>
                        </View>
                      </View>
                    )}
                  </Animated.View>
                </ScrollView>
          </KeyboardAvoidingView>

          {/* Detailed Forecast Modal */}
          {selectedForecastDayData && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={isForecastModalVisible}
              onRequestClose={closeForecastModal}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: themeColors.cardBg }]}>
                  <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                    {new Date(selectedForecastDayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </Text>
                  <Image
                    source={iconMap[selectedForecastDayData.weather[0].iconName] || iconMap['wind-icon.png']}
                    style={styles.modalWeatherIcon}
                  />
                  <Text style={[styles.modalCondition, { color: themeColors.text, textTransform: 'capitalize' }]}>{selectedForecastDayData.weather[0].main}</Text>
                  <Text style={[styles.modalDescription, { color: themeColors.subText, textTransform: 'capitalize' }]}>{selectedForecastDayData.weather[0].description}</Text>
                  <Text style={[styles.modalTemp, { color: themeColors.text }]}>
                    High: {selectedForecastDayData.temp.max}° / Low: {selectedForecastDayData.temp.min}°
                  </Text>
                  <View style={styles.modalSunriseSunsetContainer}>
                    <Text style={[styles.modalSunriseSunsetText, { color: themeColors.subText }]}>🌅 Sunrise: {selectedForecastDayData.sunrise}</Text>
                    <Text style={[styles.modalSunriseSunsetText, { color: themeColors.subText }]}>🌇 Sunset: {selectedForecastDayData.sunset}</Text>
                  </View>

                  {/* Hourly Forecast in Modal */}
                  {selectedForecastDayData.hourly && selectedForecastDayData.hourly.length > 0 && (
                    <View style={styles.modalHourlyForecastContainer}>
                      <Text style={[styles.modalSectionTitle, { color: themeColors.text }]}>Hourly Forecast</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modalHourlyScrollView}>
                        {selectedForecastDayData.hourly.map((hour, index) => (
                          <View key={index} style={[styles.modalHourlyItem, { backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]}>
                            <Text style={[styles.modalHourlyTimeText, { color: themeColors.text }]}>{hour.hourPart}</Text>
                            <Image source={iconMap[hour.iconName] || iconMap['wind-icon.png']} style={styles.modalHourlyIcon} />
                            <Text style={[styles.modalHourlyTempText, { color: themeColors.text }]}>{hour.temp}°</Text>
                            {hour.precipitation_probability !== null && <Text style={[styles.modalHourlyPrecipText, { color: themeColors.accentColor }]}>{hour.precipitation_probability}% 💧</Text>}
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.modalCloseButton, { backgroundColor: themeColors.buttonBg }]}
                    onPress={closeForecastModal}
                  >
                    <Text style={styles.modalCloseButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
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
    // borderBottomWidth: 1, // iOS tab bars usually don't have a full bottom border
    // borderBottomColor: 'rgba(120,120,120,0.5)', 
    backgroundColor: 'transparent', // Ensure gradient shows through
    // width: '100%', // Removed, let content define width if centered
  },
  tabButton: {
    marginHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 3, // Active tab indicator
  },
  tabButtonText: {
    fontSize: 17, // Common iOS tab bar font size
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
    fontSize: 34, // iOS Large Title size
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15, // iOS footnote or caption size, good for subtitles
    // fontStyle: 'italic', // Italics are less common in iOS for subtitles unless specific emphasis
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
    borderRadius: 10, // iOS like rounded corners for inputs
    fontSize: 17, // iOS body font size
    marginBottom: 10,
    // borderWidth: 1, // iOS inputs often don't have explicit borders if background is distinct
    // borderColor will be themed
  },
  searchButton: {
    width: '100%', // Take full width of parent
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    // iOS buttons often don't have heavy shadows unless they are floating action buttons
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
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
    borderRadius: 10, // Consistent with input fields
    alignItems: 'center',
    // borderWidth: 1, // Can be removed if background provides enough contrast
    // borderColor will be themed
  },
  realWeatherButtonText: {
    fontSize: 15, // Slightly larger for secondary buttons
    fontWeight: '600', // Semi-bold for button text
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
  loadingDotsContainer: { // Container for the animated dots
    flexDirection: 'row',
    marginTop: 5,
  },
  loadingDot: { // Style for each dot
    fontSize: 30, // Make dots larger
    lineHeight: 30, // Align them vertically
    marginHorizontal: 2,
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
    padding: 18, 
    borderRadius: 16, // Common iOS card corner radius
    shadowColor: 'rgba(0,0,0,0.1)', // Softer, more diffused shadow
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.8, // Opacity of the shadow itself
    shadowRadius: 12, 
    // elevation: 8, // Removing elevation for a more iOS-like shadow (shadow props above work for iOS)
    alignItems: 'center', // Center content within the card
  },
  currentLocationButton: { // Styles for the button INSIDE the weather card
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    // marginBottom is set inline
  },
  currentLocationButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  currentLocationButtonText: {
    fontSize: 15,
    fontWeight: '600',
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
    fontSize: 52, // Larger for prominent temperature display
    fontWeight: 'bold',
  },
  conditionText: {
    fontSize: 17, // iOS body size for condition
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
    fontSize: 13, // iOS caption 1 size
    fontWeight: '500', 
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 17, // iOS body size
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
    marginBottom: 8, 
    fontWeight: '500', // Semi-bold
  },
  goCheckOutsideText: { // Style for the "Go Check Outside!" message
    fontSize: 30, // Increased font size
    fontWeight: 'bold', // Bold font
    textAlign: 'center',
    marginVertical: 15, // Add some vertical spacing around it
  },
  roastText: {
    fontSize: 16, 
    // fontStyle: 'italic', // Removed italic
    fontWeight: '600', // Made it semi-bold
    textAlign: 'center',
    marginBottom: 10,
  },
  nameSign: {
    fontSize: 14,
    // fontStyle: 'italic', // Less common for signatures in iOS UI
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
    borderRadius: 10, // Consistent rounded corners
    flex: 1, // Allow button to take available space
    marginHorizontal: 5, // Space between buttons
    alignItems: 'center',
  },
  screenshotButton: { // Applied to "Share Screenshot" button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10, // Consistent rounded corners
    flex: 1, // Allow button to take available space
    marginHorizontal: 5, // Space between buttons
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF', // Ensure high contrast for button text
    fontWeight: 'bold',
    fontSize: 14,
  },
  weatherFactContainer: {
    width: '100%',
    padding: 20, // Increased padding
    borderRadius: 16, // Updated border radius
    marginTop: 25,
    // borderWidth: 1, // Often, iOS cards don't have explicit borders if bg is distinct
    // borderColor: '#ccc', 
    // backgroundColor: 'rgba(255,255,255,0.9)', // Use themeColors.cardBg or similar
    shadowColor: 'rgba(0,0,0,0.08)', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    // elevation: 6, 
  },
  weatherFactText: {
    fontSize: 15, 
    textAlign: 'center',
    fontWeight: '400', // Regular weight for facts
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
    fontSize: 22, // iOS Title 2 size
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  feedbackDescription: {
    fontSize: 15, // iOS footnote or caption
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  feedbackInput: { // Common style for both feedback inputs
    width: '100%',
    // height: 150, // Height is now specific to the multiline input
    borderRadius: 10, // Consistent iOS corner radius
    padding: 15,
    fontSize: 17, // iOS body
    marginBottom: 15, // Space between inputs
    // borderWidth: 1, // Can be removed if inputBg is distinct
    // borderColor will be themed
  },
  feedbackSubmitButton: {
    width: '100%',
    padding: 15, // Consistent padding
    borderRadius: 10, // Consistent iOS corner radius
    alignItems: 'center',
    marginTop: 10, // Space above button
  },
  feedbackSubmitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  feedbackSuccessText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    // fontStyle: 'italic', // Less common for success messages
  },
  bottomInfoContainer: {
    paddingVertical: 15, // Add some vertical spacing
    alignItems: 'center', // Center the text items
    width: '100%',       // Ensure it takes full width for centering
    marginTop: 20,       // Add some space from the content above if no spacer is used or content is short
  },
  bottomInfoText: {
    fontSize: 12,
    opacity: 0.7,        // Make it a bit muted
    marginBottom: 4,     // Space between the two lines of text
    // color will be themed via inline style
  },
  // Styles for 7-Day Forecast
  forecastSectionContainer: {
    marginTop: 20,
    width: '100%',
  },
  forecastSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  forecastScrollView: {
    paddingHorizontal: 5, 
  },
  forecastItemContainer: {
    alignItems: 'center',
    marginHorizontal: 8, 
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 70, 
  },
  forecastDayText: {
    fontSize: 14,
    fontWeight: '500', 
  },
  forecastIcon: {
    width: 40, 
    height: 40,
    marginVertical: 5,
  },
  forecastTempText: {
    fontSize: 16,
  },
  // Styles for Detailed Forecast Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Dark overlay
  },
  modalContent: {
    width: '85%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalWeatherIcon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  modalCondition: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  modalDescription: {
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTemp: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalSunriseSunsetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  modalSunriseSunsetText: {
    fontSize: 14,
  },
  modalCloseButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styles for Hourly Forecast in Modal
  modalHourlyForecastContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalHourlyScrollView: {
    paddingVertical: 5,
  },
  modalHourlyItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    minWidth: 65,
  },
  modalHourlyTimeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalHourlyIcon: {
    width: 30,
    height: 30,
    marginVertical: 3,
  },
  modalHourlyTempText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalHourlyPrecipText: {
    fontSize: 12,
    marginTop: 2,
  },
});
