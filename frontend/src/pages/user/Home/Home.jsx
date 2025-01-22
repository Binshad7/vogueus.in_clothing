import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import HeroSection from '../../../components/user/HeroSection'
import NewArrivals from '../../../components/Sections/NewArrivals'
import Category from '../../../components/Sections/Categories/Category'
import Spinner from '../../../components/user/Spinner'
import { fetchAllProducts } from '../../../store/middlewares/user/products_handle';
import Breadcrumb from '../../../components/user/Breadcrumb';
const Home = () => {
  const dispatch = useDispatch();
  const { loading, AllProducts } = useSelector(state => state.AllProductManageSlice);
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch])


  return (
    <>
      {loading && <Spinner />}
      <Breadcrumb/>
      <HeroSection />
      <NewArrivals AllProducts={AllProducts} />
      <Category title={'men'} AllProducts={AllProducts} />
      <Category title={'Women'} AllProducts={AllProducts} />
      <Category title={'Kids'} AllProducts={AllProducts} />
      {/* <Footer /> */}
    </>
  )
}

export default Home