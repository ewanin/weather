import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiHumidity, WiBarometer, WiThermometer, WiStrongWind, WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiSprinkle, WiSnow, WiFog } from 'react-icons/wi';
import styled from 'styled-components';

const WeatherContainer = styled.div`
    max-width: 600px;
    background-color: #4775b073;
    padding: 20px;
    border-radius: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WeatherIcon = styled.div`
    font-size: 3rem;
`;

const SkeletonLoading = () => (
    <WeatherContainer className='xl:w-[600px] lg:w-[450px] md:w-[50vw] w-[94vw] h-[250px] grid overflow-hidden md:mx-0 mx-[3vw] '>
        {[...Array(5)].map((_, index) => (
            <h2 key={index} className="text-xl font-bold mb-2 flex items-center animate-pulse">
                <div className='w-[20px] h-[20px] bg-[#f0f0f0]'></div>
                <span className="ml-2 w-full h-[20px] bg-[#f0f0f0]"></span>
            </h2>
        ))}
    </WeatherContainer>
);

const WeatherComponent = ({ latitude, longitude, apiKey, onDataLoaded }) => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
                setWeatherData(response.data);
                console.log("Weather Data:", response.data);
                onDataLoaded();
            } catch (error) {
                console.error("Error fetching weather data: ", error);
            }
        };
        fetchWeather();
    }, [latitude, longitude, apiKey, onDataLoaded]);

    if (!weatherData) return <SkeletonLoading />;

    // Function to get weather icon based on weather condition
    const getWeatherIcon = (weatherCondition) => {
        switch (weatherCondition) {
            case 'Clear':
                return <WiDaySunny className="text-3xl text-white" />;
            case 'Clouds':
                return <WiCloud className="text-[100px] text-white" />;
            case 'Rain':
                return <WiRain className="text-3xl" />;
            case 'Thunderstorm':
                return <WiThunderstorm className="text-3xl text-white" />;
            case 'Drizzle':
                return <WiSprinkle className="text-3xl text-white" />;
            case 'Snow':
                return <WiSnow className="text-3xl text-white" />;
            case 'Mist':
                return <WiFog className="text-3xl text-white" />;
            default:
                return <WiCloud className="text-[100px] text-white" />;
        }
    };

    return (
        <WeatherContainer>
            <h1 className=" text-2xl font-bold mb-2 flex items-center text-white">Current weather of your location</h1>
            <h2 className=" text-lg font-bold mb-2 flex items-center">
                <WeatherIcon>{getWeatherIcon(weatherData.weather[0].main)}</WeatherIcon>
                <span className=" text-white text-2xl">{weatherData.name}</span>
            </h2>
            <div className='xl:flex lg:grid flex flex-wrap justify-between gap-2'>
                <div className="flex items-center">
                    <WiThermometer className=" text-white text-[40px]" />
                    <p className=" text-white font-semibold text-xl">Temperature: {weatherData.main.temp}°C</p>
                </div>
                <div className="flex  items-center">
                    <WiHumidity className=" text-white text-[40px]" />
                    <p className="text-white font-semibold text-xl">Humidity: {weatherData.main.humidity}%</p>
                </div>
                <div className="flex  items-center">
                    <WiBarometer className=" text-white text-[40px]" />
                    <p className="text-white font-semibold text-xl">Pressure: {weatherData.main.pressure} hPa</p>
                </div>
                <div className="flex  items-center">
                    <WiStrongWind className="text-white text-[40px]" />
                    <p className="text-white font-semibold text-xl">Wind Speed: {weatherData.wind.speed} m/s</p>
                </div>
            </div>
        </WeatherContainer>
    );
};

const MapResult = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [weatherLoaded, setWeatherLoaded] = useState(false);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, (error) => {
                console.error("Error getting user's location: ", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const apiKey = '3aedd951b2415d9c084835eb42060d5d';

    const handleDataLoaded = () => {
        setWeatherLoaded(true);
    };

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <div className='xl:w-[600px] lg:w-[450px] w-full grid lg:place-content-start place-content-center overflow-hidden'>
            {userLocation && <WeatherComponent latitude={userLocation.latitude} longitude={userLocation.longitude} apiKey={apiKey} onDataLoaded={handleDataLoaded} />}
            {!weatherLoaded && <SkeletonLoading />}
            {weatherLoaded && (
                <iframe
                    title="Map"
                    className="mt-4 md:w-full w-[94vw] lg:h-[350px] h-[300px]"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.longitude - 0.1},${userLocation.latitude - 0.1},${userLocation.longitude + 0.1},${userLocation.latitude + 0.1}&layer=mapnik&marker=${userLocation.latitude},${userLocation.longitude}`}
                />
            )}
        </div>
    );
};

export default MapResult;
