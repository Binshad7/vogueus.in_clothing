import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'react-toastify';
const PaymentSelection = ({ selectedPayment, onPaymentSelect, handleOrderConfirm }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
        {
            id: 'razorpay',
            name: 'Razorpay',
            description: 'Pay securely with credit/debit card or UPI',
            icon: '💳'
        },
        {
            id: 'wallet',
            name: 'Wallet',
            description: 'Pay using your digital wallet balance',
            icon: '👝'
        },
        {
            id: 'cod',
            name: 'Cash on Delivery',
            description: 'Pay when you receive your order',
            icon: '💵'
        }
    ];

    const handlePayment = (e) => {
        e.preventDefault();
        if (!selectedMethod) {
            toast.error('Please select a payment method');
            return;
        }
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            toast.error(`Processing payment with ${selectedPayment}`);
        }, 1500);
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Select Payment Method</h2>
            </div>

            <form onSubmit={handlePayment} className="p-4">
                <div className="space-y-3">
                    {paymentMethods.map((method) => (
                        <label
                            key={method.id}
                            className={`block relative border rounded-lg cursor-pointer transition-all
                ${selectedPayment === method.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center p-4">
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method.id}
                                    checked={selectedPayment === method.id}
                                    onChange={(e) => onPaymentSelect(e.target.value)}
                                    className="hidden"
                                />
                                <div className="flex items-center flex-1">
                                    <div className="flex items-center justify-center w-10 h-10 mr-3 text-xl">
                                        {method.icon}
                                    </div>  
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{method.name}</p>
                                        <p className="text-sm text-gray-500">{method.description}</p>
                                    </div>
                                    {selectedPayment === method.id && (
                                        <Check className="w-5 h-5 text-blue-500 ml-2" />
                                    )}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Payment Button */}
                <div className="mt-6">
                    <button
                        onClick={handleOrderConfirm}
                        type="submit"
                        disabled={isProcessing || !selectedPayment}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
              ${isProcessing || !selectedPayment
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            `Pay ${selectedPayment === 'cod' ? 'on Delivery' : 'Now'}`
                        )}
                    </button>
                </div>
            </form>

            {/* Security Notice */}
            <div className="p-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                    Your payment information is secure and encrypted
                </p>
            </div>
        </div>
    );
};

export default PaymentSelection;