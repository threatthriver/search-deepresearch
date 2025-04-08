'use client';

import { Search, Filter, RefreshCw, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import SkeletonLoader from '@/components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';

interface Discover {
  title: string;
  content: string;
  url: string;
  thumbnail: string;
  category?: string;
  publishedDate?: string;
  source?: string;
}

type SortOption = 'relevance' | 'date' | 'popularity';
type CategoryFilter = 'all' | 'technology' | 'ai' | 'science' | 'business';

const categoryMap: Record<string, CategoryFilter> = {
  'yahoo.com': 'business',
  'businessinsider.com': 'business',
  'www.exchangewire.com': 'technology',
  'wired.com': 'technology',
  'theverge.com': 'technology',
  'mashable.com': 'technology',
  'venturebeat.com': 'technology',
  'cnet.com': 'technology',
  'gizmodo.com': 'technology',
};

const Page = () => {
  const [discover, setDiscover] = useState<Discover[] | null>(null);
  const [allItems, setAllItems] = useState<Discover[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Discover[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const observer = useRef<IntersectionObserver | null>(null);
  const ITEMS_PER_PAGE = 9;

  // Load saved items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedDiscoverItems');
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  // Save items to localStorage when changed
  useEffect(() => {
    localStorage.setItem('savedDiscoverItems', JSON.stringify(savedItems));
  }, [savedItems]);

  const fetchData = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      }

      const res = await fetch(`/api/discover`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // Filter out items without thumbnails
      const filteredData = data.blogs.filter((blog: Discover) => blog.thumbnail);

      // Add category and source information
      const enhancedData = filteredData.map((item: Discover) => {
        try {
          const urlObj = new URL(item.url);
          const hostname = urlObj.hostname;
          return {
            ...item,
            category: categoryMap[hostname] || 'technology',
            source: hostname,
            publishedDate: new Date().toISOString(), // Placeholder since API doesn't provide dates
          };
        } catch (e) {
          return {
            ...item,
            category: 'technology',
            publishedDate: new Date().toISOString(),
          };
        }
      });

      setDiscover(enhancedData);
      setAllItems(enhancedData);

      // Initialize with first page of items
      setDisplayedItems(enhancedData.slice(0, ITEMS_PER_PAGE));
      setHasMore(enhancedData.length > ITEMS_PER_PAGE);
      setPage(1);

      if (refresh) {
        toast.success('Content refreshed!');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err.message);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort items when filters change
  useEffect(() => {
    if (!allItems.length) return;

    let filtered = [...allItems];

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => item.title.toLowerCase().includes(query) ||
               item.content.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'date':
        filtered.sort((a, b) => {
          return new Date(b.publishedDate || '').getTime() -
                 new Date(a.publishedDate || '').getTime();
        });
        break;
      case 'popularity':
        // Randomize for demo purposes
        filtered.sort(() => Math.random() - 0.5);
        break;
      case 'relevance':
      default:
        // Keep original order
        break;
    }

    setAllItems(filtered);
    setDisplayedItems(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
    setPage(1);
  }, [categoryFilter, sortOption, searchQuery, allItems, ITEMS_PER_PAGE]);

  // Define loadMoreItems function before using it in useCallback
  const loadMoreItems = useCallback(() => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const newItems = allItems.slice(startIndex, endIndex);
    setDisplayedItems(prev => [...prev, ...newItems]);
    setPage(nextPage);
    setHasMore(endIndex < allItems.length);
  }, [hasMore, loading, page, ITEMS_PER_PAGE, allItems]);

  // Infinite scrolling logic
  const lastItemRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreItems();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreItems]);

  const handleRefresh = () => {
    fetchData(true);
  };

  const toggleSaveItem = (url: string) => {
    if (savedItems.includes(url)) {
      setSavedItems(savedItems.filter(item => item !== url));
      toast.success('Removed from saved items');
    } else {
      setSavedItems([...savedItems, url]);
      toast.success('Added to saved items');
    }
  };

  const handleShare = (item: Discover) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.content,
        url: item.url
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fallback
        navigator.clipboard.writeText(item.url);
        toast.success('Link copied to clipboard!');
      });
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(item.url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex flex-col space-y-6 pt-4">
          <div className="flex items-center">
            <Search />
            <h1 className="text-3xl font-medium p-2">Discover</h1>
          </div>
          <hr className="border-t border-[#2B2C2C] my-4 w-full" />

          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 pb-28 lg:pb-8 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="max-w-sm rounded-lg overflow-hidden bg-light-secondary dark:bg-dark-secondary">
                <SkeletonLoader type="image" />
                <div className="px-6 py-4 space-y-3">
                  <SkeletonLoader type="text" className="h-6" />
                  <SkeletonLoader type="text" />
                  <SkeletonLoader type="text" className="w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Search />
                <h1 className="text-3xl font-medium p-2">Discover</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Refresh content"
                >
                  <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${showFilters ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  aria-label="Show filters"
                >
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="py-4 space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Search</label>
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-gray-300 dark:border-gray-700"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {['all', 'technology', 'ai', 'business', 'science'].map((category) => (
                          <button
                            key={category}
                            onClick={() => setCategoryFilter(category as CategoryFilter)}
                            className={`px-3 py-1 rounded-full text-sm ${categoryFilter === category ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Sort by</label>
                      <div className="flex flex-wrap gap-2">
                        {['relevance', 'date', 'popularity'].map((sort) => (
                          <button
                            key={sort}
                            onClick={() => setSortOption(sort as SortOption)}
                            className={`px-3 py-1 rounded-full text-sm ${sortOption === sort ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                          >
                            {sort.charAt(0).toUpperCase() + sort.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <hr className="border-t border-[#2B2C2C] my-4 w-full" />

            {displayedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium mb-4">No results found</p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setSortOption('relevance');
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 pb-28 lg:pb-8 w-full justify-items-center lg:justify-items-start">
                {displayedItems.map((item, i) => {
                  const isLastItem = i === displayedItems.length - 1;
                  const isSaved = savedItems.includes(item.url);

                  return (
                    <motion.div
                      key={item.url + i}
                      ref={isLastItem ? lastItemRef : null}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i % 3 * 0.1 }}
                      className="max-w-sm w-full rounded-lg overflow-hidden bg-light-secondary dark:bg-dark-secondary hover:-translate-y-[2px] transition duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="relative group">
                        <Image
                          className="object-cover w-full aspect-video"
                          src={
                            new URL(item.thumbnail).origin +
                            new URL(item.thumbnail).pathname +
                            `?id=${new URL(item.thumbnail).searchParams.get('id')}`
                          }
                          alt={item.title}
                          width={400}
                          height={225}
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSaveItem(item.url);
                            }}
                            className={`p-1.5 rounded-full ${isSaved ? 'bg-blue-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'} transition-colors`}
                            aria-label={isSaved ? 'Unsave article' : 'Save article'}
                          >
                            <Bookmark size={16} className={isSaved ? 'fill-white' : ''} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleShare(item);
                            }}
                            className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                            aria-label="Share article"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                        {item.category && (
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-black/50 text-white">
                              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="px-6 py-4">
                        <Link
                          href={`/?q=Summary: ${item.url}`}
                          className="font-bold text-lg mb-2 hover:text-blue-500 transition-colors block"
                        >
                          {item.title.length > 80 ? `${item.title.slice(0, 80)}...` : item.title}
                        </Link>
                        <p className="text-black-70 dark:text-white/70 text-sm mb-3">
                          {item.content.length > 120 ? `${item.content.slice(0, 120)}...` : item.content}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-gray-500">
                            {item.source && `From ${item.source.replace('www.', '')}`}
                          </span>
                          <Link
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-500 hover:text-blue-600 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="mr-1">Visit</span>
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
