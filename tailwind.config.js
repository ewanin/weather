module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};


{/* <>
  import React, {useState, useEffect} from 'react';

const CityData = () => {
    const [cityData, setCityData] = useState([]);

    useEffect(() => {
    fetchCityData();
    }, []);

    const fetchCityData = async () => {
        try {
    let allRecords = [];
  let start = 0;
  const chunkSize = 10000; // Maximum allowed rows per request

  while (true) {
                const response = await fetch(
  `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=${chunkSize}&start=${start}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.error('Error fetching data:', data);
  break;
                }

  if (data.records.length === 0) {
                    // No more records to fetch, exit the loop
                    break;
                }

  allRecords = [...allRecords, ...data.records];
  start += chunkSize;
            }

  setCityData(allRecords);
        } catch (error) {
    console.error('Error fetching city data:', error);
        }
    };

  return (
  <div className="container mx-auto">
    <h1 className="text-3xl font-bold my-4">City Data</h1>
    <table className="table-auto">
      <thead>
        <tr>
          <th className="border px-4 py-2">City Name</th>
          <th className="border px-4 py-2">Country</th>
          <th className="border px-4 py-2">Population</th>
          <th className="border px-4 py-2">Coordinates</th>
        </tr>
      </thead>
      <tbody>
        {cityData.map((city) => (
          <tr key={city.recordid}>
            <td className="border px-4 py-2">{city.fields.name}</td>
            <td className="border px-4 py-2">{city.fields.cou_name_en}</td>
            <td className="border px-4 py-2">{city.fields.population}</td>
            <td className="border px-4 py-2">{city.fields.coordinates?.lat}, {city.fields.coordinates?.lon}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

  export default CityData;

</> */}

{/* <>
  import React, {useState, useEffect} from 'react';
  import {WiDaySunny, WiCloudy, WiRain, WiThunderstorm, WiSprinkle, WiSnow, WiStrongWind, WiHumidity, WiFog, WiBarometer} from 'react-icons/wi';
  import './App.css'; // You'll create this file later for Tailwind CSS styles

  const apiKey = '3aedd951b2415d9c084835eb42060d5d';

  function WeatherCard() {
    const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async (latitude, longitude) => {
            try {
                const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
  );

  if (!response.ok) {
                    throw new Error('Unable to fetch weather data');
                }
  const data = await response.json();
  console.log('Weather Data:', data); // Logging weather data
  setWeatherData(data);
            } catch (error) {
    console.error(error);
  setError('Unable to fetch weather data');
            }
        };

  // Fetch weather data using user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('User Location:', { latitude, longitude }); // Logging user location
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.error(error);
        setError('Unable to retrieve your location');
      }
    );
        } else {
    setError('Geolocation is not supported by your browser');
        }
    }, []);

  if (error) {
        return <div className="error-message">{error}</div>;
    }

  return (
  <div className="weather-app bg-gray-100 min-h-screen flex justify-center items-center">
    <div className="container mx-auto p-6">
      {weatherData && (
        <div className="weather-info bg-white rounded-lg p-6">
          <h2 className="city text-3xl mb-2">{`Weather in ${weatherData.name}`}</h2>
          <p className="date">{new Date().toDateString()}</p>
          <div className="temperature-info flex items-center justify-center flex-col mb-4">
            <div className="description flex items-center gap-2 bg-gray-200 px-2 py-1 rounded">
              {getWeatherIcon(weatherData.weather[0].main)}
              <span className="description-text text-lg">{weatherData.weather[0].description}</span>
            </div>
            <div className="temp text-6xl text-shadow-black">{Math.round(weatherData.main.temp)}°C</div>
          </div>
          <div className="additional-info flex justify-around">
            <div className="wind-info flex items-center flex-col">
              <WiStrongWind className="text-4xl text-gray-600" />
              <div>
                <h3 className="wind-speed">{`${weatherData.wind.speed} km/h`}</h3>
                <p className="wind-label">Wind</p>
              </div>
            </div>
            <div className="humidity-info flex items-center flex-col">
              <WiHumidity className="text-4xl text-gray-600" />
              <div>
                <h3 className="humidity">{`${weatherData.main.humidity}%`}</h3>
                <p className="humidity-label">Humidity</p>
              </div>
            </div>
            <div className="visibility-info flex items-center flex-col">
              <WiFog className="text-4xl text-gray-600" />
              <div>
                <h3 className="visibility-distance">{`${weatherData.visibility / 1000} km`}</h3>
                <p className="visibility">Visibility</p>
              </div>
            </div>
            <div className="pressure-info flex items-center flex-col">
              <WiBarometer className="text-4xl text-gray-600" />
              <div>
                <h3 className="pressure">{`${weatherData.main.pressure} mb`}</h3>
                <p className="pressure-label">Pressure</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

  function getWeatherIcon(weatherCondition) {
    switch (weatherCondition) {
        case 'Clear':
  return <WiDaySunny className="text-3xl" />;
  case 'Clouds':
  return <WiCloudy className="text-3xl" />;
  case 'Rain':
  return <WiRain className="text-3xl" />;
  case 'Thunderstorm':
  return <WiThunderstorm className="text-3xl" />;
  case 'Drizzle':
  return <WiSprinkle className="text-3xl" />;
  case 'Snow':
  return <WiSnow className="text-3xl" />;
  default:
  return <WiCloudy className="text-3xl" />;
    }
}

  export default WeatherCard;
</> */}