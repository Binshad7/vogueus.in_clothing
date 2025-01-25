import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Button, IconButton } from '@mui/material';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../../components/user/Spinner';
import { GetCart, removeItemFromCart } from '../../../store/middlewares/user/cart';

const CartPage = () => {
  const { cart, loading } = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0
  });

  useEffect(() => {
    if (!cart) {
      dispatch(GetCart());
    }
  }, [cart, dispatch]);


  const [quantities, setQuantities] = useState({})
  useEffect(() => {
    const newQuantities = cart?.reduce((acc, item) => ({ ...acc, [item.itemDetails.size]: item.itemDetails.quantity }), {});
    setQuantities(newQuantities);
  }, [cart]);


  useEffect(() => {
    const subtotal = cart?.reduce((sum, item) => sum + (item.productDetails.currentPrice * quantities[item.itemDetails.size] || 0), 0);
    const shipping = subtotal > 100 ? 0 : 5.00;
    const total = subtotal + shipping;

    setOrderSummary({
      subtotal: subtotal,
      shipping: shipping,
      total: total
    });
  }, [cart, quantities]);

  const handleQuantityChange = (item, operation) => {
    const updatedQuantities = { ...quantities };
    if (operation === 'increment') {
      updatedQuantities[item.itemDetails.size] = updatedQuantities[item.itemDetails.size] + 1;
    } else if (operation === 'decrement' && updatedQuantities[item.itemDetails.size] > 1) {
      updatedQuantities[item.itemDetails.size] = updatedQuantities[item.itemDetails.size] - 1;
    }
    setQuantities(updatedQuantities);
  };


  const removeFromCart = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const applyCoupon = () => {
    console.log('Coupon applied');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {loading && <Spinner />}
      {cart?.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart.</p>
          <Button variant="contained" color="primary" href="/">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-4">Product Details</th>
                <th className="py-4">Price</th>
                <th className="py-4">Quantity</th>
                <th className="py-4">Shipping</th>
                <th className="py-4">Subtotal</th>
                <th className="py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart?.map((item, i) => (
                <tr key={item.productDetails.productId + i} className="border-b">
                  <td className="py-4 flex items-center gap-4">
                    <img
                      src={item.productDetails.image}
                      alt={item.productDetails.productName}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{item.productDetails.productName}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.itemDetails.size}
                      </p>
                    </div>
                  </td>
                  <td className="py-4">₹{item.productDetails.currentPrice.toFixed(2)}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <IconButton
                        onClick={() => handleQuantityChange(item, 'decrement')}
                        disabled={quantities[item.itemDetails.size] === 1}
                      >
                        <Minus size={20} />
                      </IconButton>
                      <span className="mx-2 font-medium">{quantities[item.itemDetails.size]}</span>
                      <IconButton
                        onClick={() => handleQuantityChange(item, 'increment')}
                      >
                        <Plus size={20} />
                      </IconButton>
                    </div>
                  </td>
                  <td className="py-4 text-green-500">
                    {item.productDetails.currentPrice > 100 ? 'FREE' : `₹${orderSummary.shipping.toFixed(2)}`}
                  </td>
                  <td className="py-4 font-medium">
                    ₹{((item.productDetails.currentPrice * quantities[item.itemDetails.size]) + (item.productDetails.currentPrice > 100 ? 0 : orderSummary.shipping)).toFixed(2)}
                  </td>
                  <td className="py-4">
                    <IconButton onClick={() => removeFromCart(item.itemDetails.cartItemsId)}>
                      <Trash2 size={20} className="text-red-500" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-4">Discount Codes</h3>
              <input
                type="text"
                placeholder="Enter your coupon code if you have one"
                className="w-full border px-4 py-2 rounded mb-4"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={applyCoupon}
                className="w-full"
              >
                Apply Coupon
              </Button>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Sub Total:</span>
                <span>₹{orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>₹{orderSummary.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span>₹{orderSummary.total.toFixed(2)}</span>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="w-full mt-4 bg-black"
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;