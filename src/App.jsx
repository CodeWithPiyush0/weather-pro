import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "./components/SearchBar";
import { removeCity, toggleUnit, toggleFavourite, fetchWeather, clearError } from "./store/slices/weatherSlice";
import { X, Star, AlertCircle, Loader2 } from "lucide-react";
import WeatherChart from "./components/WeatherChart";

function App() {
  const { cities, unit, loading, error, favoriteCityNames } = useSelector((state) => state.weather);
  const [selectedCity, setSelectedCity] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    favoriteCityNames.forEach(cityName => {
      dispatch(fetchWeather({ city: cityName, unit }));
    });
  }, []);

  useEffect(() => {
    cities.forEach(city => {
      dispatch(fetchWeather({ city: city.name, unit }))
    });
  }, [unit]);

  const sortedCities = useMemo(() => {
    return [...cities].sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [cities]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Weather Analytics Dashboard
      </h1>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => dispatch(toggleUnit())}
          className="px-4 py-2 bg-gray-800 text-white rounded-xl"
          disabled={loading}
        >
          Switch to {unit === "metric" ? "°F" : "°C"}
        </button>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())} className="ml-auto">
            <X size={18} />
          </button>
        </div>
      )}

      <SearchBar />

      {loading && cities.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      )}

      {sortedCities.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No cities added yet. Search for a city to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCities.map((city) => (
          <div
            key={city.id}
            onClick={() => setSelectedCity(city)}
            className="bg-white p-6 rounded-xl shadow-md relative group cursor-pointer hover:shadow-lg transition-shadow"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleFavourite(city.id));
              }}
              className="absolute top-2 left-2 z-10"
            >
              <Star 
                fill={city.favorite ? "gold" : "none"} 
                stroke={city.favorite ? "gold" : "gray"}
                className="hover:scale-110 transition-transform"
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(removeCity(city.id));
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={20} />
            </button>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold ">{city.name}</h2>
                <p className="text-gray-500 capitalize">
                  {city.weather[0]?.description || 'N/A'}
                </p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${city.weather?.[0]?.icon || '01d'}@2x.png`}
                alt="weather icon"
              />
            </div>

            <div className="mt-4">
              <span className="text-4xl font-bold">
                {Math.round(city.main?.temp || 0)}°{unit === "metric" ? "C" : "F"}
              </span>
            </div>

            <div className="flex justify-between mt-6 text-sm text-gray-600 border-t pt-4">
              <span>Humidity: {city.main?.humidity || 0}%</span>
              <span>Wind: {city.wind?.speed || 0} {unit === 'metric' ? 'm/s' : 'mph'}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedCity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-3xl p-4 md:p-10 max-w-4xl w-[98%] md:w-full max-h-[90vh] overflow-y-auto relative shadow-2xl custom-scrollbar">
            <button
              onClick={() => setSelectedCity(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black z-10 bg-white rounded-full p-1"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl md:text-3xl font-bold mb-4 pr-8">
              {selectedCity.name} Analytics
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs uppercase">Pressure</p>
                <p className="font-bold text-sm md:text-base">{selectedCity.main?.pressure || 0} hPa</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-xs uppercase">Visisbility</p>
                <p className="font-bold text-sm md:text-base">{selectedCity.visibility ? (selectedCity.visibility / 1000).toFixed(1) : 'N/A'} km</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-xs uppercase">Humidity</p>
                <p className="font-bold text-sm md:text-base">{selectedCity.main?.humidity}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-xs uppercase">Wind Speed</p>
                <p className="font-bold text-sm md:text-base">{selectedCity.wind?.speed || 0} {unit === 'metric' ? 'm/s' : 'mph'}</p>
              </div>
            </div>

            {selectedCity.forecast && (
              <WeatherChart forecastData={selectedCity.forecast} unit={unit} />
            )}

            <div className="mt-8 mb-4">
              <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
              <div className="space-y-2">
                {selectedCity.forecast?.list?.filter((_, index) => index % 8 === 0).map((day) => (
                  <div key={day.dt} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
                    <span className="font-medium text-sm md:text-base text-gray-700">
                      {new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-2 md:gap-4">
                      <img
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                        alt="icon"
                        className="w-8 h-8"
                      />
                      <span className="font-bold text-base md:text-lg">{Math.round(day.main.temp)}°{unit === "metric" ? "C" : "F"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-4 w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
