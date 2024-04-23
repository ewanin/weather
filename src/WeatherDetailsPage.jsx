import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const WeatherDetailsPage = () => {
    const { city } = useParams();
    const [dailyForecast, setDailyForecast] = useState([]);
    const [todayForecast, setTodayForecast] = useState(null);
    const [sunrise, setSunrise] = useState(null);
    const [sunset, setSunset] = useState(null);
    const [error, setError] = useState(null);
    const [temperatureUnit, setTemperatureUnit] = useState('metric');

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const fetchWeatherData = async () => {
        try {
            // Fetch weather data for today
            const todayResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3aedd951b2415d9c084835eb42060d5d&units=${temperatureUnit}`
            );
            const todayData = await todayResponse.json();
            if (!todayResponse.ok) {
                throw new Error('Error fetching today\'s weather data');
            }

            // Fetch daily weather forecast for next 7 days
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=3aedd951b2415d9c084835eb42060d5d&units=${temperatureUnit}`
            );
            const forecastData = await forecastResponse.json();
            if (!forecastResponse.ok) {
                throw new Error('Error fetching daily forecast data');
            }

            // Group forecast data by date
            const groupedForecast = {};
            forecastData.list.forEach((forecast) => {
                const date = forecast.dt_txt.split(' ')[0];
                if (!groupedForecast[date]) {
                    groupedForecast[date] = [];
                }
                groupedForecast[date].push(forecast);
            });

            // Extract daily forecast for next 7 days
            const dailyForecast = Object.values(groupedForecast).slice(0, 7);

            setTodayForecast(todayData);
            setDailyForecast(dailyForecast);

            // Fetch sunrise and sunset times
            const { coord } = todayData;
            if (coord) {
                const { lon, lat } = coord;
                await fetchSunriseSunset(lon, lat);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Error fetching weather data');
        }
    };

    const fetchSunriseSunset = async (longitude, latitude) => {
        try {
            const response = await fetch(
                `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Error fetching sunrise-sunset data');
            }
            setSunrise(new Date(data.results.sunrise));
            setSunset(new Date(data.results.sunset));
        } catch (error) {
            console.error('Error fetching sunrise-sunset data:', error);
            setError('Error fetching sunrise-sunset data');
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const celsiusToFahrenheit = (celsius) => {
        return (celsius * 9 / 5) + 32;
    };

    const toggleTemperatureUnit = (unit) => {
        setTemperatureUnit(unit);
    };

    const formatTemperature = (temperature) => {
        if (temperatureUnit === 'metric') {
            return `${temperature.toFixed(1)}°C`;
        } else {
            return `${celsiusToFahrenheit(temperature).toFixed(1)}°F`;
        }
    };

    return (
        <div className=" xl:w-[600px] lg:w-[450px] md:w-[80vw] w-[94vw] lg:absolute lg:mt-0 mt-10 mx-auto top-[2vw] right-[2vw]">
            <h1 className="text-3xl font-bold mb-4 text-white">{city} Weather Details</h1>
            {error && <p className="text-red-500">{error}</p>}

            {/* Temperature Unit Dropdown */}
            <div className="mb-4">
                <label className="mr-2 font-semibold text-white">Temperature Unit:</label>
                <select value={temperatureUnit} onChange={(e) => toggleTemperatureUnit(e.target.value)} className="p-2 border border-none rounded">
                    <option value="metric">Celsius</option>
                    <option value="imperial">Fahrenheit</option>
                </select>
            </div>

            {/* Today's Forecast */}
            {todayForecast && (
                <div className="mb-8 text-white">
                    <h2 className="text-xl font-semibold mb-1 underline">Today's Forecast</h2>
                    <p><b>Description:</b> {todayForecast.weather[0].description}</p>
                    <p><b>Temperature:</b> {formatTemperature(todayForecast.main.temp)}</p>
                    <p><b>Humidity:</b> {todayForecast.main.humidity}%</p>
                    <p><b>Wind Speed:</b> {todayForecast.wind.speed} km/h</p>
                    <p><b>Sunrise:</b> {sunrise && sunrise.toLocaleTimeString()}</p>
                    <p><b>Sunset:</b> {sunset && sunset.toLocaleTimeString()}</p>
                </div>
            )}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-white">Forecast of {city}</h2>
                <table className="w-full border-collapse text-center">
                    <thead className='bg-gray-50 text-gray-500 text-xs font-medium uppercase tracking-wider'>
                        <tr>
                            <th className="border px-4 py-2">Date</th>
                            <th className="border px-4 py-2">Day</th>
                            <th className="border px-4 py-2">Temperature</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white'>
                        {dailyForecast.map((dayForecast) => (
                            <tr key={dayForecast[0].dt} className='hover:bg-[#f0f0f0] cursor-pointer'>
                                <td className="border px-4 py-2">{formatDate(dayForecast[0].dt)}</td>
                                <td className="border px-4 py-2">{new Date(dayForecast[0].dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                                <td className="border px-4 py-2">{formatTemperature(dayForecast[0].main.temp)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link to="/" className="text-white underline">Go Back</Link>
        </div>
    );
};

export default WeatherDetailsPage;