import { useState, useEffect, useCallback, useRef } from 'react';

// Simple global cache for GET requests to prevent the initial burst
const apiCache = new Map();

/**
 * Generic hook for API calls
 * @param {Function} apiFunc - The async service function to call
 * @param {Array} params - Parameters for the service function
 * @param {Object} options - Options (immediate: bool, initialData: any, cacheKey: string)
 */
export const useApi = (apiFunc, params = [], options = {}) => {
  const { immediate = true, initialData = null, useCache = true } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const paramsString = JSON.stringify(params);
  const cacheKey = useCache ? `${apiFunc.name}_${paramsString}` : null;

  const execute = useCallback(async (...args) => {
    // If using cache and we have data, use it but still optionally refetch in background
    if (cacheKey && apiCache.has(cacheKey) && !args.length) {
      const cached = apiCache.get(cacheKey);
      if (cached.status === 'success') {
        setData(cached.data);
        setLoading(false);
        // Only skip if data is fresh (less than 1s old)
        if (Date.now() - cached.timestamp < 1000) return cached.data;
      }
    }

    try {
      if (!mountedRef.current) return;
      setLoading(true);
      setError(null);
      
      const funcParams = args.length > 0 ? args : params;
      const result = await apiFunc(...funcParams);
      
      if (mountedRef.current) {
        setData(result);
        if (cacheKey) apiCache.set(cacheKey, { data: result, status: 'success', timestamp: Date.now() });
      }
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Something went wrong';
      if (mountedRef.current) {
        setError(errorMsg);
        if (cacheKey) apiCache.set(cacheKey, { error: errorMsg, status: 'error', timestamp: Date.now() });
      }
      throw err;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [apiFunc, paramsString, cacheKey]);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      execute();
    }
    return () => { mountedRef.current = false; };
  }, [immediate, execute]);

  return { data, loading, error, setData, refetch: execute };
};

export default useApi;
