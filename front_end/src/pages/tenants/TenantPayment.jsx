import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const TenantPayments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('make-payment');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock payment history data
  const mockPaymentHistory = [
    {
      id: 'PAY-001',
      amount: 1200,
      type: 'rent',
      status: 'completed',
      method: 'mpesa',
      date: '2024-04-01T10:30:00Z',
      reference: 'MPESA123456',
      description: 'April 2024 Rent',
      unit: '304'
    },
    {
      id: 'PAY-002',
      amount: 50,
      type: 'maintenance',
      status: 'completed',
      method: 'mpesa',
      date: '2024-03-15T14:20:00Z',
      reference: 'MPESA123457',
      description: 'Maintenance Fee',
      unit: '304'
    },
    {
      id: 'PAY-003',
      amount: 1200,
      type: 'rent',
      status: 'completed',
      method: 'card',
      date: '2024-03-01T09:15:00Z',
      reference: 'CARD789012',
      description: 'March 2024 Rent',
      unit: '304'
    },
    {
      id: 'PAY-004',
      amount: 1200,
      type: 'rent',
      status: 'failed',
      method: 'mpesa',
      date: '2024-02-28T16:45:00Z',
      reference: 'MPESA123458',
      description: 'February 2024 Rent',
      unit: '304'
    }
  ];

  // Tenant data
  const tenantData = {
    unitNumber: '304',
    propertyName: 'Sunset Apartments',
    rentAmount: 1200,
    nextPaymentDue: '2024-05-01',
    balance: 0,
    lastPaymentDate: '2024-04-01'
  };

  // Fetch payment history
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        // Simulate API call
        // const response = await fetch(`/api/payments/${user.id}`);
        // const data = await response.json();
        
        setPaymentHistory(mockPaymentHistory);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [user?.id]);

  // Handle rent payment
  const handleRentPayment = async () => {
    if (!paymentAmount || paymentAmount < 100) {
      alert('Please enter a valid payment amount (minimum $100)');
      return;
    }

    setIsProcessing(true);

    try {
      // Initiate payment via backend Daraja API integration
      const response = await fetch('/api/payments/initiate-rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          tenantId: user.id,
          unitNumber: tenantData.unitNumber,
          paymentMethod: paymentMethod,
          description: `Rent Payment - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
        })
      });
      
      if (response.ok) {
        const paymentData = await response.json();
        
        if (paymentMethod === 'mpesa') {
          // Show M-PESA STK push instructions
          alert(`Payment initiated! Check your phone for M-PESA STK push prompt to complete payment of $${paymentAmount}`);
          
          // Poll for payment status
          checkPaymentStatus(paymentData.transactionId);
        } else if (paymentMethod === 'card' && paymentData.checkoutUrl) {
          // Redirect to card payment gateway
          window.location.href = paymentData.checkoutUrl;
        } else {
          alert('Payment initiated successfully!');
        }
        
        // Reset form
        setPaymentAmount('');
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Error initiating payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Check payment status (for M-PESA)
  const checkPaymentStatus = async (transactionId) => {
    try {
      const response = await fetch(`/api/payments/status/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const statusData = await response.json();
        
        if (statusData.status === 'completed') {
          alert('Payment completed successfully!');
          // Refresh payment history
          setPaymentHistory([...mockPaymentHistory, {
            id: `PAY-${Date.now()}`,
            amount: parseFloat(paymentAmount),
            type: 'rent',
            status: 'completed',
            method: 'mpesa',
            date: new Date().toISOString(),
            reference: transactionId,
            description: `Rent Payment - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
            unit: tenantData.unitNumber
          }]);
        } else if (statusData.status === 'failed') {
          alert('Payment failed. Please try again.');
        } else {
          // Continue polling if still processing
          setTimeout(() => checkPaymentStatus(transactionId), 3000);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get method icon
  const getMethodIcon = (method) => {
    switch (method) {
      case 'mpesa': return '📱';
      case 'card': return '💳';
      case 'bank': return '🏦';
      default: return '💰';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Center</h1>
        <p className="text-gray-600">Manage your rent payments and view payment history</p>
      </div>

      {/* Payment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Next Rent Due</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(tenantData.rentAmount)}</h3>
            <span className="text-orange-600 text-sm font-medium bg-orange-50 px-2 py-1 rounded-full">
              Due {formatDate(tenantData.nextPaymentDue)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Unit {tenantData.unitNumber}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Account Balance</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-green-600">{formatCurrency(tenantData.balance)}</h3>
            <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
              Current
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Last paid {formatDate(tenantData.lastPaymentDate)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Paid This Year</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-blue-600">
              {formatCurrency(paymentHistory.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount, 0))}
            </h3>
            <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-full">
              {paymentHistory.filter(p => p.status === 'completed').length} payments
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">All on-time payments</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'make-payment', label: 'Make Payment' },
            { id: 'history', label: 'Payment History' },
            { id: 'scheduled', label: 'Scheduled Payments' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Make Payment Tab */}
      {activeTab === 'make-payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Make a Payment</h2>
            
            <div className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Amount *
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(tenantData.rentAmount.toString())}
                    className="p-3 border-2 border-blue-500 bg-blue-50 text-blue-700 rounded-lg font-medium text-center"
                  >
                    Full Rent
                    <div className="text-lg font-bold">{formatCurrency(tenantData.rentAmount)}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount((tenantData.rentAmount / 2).toString())}
                    className="p-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium text-center hover:border-gray-400"
                  >
                    Half Rent
                    <div className="text-lg font-bold">{formatCurrency(tenantData.rentAmount / 2)}</div>
                  </button>
                </div>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter custom amount"
                  min="100"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum payment: $100.00</p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-4 border-2 rounded-lg text-center ${
                      paymentMethod === 'mpesa'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">📱</div>
                    <div className="font-semibold">M-PESA</div>
                    <div className="text-xs opacity-75">Mobile Money</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg text-center ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <div className="font-semibold">Card</div>
                    <div className="text-xs opacity-75">Credit/Debit</div>
                  </button>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : '$0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium capitalize">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : '$0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleRentPayment}
                disabled={!paymentAmount || isProcessing}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ${paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : ''}`
                )}
              </button>

              {/* Security Notice */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🔒 Your payment is secure and encrypted
                </p>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Payment Instructions</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Rent is due on the 1st of each month</li>
                <li>• Late fees apply after 5-day grace period</li>
                <li>• M-PESA: Check your phone for STK push</li>
                <li>• Card: You'll be redirected to secure payment</li>
                <li>• Receipts are generated automatically</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
              <h3 className="font-semibold text-green-900 mb-3">📞 Need Help?</h3>
              <p className="text-sm text-green-800 mb-2">
                Contact our support team for payment assistance:
              </p>
              <p className="text-lg font-bold text-green-900">(555) 123-HELP</p>
              <p className="text-xs text-green-700 mt-1">support@propertymanager.com</p>
            </div>

            <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6">
              <h3 className="font-semibold text-orange-900 mb-3">⚠️ Important Notes</h3>
              <ul className="text-sm text-orange-800 space-y-2">
                <li>• Payments may take 1-2 business days to process</li>
                <li>• Keep your transaction reference for records</li>
                <li>• Contact support for failed transactions</li>
                <li>• Auto-pay available for recurring payments</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {paymentHistory.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">💳</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
                <p className="text-gray-600">Your payment history will appear here after making your first payment.</p>
              </div>
            ) : (
              paymentHistory.map((payment) => (
                <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getMethodIcon(payment.method)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(payment.date)} • {payment.reference}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {formatCurrency(payment.amount)}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                    <span className="capitalize">{payment.method} • {payment.type}</span>
                    <span>Unit {payment.unit}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Scheduled Payments Tab */}
      {activeTab === 'scheduled' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Scheduled Payments</h2>
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">⏰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled payments</h3>
            <p className="text-gray-600 mb-4">Set up auto-pay to never miss a rent payment.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Set Up Auto-Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantPayments;