import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  User2,
  UserCog,
  Clock,
  MapPin
} from 'lucide-react';
import { fetchAllUsers, updateUserStatus } from '../../../store/middlewares/admin/usersAdminHandle';
import BloackProductModal from '../product/productList/BloackProductModal';

const UserManagement = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [typeBlock, setTypeBlock] = useState(null)

  const { Allusers, loading } = useSelector(state => state.AllUsersHandle);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleBlockToggle = async (user) => {
    setIsOpen(true);
    setUserId(user._id);
    setUserName(user.userName)
    let type = user?.isBlock ? 'Unblock ' : 'Block '
    setTypeBlock(type)
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setUserId(null);
    setUserName(null)
    setTypeBlock(null)
  }

  const handleConfirmBlock = () => {
    dispatch(updateUserStatus(userId))
    setIsOpen(false);
    setUserId(null);
    setUserName(null)
    setTypeBlock(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <BloackProductModal
        item={'user'}
        itemName={userName}
        typeUpdation={typeBlock}
        modalIsOpen={isOpen}
        closeModal={handleCloseModal}
        handleConfirmBlock={handleConfirmBlock}
      />
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage and monitor user accounts</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold text-blue-600">{Allusers?.length}</div>
            <div className="text-sm text-blue-500">Total Users</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="font-semibold text-green-600">
              {Allusers?.filter(user => !user?.isBlock).length}
            </div>
            <div className="text-sm text-green-500">Active Users</div>
          </div>
        </div>
      </div>

      {Allusers?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <UserCog className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Users Found</h3>
          <p className="mt-2 text-gray-500">There are no users registered in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Allusers?.map(user => (
            <div key={user?._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User2 className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user?.userName}</h3>
                      <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${user?.isVerified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {user?.isVerified ? 'Verified' : 'Unverified'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Joined {formatDate(user?.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Last updated {formatDate(user?.updatedAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {user?.address?.length} {user?.address?.length === 1 ? 'address' : 'addresses'} saved
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className={`flex items-center ${user?.isBlock ? 'text-red-500' : 'text-green-500'
                    }`}>
                    {user?.isBlock ? (
                      <Shield className="w-4 h-4 mr-1" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {user?.isBlock ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBlockToggle(user)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${user?.isBlock
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                  >
                    {user?.isBlock ? 'Unblock User' : 'Block User'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
