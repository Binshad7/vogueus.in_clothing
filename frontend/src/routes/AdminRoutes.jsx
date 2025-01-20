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


function AdminRoutes() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<DashBboard />} />
        <Route path='/category' element={<Category />} />

        <Route path='/product' element={<ProductList />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/updateProduct/:productId' element={<EditProduct />} />

        <Route path='/orders' element={<DashBboard />} />
        <Route path='/allusers' element={<UserManagement />} />



      </Routes>
    </div>
  )
}

export default AdminRoutes
