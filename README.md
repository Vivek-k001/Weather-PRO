# 🌤️ Weather App

A clean and responsive weather application that shows current weather and a 5-day forecast.  
It smartly handles location access by combining IP-based location and GPS for better accuracy.

## ✨ Features

### 📍 Smart Location Detection
- **Automatic IP-based location**  
  - Gets approximate city-level weather without asking for permission.
- **Precise GPS location (optional)**  
  - Click the **Location** button to allow GPS for accurate results.
- **Fallback system**  
  - If GPS permission is denied, the app automatically falls back to IP-based location.

### 🔍 City Search
- Search weather for **any city worldwide** by typing the city name.
- Search works independently of location access.

### 🌡️ Weather Details
- Current temperature
- Feels-like temperature
- Humidity
- Wind speed
- Visibility
- Weather condition & icon

### 📅 5-Day Forecast
- Displays upcoming weather data
- **Tomorrow is highlighted** for quick visibility

### 🎨 UI & UX
- Clean modern gradient UI
- Smooth animations
- Fully responsive (mobile, tablet, desktop)


## 🚀 Live Demo

https://pro-weather-web.netlify.app/

## 📸 Screenshots

*will add later*

## 🛠️ Built With

- **HTML5** - Structure
- **CSS3** - Styling and animations
- **JavaScript** - Logic and API integration
- **OpenWeatherMap API** - Weather data

## 🌐 How It Works

1. App loads weather using IP-based location (no permission needed)
2. Clicking Location asks for GPS for accurate weather
3. If GPS is denied, it falls back to IP location
4. You can search any city anytime
5. Weather data comes from OpenWeatherMap API
6. Shows current weather and 5-day forecast in real time

## 📱 Responsive Design

The app automatically adjusts to different screen sizes:
- Desktop: Full grid layout
- Tablet: Optimized spacing
- Mobile: Stacked layout for easy viewing

## 📌 Notes
- IP-based location gives approximate results (city-level).
- GPS provides the most accurate weather data.

## 🤝 Contributing

Feel free to fork this project and submit pull requests!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).


## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Weather icons are emoji-based for universal compatibility

---

