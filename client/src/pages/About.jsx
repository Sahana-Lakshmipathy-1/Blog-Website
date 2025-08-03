import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">About Our Blog</h1>

      <p className="text-lg text-gray-600 leading-relaxed mb-6">
        Welcome to <span className="font-semibold text-black">My Blog</span> — your digital space for creativity, ideas, and community stories.
        Whether you're here to read, write, or share, we're thrilled to have you on this journey.
      </p>

      <div className="space-y-4">
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2"> Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We aim to empower individuals to express themselves freely and connect with readers across the globe.
            Blogging is more than just words — it’s a movement of voices, perspectives, and shared experiences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2"> What You Can Do</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Write and publish your own blog posts</li>
            <li>Explore inspiring stories from other writers</li>
            <li>Comment, react, and engage with the community</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2"> Built With</h2>
          <p className="text-gray-600">
            This project is crafted with <span className="font-medium">React</span>, <span className="font-medium">Tailwind CSS</span>, and love.
          </p>
        </section>
      </div>

      <div className="text-center mt-10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} My Blog. All rights reserved.
      </div>
    </div>
  );
};

export default About;
