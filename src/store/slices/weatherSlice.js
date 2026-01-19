import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const fetchWeather = createAsyncThunk(
    'weather/fetchWeather',
    async ({ city, unit }, { rejectWithValue }) => {
        try {

            const currentRes = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
            );

            const forecastRes = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
            );

            // const response = await axios.get(
            //     `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
            // );
            return {
                ...currentRes.data,
                forecast: forecastRes.data,
                fetchedAt: Date.now(),
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch weather data')
        }
    }
);

const weatherSlice = createSlice({
    name: 'weather',
    initialState: {
        cities: [],
        loading: false,
        error: null,
        unit: 'metric',
    },
    reducers: {
        removeCity: (state, action) => {
            state.cities = state.cities.filter(city => city.id !== action.payload);
        },
        toggleUnit: (state) => {
            state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
        },
        toggleFavourite: (state, action) => {
            const city = state.cities.find(c => c.id === action.payload);
            if (city) {
                city.favorite = !city.favorite;
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.loading = false;

                const exists = state.cities.find(c => c.id === action.payload.id);

                const favoriteStatus = exists?.favorite || false;

                if(!exists || Date.now() - exists.fetchedAt > 60000) {
                    state.cities = state.cities.filter(c => c.id !== action.payload.id);
                    state.cities.push({
                        ...action.payload,
                        favorite: favoriteStatus,
                    });
                }
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch weather data';
            });
    }
});

export const { removeCity, toggleUnit, toggleFavourite, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;