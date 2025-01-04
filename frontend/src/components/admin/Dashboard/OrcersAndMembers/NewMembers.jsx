import React from 'react'

const NewMembers = () => {
    
    
      const newMembers = [
        { id: 1, name: 'John Smith', role: 'Sales Manager', img: '/api/placeholder/40/40' },
        { id: 2, name: 'Emma Wilson', role: 'Developer', img: '/api/placeholder/40/40' },
        { id: 3, name: 'Michael Brown', role: 'Designer', img: '/api/placeholder/40/40' },
      ];
  return (
    <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">New Members</h3>
        <div className="space-y-4">
        {newMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <img src={member.img} alt={member.name} className="h-10 w-10 rounded-full bg-gray-200" />
                <div>
                <p className="font-medium text-gray-800">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
                </div>
            </div>
            <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                + Add
            </button>
            </div>
        ))}
        </div>
    </Card>
  )
}

export default NewMembers
