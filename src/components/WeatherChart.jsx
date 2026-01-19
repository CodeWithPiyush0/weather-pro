import React, { useState } from 'react'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const WeatherChart = ({ forecastData, unit }) => {

    const [activeTab, setActiveTab] = useState('temperature');

    const chartData = forecastData?.list?.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0,
        windSpeed: Math.round(item.wind?.speed || 0),
        humidity: item.main.humidity,
    }))

    

    const renderChart = () => {
        switch (activeTab) {
            case 'temperature':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                            <defs>
                                <linearGradient id='colorTemp' x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor='#3b82f6' stopOpacity={0.3} />
                                    <stop offset="95%" stopColor='#3b82f6' stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id='colorFeelsLike' x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor='#10b981' stopOpacity={0.3} />
                                    <stop offset="95%" stopColor='#10b981' stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#f0f0f0' />
                            <XAxis 
                                dataKey="time" 
                                tick={{ fontSize: window.innerWidth < 600 ? 8 : 10, fill: '#94a3b8' }} 
                                axisLine={false} 
                                interval="preserveStartEnd" 
                                tickLine={false} 
                                tickMargin={10} 
                            />
                            <YAxis 
                                unit='°' 
                                tick={{ fontSize: window.innerWidth < 640 ? 8 : 10 }} 
                                axisLine={false} 
                                tickLine={false} 
                                width={30}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1' }}
                                formatter={(value) => `${value}°${unit === 'metric' ? 'C' : 'F'}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="temp"
                                stroke='#3b82f6'
                                strokeWidth={3}
                                fillOpacity={1}
                                fill='url(#colorTemp)'
                                name="Temperature"
                            />
                            <Area
                                type="monotone"
                                dataKey="feelsLike"
                                stroke='#10b981'
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={1}
                                fill='url(#colorTemp)'
                                name="Feels Like"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case 'precipitation':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#f0f0f0' />
                            <XAxis 
                                dataKey="time" 
                                tick={{ fontSize: window.innerWidth < 600 ? 8 : 10, fill: '#94a3b8' }} 
                                axisLine={false} 
                                interval="preserverStartEnd" 
                                tickLine={false} 
                                tickMargin={10} 
                            />
                            <YAxis 
                                unit='mm' 
                                tick={{ fontSize: window.innerWidth < 640 ? 8 : 10 }} 
                                axisLine={false} 
                                tickLine={false} 
                                width={30}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1' }}
                                formatter={(value) => `${value.toFixed(1)}mm`}
                            />
                            <Bar
                                dataKey="precipitation"
                                fill='#60a5fa'
                                radius={[8, 8, 0, 0]}
                                name="Precipitation (mm)"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'wind':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#f0f0f0' />
                            <XAxis 
                                dataKey="time" 
                                tick={{ fontSize: window.innerWidth < 640 ? 8 : 10, fill: '#94a3b8' }} 
                                axisLine={false} 
                                interval="preserveStartEnd" 
                                tickLine={false} 
                                tickMargin={10}
                            />
                            <YAxis 
                                unit={unit === 'metric' ? ' m/s' : ' mph'} 
                                tick={{ fontSize: window.innerWidth < 640 ? 8 : 10 }} 
                                axisLine={false} 
                                tickLine={false} 
                                width={40}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1' }}
                                formatter={(value) => `${value} ${unit === 'metric' ? 'm/s' : 'mph'}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="windSpeed"
                                stroke='#f49e0b'
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Wind Speed"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    return (
        <div className='w-full bg-white p-2 md:p-4 rounded-xl border border-gray-100 shadow-sm mt-4'>
            <div className='flex gap-1 md:gap-2 mb-4 px-2 overflow-x-auto'>
                <button
                    onClick={() => setActiveTab('temperature')}
                    className={`px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap shrink-0 ${
                        activeTab === 'temperature'
                            ? 'bg-blue-100 text-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Temperature
                </button>
                <button
                    onClick={() => setActiveTab('precipitation')}
                    className={`px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap shrink-0 ${
                        activeTab === 'precipitation'
                            ? 'bg-blue-100 text-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Precipitation
                </button>
                <button
                    onClick={() => setActiveTab('wind')}
                    className={`px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap shrink-0 ${
                        activeTab === 'wind'
                            ? 'bg-blue-100 text-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Wind Speed
                </button>
            </div>
            <div className='h-64 md:h-80'>
                {chartData && chartData.length > 0 ? renderChart() : (
                    <div className='flex items-center justify-center h-full text-gray-500'>
                        No data available
                    </div>
                )}
            </div>
        </div>
    )

}

export default WeatherChart