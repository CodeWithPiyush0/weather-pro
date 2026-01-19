# Weather Analytics Dashboard

A modern, responsive **Weather Analytics Dashboard** built with **React, Redux Toolkit, and Recharts**, designed to help users understand **current weather conditions, short-term forecasts, and weather trends** across multiple cities.

This project was created as part of a frontend assignment with a strong focus on **clean code, UX thinking, state management, and real-time data handling**.

---

## Live Demo
    *(Add your deployed link here — Vercel / Netlify)*

---

## Features

### Core Functionality
- Search weather by city name with API-based autocomplete
- View current weather conditions
- Hour-by-hour temperature trends
- 5-day forecast
- Detailed stats:
  - Humidity
  - Wind speed
  - Pressure
  - Visibility

### Favorites
- Mark cities as favorites
- Favorite cities are prioritized on the dashboard
- Favorites persist between sessions using localStorage

### Data Visualization
- Interactive charts built with Recharts
  - Temperature trends
  - Wind speed
  - Precipitation
- Tooltips and responsive charts
- Graceful empty states (e.g., no precipitation expected)

### Unit Toggle
- Switch between Celsius ↔ Fahrenheit

### Real-Time & Performance
- Weather data is refreshed when outdated
- Client-side caching (60 seconds) to reduce API calls
- Loading and error states handled cleanly

---

## UX & Design Decisions
- Card-based layout for quick scanning
- Progressive disclosure using modal for detailed analytics
- Clear visual hierarchy (temperature emphasized)
- Empty states instead of blank charts
- Mobile-responsive layout

---

## Tech Stack
- Frontend: React (Hooks)
- State Management: Redux Toolkit
- Charts: Recharts
- Styling: Tailwind CSS
- Icons: Lucide React
- API: OpenWeatherMap API
- Persistence: localStorage

---

## Project Structure

src/
 ├── components/
 │   ├── SearchBar.jsx
 │   ├── WeatherChart.jsx
 ├── store/
 │   └── slices/
 │       └── weatherSlice.js
 ├── App.jsx
 └── main.jsx

---

## API Usage

This project uses the OpenWeatherMap API:
- Current Weather API
- 5-Day / 3-Hour Forecast API
- Geocoding API (for autocomplete)

### Environment Variable

Create a .env file in the root:

VITE_WEATHER_API_KEY=your_api_key_here

---

## Caching Strategy
- Each city’s data includes a fetchedAt timestamp
- Weather data is refreshed if older than 60 seconds
- Unit changes intentionally trigger a refetch to keep the API as the single source of truth

---

## Favorites Persistence
- Favorite city names are stored in localStorage
- On app load, favorite cities are automatically re-fetched
- Favorite state is restored seamlessly across refreshes

---

## Error Handling
- API failures are displayed as user-friendly alerts
- Invalid or legacy localStorage data is sanitized
- Loading indicators prevent UI confusion

---

## Future Improvements
- User authentication (Google Sign-In)
- Map-based city selection
- Weather alerts & notifications
- Compare weather between multiple cities
- Dark mode support

---

## 👨‍💻 Author

Piyush Kumar  
Frontend Developer | UI/UX Enthusiast  

Portfolio: https://piyush-portfolio-seven.vercel.app  
GitHub: https://github.com/codewithpiyush0  
LinkedIn: https://www.linkedin.com/in/piyush-kumar-9b9618289  

---