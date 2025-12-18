// Weather icon mapping based on OpenWeatherMap condition codes
const weatherIcons = {
    '01d': '☀️',  '01n': '🌙',
    '02d': '⛅',  '02n': '☁️',
    '03d': '☁️',  '03n': '☁️',
    '04d': '☁️',  '04n': '☁️',
    '09d': '🌧️',  '09n': '🌧️',
    '10d': '🌦️',  '10n': '🌧️',
    '11d': '⛈️',  '11n': '⛈️',
    '13d': '❄️',  '13n': '❄️',
    '50d': '🌫️',  '50n': '🌫️'
};

const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const error = document.getElementById('error');
const loading = document.getElementById('loading');

if (typeof API_KEY === 'undefined' || !API_KEY) {
    showError('API key not found! Please check config.js file.');
}

// Get location by IP address (no permission needed)
async function getLocationByIP() {
    try {
        loading.style.display = 'block';
        error.style.display = 'none';
        
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.latitude && data.longitude) {
            getWeatherByCoords(data.latitude, data.longitude);
        } else {
            throw new Error('Could not get location from IP');
        }
    } catch (err) {
        console.error('IP location error:', err);
        showError('Could not detect location. Please search manually.');
        loading.style.display = 'none';
    }
}

// Get weather by city name
async function getWeather(city) {
    if (!API_KEY) {
        showError('API key not configured!');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        loading.style.display = 'block';
        error.style.display = 'none';
        weatherInfo.style.display = 'none';

        const response = await fetch(currentWeatherUrl);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);
        
        // Get forecast data
        await getForecast(data.coord.lat, data.coord.lon);
    } catch (err) {
        showError(err.message);
    } finally {
        loading.style.display = 'none';
    }
}

// Get weather by coordinates
async function getWeatherByCoords(lat, lon) {
    if (!API_KEY) {
        showError('API key not configured!');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        loading.style.display = 'block';
        error.style.display = 'none';
        weatherInfo.style.display = 'none';

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Unable to fetch weather data');
        }

        const data = await response.json();
        displayWeather(data);
        
        // Get forecast data
        await getForecast(lat, lon);
    } catch (err) {
        showError(err.message);
    } finally {
        loading.style.display = 'none';
        locationBtn.disabled = false;
    }
}

// Get 5-day forecast
async function getForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error('Forecast unavailable');
        
        const data = await response.json();
        displayForecast(data);
    } catch (err) {
        console.error('Forecast error:', err);
    }
}

// Display 5-day forecast
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    
    // Get one forecast per day (at noon)
    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        // Get forecast closest to noon (12:00)
        if (!dailyForecasts[dateKey] || Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyForecasts[dateKey].dt * 1000).getHours() - 12)) {
            dailyForecasts[dateKey] = item;
        }
    });
    
    // Take first 5 days
    const forecasts = Object.values(dailyForecasts).slice(0, 5);
    
    forecasts.forEach((forecast, index) => {
        const date = new Date(forecast.dt * 1000);
        const dayName = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const iconCode = forecast.weather[0].icon;
        const icon = weatherIcons[iconCode] || '🌤️';
        
        const card = document.createElement('div');
        card.className = `forecast-card ${index === 1 ? 'tomorrow' : ''}`;
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-date">${dateStr}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
            <div class="forecast-details">
                💧 ${forecast.main.humidity}%<br>
                💨 ${forecast.wind.speed} m/s
            </div>
        `;
        
        forecastContainer.appendChild(card);
    });
}

// Get current location using GPS (asks for permission)
function getCurrentLocation() {
    if (!navigator.geolocation) {
        // If geolocation not supported, use IP instead
        getLocationByIP();
        return;
    }

    locationBtn.disabled = true;
    locationBtn.textContent = '📍 Getting location...';

    navigator.geolocation.getCurrentPosition(
        // Success - use precise GPS location
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
            locationBtn.textContent = '📍 Use My Current Location';
        },
        // Error - fallback to IP location
        (error) => {
            locationBtn.disabled = false;
            locationBtn.textContent = '📍 Use My Current Location';
            
            if (error.code === error.PERMISSION_DENIED) {
                // User denied permission, use IP location instead
                console.log('GPS denied, using IP location');
                getLocationByIP();
            } else {
                showError('Location unavailable. Please search manually.');
            }
        }
    );
}

// Convert wind degrees to direction
function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Convert Unix timestamp to time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Display current weather
function displayWeather(data) {
    const iconCode = data.weather[0].icon;
    const icon = weatherIcons[iconCode] || '🌤️';

    document.getElementById('weatherIcon').textContent = icon;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('description').textContent = data.weather[0].description;
    
    // Basic details
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    
    // Additional details
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset);
    document.getElementById('minTemp').textContent = `${Math.round(data.main.temp_min)}°C`;
    document.getElementById('maxTemp').textContent = `${Math.round(data.main.temp_max)}°C`;
    document.getElementById('cloudiness').textContent = `${data.clouds.all}%`;
    document.getElementById('windDirection').textContent = getWindDirection(data.wind.deg);

    cityInput.value = data.name;
    weatherInfo.style.display = 'block';
    error.style.display = 'none';
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
    weatherInfo.style.display = 'none';
}

// Event listeners
locationBtn.addEventListener('click', getCurrentLocation);

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

// On page load - automatically get location using IP (no permission needed)
window.addEventListener('load', () => {
    if (API_KEY) {
        getLocationByIP(); // Uses IP, no pop-up!
    }
});