import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, History, Search, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getWallete } from '../../../store/middlewares/user/wallete';
import { useNavigate } from 'react-router-dom';

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  
  // Calculate page range to display (show at most 5 page numbers)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center mt-6 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 mx-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 mx-1 rounded-md border border-gray-300"
          >
            1
          </button>
          {startPage > 2 && <span className="mx-1">...</span>}
        </>
      )}
      
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 mx-1 rounded-md ${
            currentPage === number
              ? "bg-blue-600 text-white"
              : "border border-gray-300"
          }`}
        >
          {number}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="mx-1">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 mx-1 rounded-md border border-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 mx-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const WalletPage = () => {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux
  const { user } = useSelector((state) => state.user);
  const { userWallete, loading } = useSelector(state => state.userWalleteDetails);

  useEffect(() => {
    if (!user) {
      return navigate('/');
    }
    dispatch(getWallete(user._id));
  }, [user, dispatch, navigate]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter transactions
  const filteredTransactions = userWallete?.transactions?.filter(transaction => {
    const matchesSearch = transaction.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  }) || [];
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Quick Action Button component
  const QuickActionButton = ({ icon, label, onClick, bgColor }) => (
    <button
      onClick={onClick}
      className={`${bgColor} text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-transform hover:scale-105`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  // Add Money Modal
  const AddMoneyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-2xl overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Add Money to Wallet</h3>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="0.00"
                min="1"
              />
            </div>
          </div>
          <div className="flex gap-3">
            {[100, 500, 1000, 2000].map((amount) => (
              <button
                key={amount}
                onClick={() => setAddAmount(amount.toString())}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowAddMoneyModal(false);
              setAddAmount('');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // TODO: Implement handleAddMoney functionality
              setShowAddMoneyModal(false);
              setAddAmount('');
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading wallet details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-medium opacity-90">Total Balance</h2>
            <div className="text-4xl font-bold mt-2">₹{userWallete?.balance?.toFixed(2) || '0.00'}</div>
          </div>
          <button
            onClick={() => setShowAddMoneyModal(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            Add Money
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <QuickActionButton
          icon={<ArrowUpRight className="w-6 h-6" />}
          label="Send Money"
          onClick={() => { }}
          bgColor="bg-purple-600"
        />
        {/* <QuickActionButton
          icon={<ArrowDownLeft className="w-6 h-6" />}
          label="Request Money"
          onClick={() => { }}
          bgColor="bg-green-600"
        /> */}
        <QuickActionButton
          icon={<History className="w-6 h-6" />}
          label="Transaction History"
          onClick={() => { }}
          bgColor="bg-orange-600"
        />
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Transaction History</h2>

          {/* Filters */}
          <div className="mt-4 flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
              <option value="refund">Refunds</option>
            </select>
          </div>
        </div>

        <div className="divide-y">
          {currentTransactions.length > 0 ? (
            currentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${transaction.type === 'credit' || transaction.type === 'refund'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                    }`}>
                    {transaction.type === 'credit' || transaction.type === 'refund' ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${transaction.type === 'credit' || transaction.type === 'refund'
                    ? 'text-green-600'
                    : 'text-red-600'
                  }`}>
                  {transaction.type === 'credit' || transaction.type === 'refund' ? '+' : '-'}₹
                  {transaction.amount.toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          )}
        </div>
        
        {/* Pagination controls */}
        {filteredTransactions.length > 0 && (
          <>
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
            
            {/* Display page info */}
            <div className="text-center text-sm text-gray-500 pb-4">
              Showing {indexOfFirstTransaction + 1}-{Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
          </>
        )}
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && <AddMoneyModal />}
    </div>
  );
};

export default WalletPage;