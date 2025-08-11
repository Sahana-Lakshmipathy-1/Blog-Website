import React from 'react'
import CountUp from 'react-countup';

const stats = [
  { label: 'Users', value: 1000 },
  { label: 'Blogs', value: 100 },
  { label: 'Topics', value: 10 },
];

const Stats = () => {
  return (
    <section className="bg-white text-black px-6 py-10 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Overall Statistics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-4xl font-bold text-gray-900">
                <CountUp end={stat.value} duration={3.5} />+
              </h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
