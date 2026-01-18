import React, { useState } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "./components/SearchBar";
import { removeCity } from "./store/slices/weatherSlice";
import { X } from "lucide-react";
import WeatherChart from "./components/WeatherChart";

function App() {
  const { cities, unit } = useSelector((state) => state.weather);
  const [selectedCity, setSelectedCity] = useState(null);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Weather Analytics
      </h1>

      <SearchBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <div
            key={city.id}
            onClick={() => setSelectedCity(city)}
            className="bg-white p-6 rounded-xl shadow-md relative group"
          >
            <button
              onClick={() => dispatch(removeCity(city.id))}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={20} />
            </button>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold ">{city.name}</h2>
                <p className="text-gray-500 capitalize">
                  {city.weather[0].description}
                </p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            </div>

            <div className="mt-4">
              <span className="text-4xl font-bold">
                {Math.round(city.main.temp)}°{unit === "metric" ? "C" : "F"}
              </span>
            </div>

            <div className="flex justify-between mt-6 text-sm text-gray-600 border-t pt-4">
              <span>Humidity: {city.main.humidity}%</span>
              <span>Wind: {city.wind.speed} m/s</span>
            </div>
          </div>
        ))}
      </div>

      {selectedCity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedCity(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold mb-4">
              {selectedCity.name} Analytics
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-xs uppercase">Pressure</p>
                <p className="font-bold">{selectedCity.main.pressure} hPa</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-xs uppercase">Visisbility</p>
                <p className="font-bold">{selectedCity.visibility / 1000} km</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-xs uppercase">Humidity</p>
                <p className="font-bold">{selectedCity.main.humidity}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-xs uppercase">Wind Speed</p>
                <p className="font-bold">{selectedCity.wind?.speed} m/s</p>
              </div>
            </div>

            {selectedCity.forecast && (
              <WeatherChart forecastData={selectedCity.forecast} unit={unit} />
            )}

            <div className="mt-8">
              <h3 className="text-lg font-semibold mg-4">5-Day Forecast</h3>
              <div className="space-y-3">
                {selectedCity.forecast?.list?.filter((_, index) => index % 8 === 0).map((day) => (
                  <div key={day.dt} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                    <span className="font-medium">
                      {new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-4">
                      <img 
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                        alt="icon"
                        className="w-8 h-8" 
                      />
                      <span className="font-bold text-lg">{Math.round(day.main.temp)}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
