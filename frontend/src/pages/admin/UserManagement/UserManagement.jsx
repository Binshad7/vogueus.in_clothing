import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { ThreeDot } from 'react-loading-indicators';


const UserManagement = () => {
    const [users, setUsers] = useState([
        {
          _id: '67593f87a9b2d8bc0eacc9f2',
          username: 'JohnDoe',
          email: 'john@example.com',
          mobileNo: '1234567890',
          googleId: 'google123',
          status: true
        },
        // Add more sample users as needed
      ]);
      
      const handleBlockToggle = async(userId, status) => {

      console.log('user block');
      
      };
      useEffect(()=>{

       
      })
      return (
        <div className="w-full max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.mobileNo !== 'null' ? user.mobileNo : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.status ? "active" : "blocked"|| '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleBlockToggle(user._id, user.status)}
                          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                            user.status 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-gray-600 hover:bg-gray-700'
                          }`}
                        >
                          {user.status ? 'Block' : ' Unblock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!users.length && 
                    <tr className='absolute top-[50%] left-[50%]'>
                        Oops! no users try again later
                        <ThreeDot variant='bounce' size="small" color='rgb(129 187 150)'/>
                    </tr>
                    }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    
}

export default UserManagement
