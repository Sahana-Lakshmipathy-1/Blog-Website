import React from 'react';

const Support = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Support Our Community</h1>
      <p className="text-gray-600 text-lg mb-6">
        Your support helps us keep creating content, building features, and maintaining an inclusive space for everyone to share their ideas.
      </p>
      <p className="text-gray-600 text-md mb-6">
        Whether it's through sharing our blog, providing feedback, or contributing financially, every bit counts.
      </p>
      <div className="flex justify-center gap-4 mt-8">
        <a
          href="#"
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Donate Now
        </a>
        <a
          href="#"
          className="bg-white text-black- border border-black px-6 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Share Blog
        </a>
      </div>
    </div>
  );
};

export default Support;
