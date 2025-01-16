import React, { useEffect } from 'react'
import SectionHeading from '../SectionsHeading/SectionHeading'
import ProductCard from '../../user/ProductCard'
import { fetchAllProducts } from '../../../store/middlewares/user/products_handle';
import { useDispatch, useSelector } from 'react-redux';

const Category = () => {
  const dispatch = useDispatch();
  const { AllProducts } = useSelector(state => state.AllProductManageSlice);
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch])
  return (
    <div >
      <SectionHeading title={'category'}/>
      <div className='flex items-center px-8 flex-wrap'>
      {AllProducts.map((product) => (
          <div key={product._id} className="flex-none snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(Category)