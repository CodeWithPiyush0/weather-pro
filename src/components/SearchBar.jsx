import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWeather } from '../store/slices/weatherSlice'
import { Search, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const SearchBar = () => {

    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const unit = useSelector(state => state.weather.unit);
    const searchTimeoutRef = useRef(null);
    const suggestionRef = useRef(null);

    useEffect(() => {
        if(input.trim().length < 2){
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        if(searchTimeoutRef.current){
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`
                );
                setSuggestions(response.data);
                setShowSuggestions(true);

            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setShowSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if(searchTimeoutRef.current){
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [input]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(suggestionRef.current && !suggestionRef.current.contains(event.target)){
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return() => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if(input.trim()){
            dispatch(fetchWeather({ city: input, unit }));
            setInput('');
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (city) => {
        const cityName = `${city.name}${city.state ? `, ${city.state}` : ''}${city.country ? `, ${city.country}` : ''}`;
        dispatch(fetchWeather({ city: cityName, unit }));
        setInput('');
        setShowSuggestions(false);
    };

  return (
    <div className='relative max-w-md mx-auto mb-8' ref={suggestionRef}>
    <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => input.trim().length >= 2 && setShowSuggestions(true)}
                placeholder='Search city (e.g. Muzaffarpur, Bihar)...'
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            {loading && (
                <Loader2 className='absolute right-3 top-2.5 animate-spin text-gray-400' size={20}/>
            )}
        </div>
        <button 
            type='submit'
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
            Search
        </button>
    </form>

    {showSuggestions && suggestions.length > 0 && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
            {suggestions.map((city, index) => (
                <button
                    key={index}
                    onClick={() => handleSuggestionClick(city)}
                    className='w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2'
                >
                    <Search size={16} className='text-gray-400'/>
                    <div>
                        <div className='font-medium text-gray-800'>
                            {city.name}
                            {city.state && `, ${city.state}`}
                        </div>
                        <div className='text-xs text-gray-500'>{city.country}</div>
                    </div>
                </button>
            ))}
        </div>
    )}
    </div>
  )
}

export default SearchBar