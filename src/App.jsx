import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import SearchBar from './components/SearchBar'
import { removeCity } from './store/slices/weatherSlice'
import { X } from 'lucide-react'

function App() {

  const { cities, unit } = useSelector((state) => state.weather);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>Weather Analytics</h1>

      <SearchBar />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {cities.map((city) => (
          <div 
            key={city.id}
            className='bg-white p-6 rounded-xl shadow-md relative group'
          >
            <button
              onClick={() => dispatch(removeCity(city.id))}
              className='absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition'
            >
              <X size={20} />
            </button>

            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-semibold '>{city.name}</h2>
                <p className='text-gray-500 capitalize'>{city.weather[0].description}</p>
              </div>
              <img 
                src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`} 
                alt="weather icon" 
              />
            </div>

            <div className='mt-4'>
              <span className='text-4xl font-bold'>
                {Math.round(city.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
              </span>
            </div>

            <div className='flex justify-between mt-6 text-sm text-gray-600 border-t pt-4'>
              <span>Humidity: {city.main.humidity}%</span>
              <span>Wind: {city.wind.speed} m/s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
