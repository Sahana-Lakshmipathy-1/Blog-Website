import React from 'react';
import { Link } from 'react-router-dom';

const HomeSection = () => {
  return (
    <section className="relative bg-white py-20 px-6 md:px-12 text-center border-b border-gray-200">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          Share your stories. Read what others have to say. Be a part of the conversation.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/blogs"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition"
          >
            Browse Blogs
          </Link>
          <Link
            to="/create"
            className="border border-black text-black px-6 py-3 rounded-md hover:bg-gray-100 transition"
          >
            Write a Blog
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
