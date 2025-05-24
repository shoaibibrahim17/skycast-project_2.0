# SkyC⚡st: Your Not-So-Average Weather Companion 🌦️ (Now with 100% More Backend!)

[![React Native](https://img.shields.io/badge/React%20Native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-%23000020.svg?style=for-the-badge&logo=expo&logoColor=%23fff)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Render](https://img.shields.io/badge/Hosted%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

Ever felt like the weather forecast takes itself *too* seriously? Us too. SkyC⚡st is here to inject a little chaos and a lot of (surprisingly accurate) weather into your day. We're the weather app that might roast you before it tells you if you need an umbrella.

## What in the Weather is This? 🤔

SkyC⚡st started as a humble prank weather app, designed to give your friends forecasts so outlandish they'd question reality. But like a good plot twist, we evolved! Now, SkyC⚡st offers:

1.  **The Infamous Prank Forecast:** Enter any location and get a hilariously unhinged weather report. Perfect for lightening the mood or confusing your group chat.
2.  **Actual, Real Weather (No, Really!):** After you've had your laugh, tap a button to see what the *actual* sky is planning. This data is pulled from reliable sources, processed by our sophisticated backend (which totally isn't just a bunch of `if` statements in a trench coat).
3.  **Feedback Mechanism:** Got a roast for us? Or maybe a suggestion? Our feedback system ensures your valuable (or vengeful) thoughts reach our highly attentive (and slightly terrified) development team.

## Key Features ✨

*   😂 **Prank Engine:** Generates unique, humorous, and sometimes existential weather "forecasts."
*   ☀️ **Real-Time Weather:** Accurate current weather, 7-day forecasts, and hourly details for any location worldwide.
*   🌍 **Location, Location, Location:** Search by city name or use your current GPS coordinates.
*   🌚 **Dark Mode & Light Mode:** Because your weather app should respect your eyes' life choices.
*   💅 **Sleek UI & Animations:** Smooth transitions and a user-friendly interface. We try.
*   📢 **Share the Chaos:** Easily share prank forecasts (or even real ones, if you're feeling generous).
*   📝 **Feedback System:** Send your thoughts directly to us via our backend-powered EmailJS integration.
*   ⚙️ **Secure Backend:** API keys and sensitive operations are handled securely on our Node.js backend, hosted on Render.

## Tech Stack 💻

SkyC⚡st is a full-stack marvel (if we do say so ourselves):

*   **Frontend (Mobile App):**
    *   React Native
    *   Expo
*   **Backend (`skycast-backend` - separate repository):**
    *   Node.js
    *   Express.js
    *   Axios (for API calls)
    *   `dotenv` (for environment variable management)
    *   `@emailjs/nodejs` (for sending feedback emails)
*   **APIs Consumed (via Backend):**
    *   OpenWeatherMap (for geocoding)
    *   Open-Meteo (for weather forecast data)
*   **Deployment:**
    *   Backend hosted on Render.
    *   Mobile app built using EAS Build.

## Getting Started (Development) 🚀

Want to peek under the hood or contribute to the meteorological madness?

**Prerequisites:**

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Expo CLI: `npm install -g expo-cli`
*   EAS CLI: `npm install -g eas-cli`
*   Git

**Frontend (This Repository):**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/SkyCast-Project-2.0.git
    cd SkyCast-Project-2.0
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up the Backend URL:**
    *   Create a `config.js` file in the root of the project.
    *   Add the following, adjusting the `DEVELOPMENT_BACKEND_URL` to point to your local backend instance (see Backend Setup below) and `PRODUCTION_BACKEND_URL` to your deployed backend:
        ```javascript
        // config.js
        const IS_DEVELOPMENT = __DEV__;
        const DEVELOPMENT_BACKEND_URL = 'http://YOUR_LOCAL_PC_IP:3000';
        const PRODUCTION_BACKEND_URL = 'https://your-deployed-backend.onrender.com';

        export const BACKEND_URL = IS_DEVELOPMENT
          ? DEVELOPMENT_BACKEND_URL
          : PRODUCTION_BACKEND_URL;
        ```
4.  **Run the app:**
    ```bash
    npx expo start
    ```
    Scan the QR code with the Expo Go app on your Android or iOS device.

**Backend (`skycast-backend` - separate repository):**

1.  Clone your `skycast-backend` repository.
2.  Navigate into its directory.
3.  Install dependencies: `npm install`.
4.  Create a `.env` file in the root of the `skycast-backend` directory with your API keys:
    ```env
    OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
    EMAILJS_SERVICE_ID=your_emailjs_service_id
    EMAILJS_TEMPLATE_ID_FEEDBACK=your_emailjs_template_id
    EMAILJS_PRIVATE_KEY=your_emailjs_private_key
    EMAILJS_PUBLIC_KEY=your_emailjs_public_key
    ```
5.  Start the backend server: `npm start`.

## Future Enhancements (Or "Things We Might Do If We're Not Too Busy Roasting Locations") 🔮

*   More diverse prank categories.
*   Weather maps (maybe... maps are hard).
*   User accounts to save favorite locations (definitely hard).
*   Even more sarcastic loading messages.

## Contributing 🤝

Found a bug? Got a killer idea for a weather roast? We're open to contributions! Please feel free to:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please ensure your code follows the existing style and that you've tested your changes.

## License 📜

This project is distributed under the MIT License. See `LICENSE` for more information. (You'll need to add a `LICENSE` file with the MIT license text if you want this).

## Acknowledgements 🙏

*   To all the weather APIs that tolerate our shenanigans.
*   To coffee, the true MVP of this project.
*   To you, for checking out SkyC⚡st! May your skies be... interesting.

