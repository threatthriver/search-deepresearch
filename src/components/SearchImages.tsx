'use client';

import React from 'react';

interface SearchImagesProps {
  query: string;
}

const SearchImages: React.FC<SearchImagesProps> = ({ query }) => {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500">Image search is not available in this version.</p>
    </div>
  );
};

export default SearchImages;
