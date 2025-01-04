import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../Card/Card';

const SalesStatistics = () => {
  const salesData = [
    { month: 'Jan', sales: 35, values: 28, products: 25 },
    { month: 'Feb', sales: 20, values: 18, products: 15 },
    { month: 'Mar', sales: 45, values: 38, products: 35 },
    { month: 'Apr', sales: 30, values: 25, products: 28 },
    { month: 'May', sales: 55, values: 48, products: 45 },
    { month: 'Jun', sales: 40, values: 35, products: 38 },
  ];
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Statistics</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="values" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="products" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default SalesStatistics
