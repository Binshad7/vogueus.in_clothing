import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import HeroSection from '../../../components/user/HeroSection'
import NewArrivals from '../../../components/Sections/NewArrivals'
import Category from '../../../components/Sections/Categories/Category'
import Footer from '../../../components/user/Footer'
import Spinner from '../../../components/user/Spinner'
import { fetchAllProducts } from '../../../store/middlewares/user/products_handle';
const Home = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.AllProductManageSlice);
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch])

 
  return (
    <>
    {loading && <Spinner/>}
      <HeroSection />
      <NewArrivals />
      <Category />
      <Footer />
    </>
  )
}

export default Home