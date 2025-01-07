import React from 'react'
import SectionHeading from '../SectionsHeading/SectionHeading'
import Card from '../../user/Card'

const Category = ({title,data}) => {
  
  return (
    <div key={title}>
    <SectionHeading key={title} title={title}/>
    <div className='flex items-center px-8 flex-wrap'>
    {data && data?.map((item,index)=>{
        return (
          <>
           <Card key={item.id} title={item?.title} description={item?.description} imagePath={item?.image}
            actionArrow={true} height={'240px'} width={'200px'}/>
          </>
        )
    })}
    </div>
    </div>
  )
}

export default Category