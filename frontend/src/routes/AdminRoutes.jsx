import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DashBboard from '../pages/admin/Dashboard/DashBboard'
import Category from '../pages/admin/Category/Category'
// product
import AddProduct from '../pages/admin/product/AddProduct'
import EditProduct from '../pages/admin/product/EditProduct/EditProduct'
import ProductList from '../pages/admin/product/productList/ProductList'
// 
import UserManagement from '../pages/admin/UserManagement/UserManagement'
import OrderListingPage from '../pages/admin/orders/OrderListingPage'
import OrderDetails from '../pages/admin/orders/OrderDetailPage'
import StockManagement from '../pages/admin/stockManagemente/StockManagement'
import CouponManagement from '../pages/admin/couponsManagement/CouponManagement'
import ManageOffers from '../pages/admin/offer/ManageOffers'
import SalesReport from '../pages/admin/salesReport/SalesReport'


function AdminRoutes() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<DashBboard />} />
        <Route path='/category' element={<Category />} />

        <Route path='/product' element={<ProductList />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/updateProduct/:productId' element={<EditProduct />} />

        <Route path='/orders' element={<OrderListingPage />} />
        <Route path='/orders/detailspage/:orderId' element={<OrderDetails />} />
        <Route path='/allusers' element={<UserManagement />} />
        <Route path='/coupon' element={<CouponManagement />} />
        <Route path='/offer' element={<ManageOffers />} />
        <Route path='/salesreport' element={<SalesReport />} />
        <Route path='/stockmanagement' element={<StockManagement />} />



      </Routes>
    </div>
  )
}

export default AdminRoutes
