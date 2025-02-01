import React, { useState, useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import { Trash2, Plus, Minus, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../../components/user/Spinner';
import { useNavigate } from 'react-router-dom'
import { GetCart, removeItemFromCart, handleQuantityChange } from '../../../store/middlewares/user/cart';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate()
  const { cart, loading } = useSelector((state) => state.Cart);
  const [cartItems, setCartItems] = useState([])
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    itemId: null,
    productName: ''
  });
  const dispatch = useDispatch();
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0
  });

  useEffect(() => {
    dispatch(GetCart());
  }, [dispatch]);

  const calculateOrderSummary = () => {
    let subtotal = 0;
    let shipping = 0;

    cart.forEach((item) => {
      const price =
        item.productDetails.currentPrice > 0
          ? item.productDetails.currentPrice
          : item.productDetails.regularPrice;

      subtotal += price * item.itemDetails.quantity;
      shipping += price > 500 ? 0 : 5;
    });

    setOrderSummary({
      subtotal,
      shipping,
      total: subtotal + shipping
    });
  };

  useEffect(() => {
    if (!cart || cart.length === 0) return;
    setCartItems(cart)
    calculateOrderSummary();
  }, [cart]);

  const handleQuantity = (item, operation) => {
    if (operation == 'increment') {
      if (item?.itemDetails?.quantity + 1 > 5) {
        toast.error('Maximum Quantity is  5 ');
        return
      }
      if (item?.itemDetails?.quantity + 1 > item?.productDetails?.stock) {
        console.log(item?.itemDetails?.quantity + 1, item?.productDetails?.stock)
        toast.error('Stock is not Enough');
        return
      }
      dispatch(handleQuantityChange({ cartId: item?.itemDetails?.cartItemsId, operation, quantity: item?.itemDetails?.quantity }))
    }
    if (operation == 'decrement') {
      if (item?.itemDetails?.quantity - 1 < 1) {
        toast.error('Quantity is  must be greter then 0');
        return
      }
      dispatch(handleQuantityChange({ cartId: item?.itemDetails?.cartItemsId, operation, quantity: item?.itemDetails?.quantity }))
    }
  };

  const deleteModalOpen = (cartId, productName) => {
    setDeleteModalState({
      isOpen: true,
      itemId: cartId,
      productName: productName
    });
  };

  const deleteModalClose = () => {
    setDeleteModalState({
      isOpen: false,
      itemId: null,
      productName: ''
    });
  };

  const removeFromCart = () => {
    dispatch(removeItemFromCart(deleteModalState.itemId));
    deleteModalClose();
  };


  const checkout = () => {
    let outofStcokProducts = cartItems.filter((item) => item?.productDetails?.stock == 0);
    if (outofStcokProducts.length !== 0) {
      return toast.error(`${outofStcokProducts.length} Product is OutOffStock`)
    }
    navigate('/checkout')
    console.log('cartItems :', cartItems)
    console.log('order Summary :', orderSummary)
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {loading && <Spinner />}

      {/* Delete Confirmation Modal */}
      {deleteModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={deleteModalClose}></div>
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="absolute top-4 right-4">
              <button
                onClick={deleteModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold">Remove Item from Cart</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to remove "{deleteModalState.productName}" from your cart?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={deleteModalClose}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={removeFromCart}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
      )}

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
              {cartItems?.map((item) => (
                <tr key={item?.itemDetails?.cartItemsId} className="border-b">
                  <td className="py-4 flex items-center gap-4"
                    onClick={() => navigate(`/product/${item.productDetails.productId}`)}
                  >
                    <img
                      src={item?.productDetails?.image}
                      alt={item?.productDetails?.productName}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{item?.productDetails?.productName}</h3>
                      <p className="text-sm text-gray-500">Size: {item?.itemDetails?.size}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    ₹
                    {(item.productDetails.currentPrice > 0
                      ? item.productDetails.currentPrice
                      : item.productDetails.regularPrice
                    ).toFixed(2)}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      {
                        item?.productDetails?.stock == 0 ?
                          <p className='text-red-700 text-lg'> Out Off Stock </p>
                          : (
                            <>
                              <IconButton
                                onClick={() => handleQuantity(item, 'decrement')}
                                disabled={item?.itemDetails?.quantity === 1}
                              >
                                <Minus size={20} />
                              </IconButton>
                              <span className="mx-2 font-medium">{item?.itemDetails?.quantity}</span>
                              <IconButton
                                onClick={() => handleQuantity(item, 'increment')}
                                disabled={item?.itemDetails?.quantity === item?.productDetails?.stock}
                                className={item?.itemDetails?.quantity === item?.productDetails?.stock ? 'cursor-not-allowed' : ''}
                              >
                                <Plus size={20} />
                              </IconButton>
                            </>
                          )
                      }
                    </div>
                  </td>
                  <td className="py-4 text-green-500">FREE</td>
                  <td className="py-4 font-medium">
                    ₹
                    {(
                      (item.productDetails.currentPrice > 0
                        ? item.productDetails.currentPrice
                        : item.productDetails.regularPrice) * item.itemDetails.quantity
                    ).toFixed(2)}
                  </td>
                  <td className="py-4">
                    <IconButton
                      onClick={() => deleteModalOpen(
                        item?.itemDetails?.cartItemsId,
                        item?.productDetails?.productName
                      )}
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col lg:flex-row gap-8 mt-8">

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
                onClick={() => checkout()}
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