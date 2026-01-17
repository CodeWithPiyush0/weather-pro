import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchWeather } from '../store/slices/weatherSlice'
import { Search } from 'lucide-react'

const SearchBar = () => {

    const [input, setInput] = useState('');
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        e.preventDefault();
        if(input.trim()){
            dispatch(fetchWeather(input));
            setInput('');
        }
    };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Search city (e.g. Muzaffarpur, Bihar)...'
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
        </div>
        <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
            Search
        </button>
    </form>
  )
}

export default SearchBar