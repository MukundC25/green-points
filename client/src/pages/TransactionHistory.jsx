import React, { useState, useEffect } from 'react';
import { pointsService } from '../services/pointsService';
import { History, Filter, Download, Coins, Calendar, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'credit', 'debit'
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, [filter, currentPage]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (filter !== 'all') {
        params.type = filter;
      }

      const response = await pointsService.getHistory(params);
      setTransactions(response.history);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? ArrowUpCircle : ArrowDownCircle;
  };

  const getTransactionColor = (type) => {
    return type === 'credit' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const exportTransactions = () => {
    // Simple CSV export
    const csvContent = [
      ['Date', 'Type', 'Source', 'Points', 'Item Type', 'Condition', 'Quantity'].join(','),
      ...transactions.map(transaction => [
        formatDate(transaction.timestamp),
        transaction.type,
        transaction.source,
        transaction.points,
        transaction.metadata?.itemType || '',
        transaction.metadata?.condition || '',
        transaction.metadata?.quantity || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'green-points-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction History</h1>
            <p className="text-gray-600">
              View all your Green Points transactions and track your environmental impact.
            </p>
          </div>
          <button
            onClick={exportTransactions}
            className="btn-outline flex items-center space-x-2"
            disabled={transactions.length === 0}
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All Transactions' },
              { value: 'credit', label: 'Points Earned' },
              { value: 'debit', label: 'Points Redeemed' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              {filter === 'all' ? 'All Transactions' : 
               filter === 'credit' ? 'Points Earned' : 'Points Redeemed'}
            </h2>
            {pagination.totalTransactions && (
              <span className="text-sm text-gray-500">
                ({pagination.totalTransactions} total)
              </span>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner mr-2"></div>
              <span className="text-gray-600">Loading transactions...</span>
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((transaction, index) => {
              const Icon = getTransactionIcon(transaction.type);
              const colorClass = getTransactionColor(transaction.type);
              
              return (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{transaction.source}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(transaction.timestamp)}</span>
                          </div>
                          {transaction.metadata?.itemType && (
                            <span className="badge badge-info">
                              {transaction.metadata.itemType}
                            </span>
                          )}
                          {transaction.metadata?.condition && (
                            <span className={`badge ${
                              transaction.metadata.condition === 'Working' ? 'badge-success' :
                              transaction.metadata.condition === 'Repairable' ? 'badge-warning' :
                              'badge-error'
                            }`}>
                              {transaction.metadata.condition}
                            </span>
                          )}
                          {transaction.metadata?.quantity && (
                            <span className="text-gray-400">
                              Qty: {transaction.metadata.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`flex items-center space-x-1 ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <Coins className="h-4 w-4" />
                        <span className="font-semibold text-lg">
                          {transaction.type === 'credit' ? '+' : ''}{transaction.points}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {transaction.type === 'credit' ? 'Earned' : 'Redeemed'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400 mt-1">
                {filter === 'all' 
                  ? 'Start by submitting your first e-waste item!'
                  : `No ${filter === 'credit' ? 'earned' : 'redeemed'} transactions yet.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
