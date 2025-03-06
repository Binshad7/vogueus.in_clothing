import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Need Help",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Track Order", href: "/track" },
        { name: "Returns & Refunds", href: "/returns" },
        { name: "FAQ's", href: "/faq" },
        { name: "Career", href: "/career" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "euphoria Blog", href: "/blog" },
        { name: "euphorista™", href: "/euphorista" },
        { name: "Collaboration", href: "/collaboration" },
        { name: "Media", href: "/media" }
      ]
    },
    {
      title: "More Info",
      links: [
        { name: "Terms and Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Shipping Policy", href: "/shipping" },
        { name: "Sitemap", href: "/sitemap" }
      ]
    }
  ];

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "#", 
      label: "Facebook",
      color: "hover:text-blue-500"
    },
    { 
      icon: Instagram, 
      href: "#", 
      label: "Instagram",
      color: "hover:text-pink-500"
    },
    { 
      icon: Twitter, 
      href: "#", 
      label: "Twitter",
      color: "hover:text-blue-400"
    },
    { 
      icon: Linkedin, 
      href: "#", 
      label: "LinkedIn",
      color: "hover:text-blue-600"
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-lg mb-4 text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Location Section */}
          <div className="space-y-4 hidden lg:block">
            <h3 className="font-semibold text-lg mb-4 text-white">
              Location
            </h3>
            <address className="not-italic text-gray-400">
              123 Fashion Street,
              <br />
              Style City, Fashion State
              <br />
              Country - 123456
            </address>
            <p className="text-gray-400 mt-2">
              Email: support@vogeuos.com
              <br />
              Phone: +91 123 456 7890
            </p>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="border-t border-gray-800 pt-8">
          {/* Social Media Links */}
          <div className="flex justify-center space-x-6 mb-6">
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.href} 
                aria-label={social.label}
                className={`text-gray-400 ${social.color} transition-colors duration-300`}
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Copyright © {currentYear} Vogeuos. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;