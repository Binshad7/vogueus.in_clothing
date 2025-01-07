import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import HeroSection from '../../../components/user/HeroSection'
import NewArrivals from '../../../components/Sections/NewArrivals'
import Category from '../../../components/Sections/Categories/Category'
import content from '../../../data/content.json';
import Footer from '../../../components/user/Footer'

const Home = () => {
  
  const {user} = useSelector((state)=>state.user)
 console.log(user,'user ind')
  return (
    <>
      <HeroSection />
      <NewArrivals />
      {
      content?.pages?.shop?.sections && content?.pages?.shop?.sections?.map((item, index) =>
         <Category key={item?.title+index} {...item} />
         )}
      <Footer />
    </>
  )
}

export default Home