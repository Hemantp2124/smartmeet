// __tests__/services/cache/aiCache.test.ts
import { 
  generateAICacheKey, 
  getAICache, 
  setAICache, 
  deleteAICache, 
  clearAICache, 
  getAICacheStats 
} from '@/lib/services/cache/aiCache';

describe('AI Cache Service', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearAICache();
  });

  describe('generateAICacheKey', () => {
    it('should generate a consistent cache key', () => {
      const key1 = generateAICacheKey('summary', 'test transcript');
      const key2 = generateAICacheKey('summary', 'test transcript');
      
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different inputs', () => {
      const key1 = generateAICacheKey('summary', 'test transcript 1');
      const key2 = generateAICacheKey('summary', 'test transcript 2');
      
      expect(key1).not.toBe(key2);
    });
  });

  describe('setAICache and getAICache', () => {
    it('should store and retrieve values correctly', () => {
      const key = 'test-key';
      const value = { summary: 'Test summary' };
      
      setAICache(key, value);
      const retrieved = getAICache(key);
      
      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent keys', () => {
      const result = getAICache('non-existent-key');
      expect(result).toBeNull();
    });
  });

  describe('deleteAICache', () => {
    it('should delete existing cache entries', () => {
      const key = 'test-key';
      const value = { summary: 'Test summary' };
      
      setAICache(key, value);
      expect(getAICache(key)).toEqual(value);
      
      deleteAICache(key);
      expect(getAICache(key)).toBeNull();
    });
  });

  describe('clearAICache', () => {
    it('should clear all cache entries', () => {
      setAICache('key1', { data: 'value1' });
      setAICache('key2', { data: 'value2' });
      
      expect(getAICache('key1')).toEqual({ data: 'value1' });
      expect(getAICache('key2')).toEqual({ data: 'value2' });
      
      clearAICache();
      
      expect(getAICache('key1')).toBeNull();
      expect(getAICache('key2')).toBeNull();
    });
  });

  describe('getAICacheStats', () => {
    it('should return cache statistics', () => {
      const stats = getAICacheStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('max');
      expect(stats.size).toBe(0);
    });
  });
});