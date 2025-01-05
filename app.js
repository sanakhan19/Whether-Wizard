document.getElementById("searchBtn").addEventListener("click", getWeather);
document.getElementById("themeToggle").addEventListener("change", toggleTheme);

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  const apiKey = "daa0b12503287139560084159eea8ea7";
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const weatherResponse = await fetch(currentWeatherUrl);
    if (!weatherResponse.ok) throw new Error("City not found");
    const weatherData = await weatherResponse.json();

    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error("Forecast data unavailable");
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(weatherData);
    displayForecast(forecastData);
    updateBackground(weatherData.weather[0].main);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

function displayCurrentWeather(data) {
  const { name, main, weather, wind } = data;
  const weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.style.display = "block";

  weatherContainer.innerHTML = `
    <h2>${name}</h2>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
    <p><strong>Temperature:</strong> ${main.temp}°C</p>
    <p><strong>Condition:</strong> ${weather[0].description}</p>
    <p><strong>Humidity:</strong> ${main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecastContainer");
  forecastContainer.innerHTML = ""; 

  const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyForecast.forEach(forecast => {
    const date = new Date(forecast.dt_txt).toLocaleDateString();
    const { main, weather } = forecast;

    const forecastCard = document.createElement("div");
    forecastCard.className = "card";
    forecastCard.style.width = "150px";
    forecastCard.innerHTML = `
      <h5>${date}</h5>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
      <p><strong>${main.temp}°C</strong></p>
      <p>${weather[0].description}</p>
    `;
    forecastContainer.appendChild(forecastCard);
  });
}

function updateBackground(condition) {
  const backgrounds = {
    Clear: "Clear sky.jpg",
    Clouds: "Clouds.jpg",
    Rain: "Rain.jpg",
    Snow: "Snow.jpg",
    Thunderstorm: "Thunderstorm.jpg",
    Drizzle: "Drizzle.jpg",
    Mist: "blue-mist.jpg",
  };

  const backgroundImage = backgrounds[condition] || "Default.jpg";
  document.body.style.backgroundImage = `url('${backgroundImage}')`;
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}
