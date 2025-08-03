import React from 'react';
import trendingItems from '../data/trending.json';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Trending = () => {
  return (
    <section className="bg-white text-black px-6 py-10 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">
          Trending Posts
        </h2>

        {/* Flex column on mobile, row on large screens */}
        <div className="flex flex-col lg:flex-row gap-4">
          {trendingItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer flex-1">
              <CardContent className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold px-2">{item.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {item.date}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trending;
