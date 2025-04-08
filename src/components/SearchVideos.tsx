'use client';

import React from 'react';

interface SearchVideosProps {
  query: string;
}

const SearchVideos: React.FC<SearchVideosProps> = ({ query }) => {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500">Video search is not available in this version.</p>
    </div>
  );
};

export default SearchVideos;
