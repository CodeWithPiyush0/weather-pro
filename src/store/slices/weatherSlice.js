import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const fetchWeather = createAsyncThunk(
    'weather/fetchWeather',
    async (city) => {

        const currentRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        const forecastRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );

        // const response = await axios.get(
        //     `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        // );
        return {
            ...currentRes.data,
            forecast: forecastRes.data 
        };
    }
);

const weatherSlice = createSlice({
    name: 'weather',
    initialState: {
        cities: [],
        loading: false,
        unit: 'metric',
    },
    reducers: {
        removeCity: (state, action) => {
            state.cities = state.cities.filter(city => city.id !== action.payload);
        },
        toggleUnit: (state) => {
            state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => { state.loading = true; })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.loading = false;
                const exists = state.cities.find(c => c.id === action.payload.id);
                if(!exists){
                    state.cities.push(action.payload);
                }
            })
            .addCase(fetchWeather.rejected, (state) => { state.loading = false; });
    }
});

export const { removeCity, toggleUnit } = weatherSlice.actions;
export default weatherSlice.reducer;