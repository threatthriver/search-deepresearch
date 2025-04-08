/**
 * A simple in-memory cache for documents to improve performance
 */
class DocumentCache {
  private cache: Map<string, any>;
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds

  constructor(maxSize = 100, ttlMinutes = 30) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttlMinutes * 60 * 1000;
  }

  /**
   * Get a document from the cache
   * @param key The cache key
   * @returns The cached document or undefined if not found
   */
  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return undefined;

    // Check if the item has expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Set a document in the cache
   * @param key The cache key
   * @param value The document to cache
   */
  set(key: string, value: any): void {
    // If cache is full, remove the oldest item
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    // Set the new item with expiry time
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl,
    });
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the current size of the cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Create a singleton instance
const documentCache = new DocumentCache();

export default documentCache;
