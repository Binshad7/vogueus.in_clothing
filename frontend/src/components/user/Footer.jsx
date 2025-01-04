import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Need Help Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Need Help</h3>
          <ul className="space-y-2">
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            <li><a href="/track" className="hover:text-white">Track Order</a></li>
            <li><a href="/returns" className="hover:text-white">Returns & Refunds</a></li>
            <li><a href="/faq" className="hover:text-white">FAQ's</a></li>
            <li><a href="/career" className="hover:text-white">Career</a></li>
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/blog" className="hover:text-white">euphoria Blog</a></li>
            <li><a href="/euphorista" className="hover:text-white">euphorista™</a></li>
            <li><a href="/collaboration" className="hover:text-white">Collaboration</a></li>
            <li><a href="/media" className="hover:text-white">Media</a></li>
          </ul>
        </div>

        {/* More Info Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4">More Info</h3>
          <ul className="space-y-2">
            <li><a href="/terms" className="hover:text-white">Term and Conditions</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/shipping" className="hover:text-white">Shipping Policy</a></li>
            <li><a href="/sitemap" className="hover:text-white">Sitemap</a></li>
          </ul>
        </div>

        {/* Location Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Location</h3>
          {/* Add location content here */}
        </div>

        {/* Social Media Links */}
        <div className="md:col-span-4 flex space-x-4 mt-8">
          <a href="#" className="hover:text-white">
            <Facebook size={24} />
          </a>
          <a href="#" className="hover:text-white">
            <Instagram size={24} />
          </a>
          <a href="#" className="hover:text-white">
            <Twitter size={24} />
          </a>
          <a href="#" className="hover:text-white">
            <Linkedin size={24} />
          </a>
        </div>

        {/* Copyright */}
        <div className="md:col-span-4 text-center mt-8">
          <p>Copyright © {new Date().getFullYear()} Vogeuos</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;