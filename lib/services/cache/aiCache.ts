// lib/services/cache/aiCache.ts
import { LRUCache } from 'lru-cache';
import { logInfo, logDebug, logError } from '@/lib/utils/logger';

// Define types for our cache
export interface AICacheEntry {
  key: string;
  value: any;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

// Cache configuration
const CACHE_CONFIG = {
  max: 100, // Maximum number of items in cache
  ttl: 1000 * 60 * 60, // 1 hour default TTL
  updateAgeOnGet: true, // Reset age when item is accessed
};

// Create LRU cache instance
const aiCache = new LRUCache<string, AICacheEntry>({
  max: CACHE_CONFIG.max,
  ttl: CACHE_CONFIG.ttl,
  updateAgeOnGet: CACHE_CONFIG.updateAgeOnGet,
  dispose: (value, key) => {
    logDebug('Cache entry disposed', { key, value });
  },
});

/**
 * Generate a cache key for AI-generated content
 * @param type Type of AI content (summary, code, etc.)
 * @param input Input data used to generate the content
 * @returns Generated cache key
 */
export function generateAICacheKey(type: string, input: string): string {
  // Create a simple hash of the input to use as part of the key
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `${type}:${hash}`;
}

/**
 * Get cached AI-generated content
 * @param key Cache key
 * @returns Cached content or null if not found/expired
 */
export function getAICache(key: string): any | null {
  try {
    const entry = aiCache.get(key);
    
    if (entry) {
      logDebug('Cache hit', { key });
      return entry.value;
    }
    
    logDebug('Cache miss', { key });
    return null;
  } catch (error) {
    logError('Error retrieving from AI cache', error, { key });
    return null;
  }
}

/**
 * Set AI-generated content in cache
 * @param key Cache key
 * @param value Content to cache
 * @param ttl Time to live in milliseconds (optional)
 */
export function setAICache(key: string, value: any, ttl?: number): void {
  try {
    const entry: AICacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      ttl: ttl || CACHE_CONFIG.ttl,
    };
    
    aiCache.set(key, entry, { ttl: ttl || CACHE_CONFIG.ttl });
    logInfo('Content cached', { key, ttl: ttl || CACHE_CONFIG.ttl });
  } catch (error) {
    logError('Error setting AI cache', error, { key });
  }
}

/**
 * Delete cached AI-generated content
 * @param key Cache key
 */
export function deleteAICache(key: string): void {
  try {
    aiCache.delete(key);
    logInfo('Cache entry deleted', { key });
  } catch (error) {
    logError('Error deleting from AI cache', error, { key });
  }
}

/**
 * Clear all cached AI-generated content
 */
export function clearAICache(): void {
  try {
    const size = aiCache.size;
    aiCache.clear();
    logInfo('AI cache cleared', { entriesDeleted: size });
  } catch (error) {
    logError('Error clearing AI cache', error);
  }
}

/**
 * Get cache statistics
 * @returns Cache statistics
 */
export function getAICacheStats(): { size: number; max: number } {
  return {
    size: aiCache.size,
    max: aiCache.max,
  };
}

// Export the cache instance for direct access if needed
export { aiCache };