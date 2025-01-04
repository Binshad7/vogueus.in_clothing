import React from 'react'
import Card from '../Card/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueArea = () => {
    const revenueByArea = [
        { area: 'US', revenue: 800 },
        { area: 'Europe', revenue: 600 },
        { area: 'Asia', revenue: 400 },
        { area: 'Africa', revenue: 200 },
      ];
  return (
    <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Area</h3>
        <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByArea}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="area" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>
    </Card>
  )
}

export default RevenueArea
