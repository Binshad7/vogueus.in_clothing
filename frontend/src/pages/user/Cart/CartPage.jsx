import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Button, IconButton } from '@mui/material';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = ({ cartItems, removeFromCart, updateQuantity, applyCoupon, total, shipping }) => {
  total = 999;
  shipping = 99
  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );

  const handleQuantityChange = (itemId, operation) => {
    setQuantities((prevQuantities) => {
      const newQuantity = operation === 'increment' ? prevQuantities[itemId] + 1 : prevQuantities[itemId] - 1;
      return { ...prevQuantities, [itemId]: Math.max(newQuantity, 1) };
    });
    updateQuantity(itemId, operation);
  };

  return (
    <div className="flex flex-col items-center py-8">
      {cartItems.map((item) => (
        <Card key={item.id} className="w-full max-w-3xl mb-4">
          <CardHeader
            avatar={<img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />}
            title={item.name}
            subheader={`$${item.price}`}
          />
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <IconButton onClick={() => handleQuantityChange(item.id, 'decrement')} disabled={quantities[item.id] === 1}>
                  <Minus size={20} />
                </IconButton>
                <span className="mx-2">{quantities[item.id]}</span>
                <IconButton onClick={() => handleQuantityChange(item.id, 'increment')}>
                  <Plus size={20} />
                </IconButton>
              </div>
              <IconButton onClick={() => removeFromCart(item.id)}>
                <Trash2 size={20} />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="w-full max-w-3xl">
        <CardHeader title="Order Summary" />
        <CardContent>
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 font-bold">
            <span>Total:</span>
            <span>${(total + shipping).toFixed(2)}</span>
          </div>
          <div className="mb-4">
            <input type="text" placeholder="Enter coupon code" className="border rounded px-2 py-1 w-full" />
            <Button variant="contained" color="primary" className="mt-2 w-full" onClick={applyCoupon}>
              Apply Coupon
            </Button>
          </div>
          <Button variant="contained" color="primary" className="w-full">
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartPage;