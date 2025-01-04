import React from 'react'
import Card from '../Card/Card';

const NewOrders = () => {
    const latestOrders = [
        { id: '#12345', customer: 'John Doe', date: '2024-12-12', amount: '$150.00', status: 'Completed' },
        { id: '#12346', customer: 'Jane Smith', date: '2024-12-11', status: 'Pending', amount: '$250.00' },
        { id: '#12347', customer: 'Bob Johnson', date: '2024-12-10', status: 'Processing', amount: '$350.00' },
      ];

  return (
    <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Orders</h3>
        <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
            <tr className="text-left text-sm text-gray-600">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
            </tr>
            </thead>
            <tbody className="text-sm">
            {latestOrders.map((order) => (
                <tr key={order.id} className="border-t">
                <td className="py-3 text-blue-600">{order.id}</td>
                <td className="py-3 text-gray-800">{order.customer}</td>
                <td className="py-3 text-gray-600">{order.date}</td>
                <td className="py-3 text-gray-800">{order.amount}</td>
                <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                    }`}>
                    {order.status}
                    </span>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </Card>
  )
}

export default NewOrders
