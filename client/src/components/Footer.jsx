import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 px-6 py-8 mt-16 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-semibold text-black">My Blog</h2>
          <p className="mt-2 text-sm">
            Sharing thoughts, tutorials, and community stories. Join us in exploring the world of ideas.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-medium mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/blog" className="hover:underline">Blogs</Link></li>
            <li><Link to="/support" className="hover:underline">Support</Link></li>
            <li><Link to="/newsletter" className="hover:underline">Newsletter</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-medium mb-2">Connect</h3>
          <div className="flex gap-4 text-xl text-gray-500">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-blue-400" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="hover:text-gray-800" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="hover:text-blue-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center mt-10 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} My Blog. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
