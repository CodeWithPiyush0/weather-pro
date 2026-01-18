import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts'

const WeatherChart = ({ forecastData, unit }) => {

    const chartData = forecastData?.list?.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp),
    }))
  return (
    <div className='h-64 w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-4'>
        <h3 className='text-sm font-medium text-gray-500 mb-4'>24-Hour Temperature Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id='colorTemp' x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor='#3b82f6' stopOpacity={0.3}/>
                        <stop offset="95%" stopColor='#3b82f6' stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#f0f0f0' />
                <XAxis dataKey="time" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis unit='°' tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1' }}
                />
                <Area 
                    type="monotone"
                    dataKey="temp"
                    stroke='#3b82f6'
                    strokeWidth={3}
                    fillOpacity={1}
                    fill='url(#colorTemp)'
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  )
}

export default WeatherChart