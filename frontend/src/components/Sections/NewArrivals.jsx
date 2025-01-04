import React from 'react';
import SectionHeading from './SectionsHeading/SectionHeading';
import Card from '../user/Card';
import Jeans from '../../assets/img/jeans.jpg';
import Shirts from '../../assets/img/shirts.jpg';
import Tshirt from '../../assets/img/tshirts.jpeg';
import Dresses from '../../assets/img/dresses.jpg';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'; // Ensure carousel styles are loaded
import { responsive } from '../../utils/Section.constants';
import './NewArrivals.css';

const items = [
  { title: 'Jeans', imagePath: Jeans },
  { title: 'Shirts', imagePath: Shirts },
  { title: 'T-Shirts', imagePath: Tshirt },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'T-Shirts', imagePath: Tshirt },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'T-Shirts', imagePath: Tshirt },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'T-Shirts', imagePath: Tshirt },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'T-Shirts', imagePath: Tshirt },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'T-Shirts', imagePath: Tshirt },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'T-Shirts', imagePath: Tshirt },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'T-Shirts', imagePath: Tshirt },
  { title: 'Dresses', imagePath: Dresses },
  { title: 'Dresses', imagePath: Dresses },
];

const NewArrivals = () => {
  return (
    <>
      <SectionHeading title="New Arrivals" />
      <Carousel
        responsive={responsive}
        autoPlay={false}
        swipeable={true}
        draggable={true} // Enable dragging for better UX
        showDots={false} // Optional: Show dots for navigation
        infinite={false} // Loop through items
        partialVisible={false}
        itemClass="react-slider-custom-item"
        containerClass="carousel-container" // Optional
      >
         
        {items.map((item, index) => (
          <Card key={`${item.title}-${index}`} title={item.title} imagePath={item.imagePath} />
        ))}
      </Carousel>
    </>
  );
};

export default NewArrivals;
