import React from 'react';
import HeroImg from '../../assets/img/hero-img.png';

const HeroSection = () => {
  return (
    <div 
      className="relative flex items-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${HeroImg})`
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/30"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-24 z-10">
        <div className="max-w-2xl">
          {/* Category Tag */}
          <div className="inline-block">
            <h2 className="text-xl md:text-2xl text-white font-medium bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
              T-shirt / Tops
            </h2>
          </div>

          {/* Main Heading */}
          <h1 className="mt-6 text-5xl md:text-7xl font-bold text-white leading-tight">
            Summer
            <br />
            Value Pack
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-xl md:text-2xl text-white/90 tracking-wide">
            <span className="inline-block transform hover:scale-105 transition-transform duration-200">cool</span>
            {' / '}
            <span className="inline-block transform hover:scale-105 transition-transform duration-200">colorful</span>
            {' / '}
            <span className="inline-block transform hover:scale-105 transition-transform duration-200">comfy</span>
          </p>

          {/* CTA Button */}
          <button 
            className="mt-8 px-8 py-4 text-lg font-medium border-2 border-white bg-black/40 text-white 
                       hover:bg-white hover:text-black transition-all duration-300 ease-in-out
                       backdrop-blur-sm rounded-lg transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;