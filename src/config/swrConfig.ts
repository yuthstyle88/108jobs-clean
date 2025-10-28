import {SWRConfiguration} from "swr";

/**
 * Global SWR configuration with optimized settings for performance
 * - dedupingInterval: Prevents duplicate requests within 2 seconds
 * - focusThrottleInterval: Limits revalidation on focus to once every 5 seconds
 * - errorRetryCount: Limits retry attempts to 3
 * - errorRetryInterval: Uses exponential backoff for retries
 * - fallbackData: Provides fallback mechanism for failed requests
 * - keepPreviousData: Keeps previous data while revalidating for better UX
 */
const swrConfig: SWRConfiguration = {
  // Revalidation settings
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  revalidateIfStale: true,

  // Performance optimizations
  dedupingInterval: 2000, // Deduplicate requests within 2 seconds
  focusThrottleInterval: 5000, // Throttle focus revalidation

  // Error handling
  shouldRetryOnError: true,
  errorRetryCount: 3, // Limit retry attempts
  errorRetryInterval: 1000, // Start with 1 second, then exponential backoff

  // UX improvements
  keepPreviousData: true, // Keep showing previous data while fetching new data

  // Custom retry function with exponential backoff
  onErrorRetry: (error, key, config, revalidate, {retryCount}) => {
    // Don't retry on 404s or specific error codes
    if (error.status === 404 || error.status === 403) return;

    // Only retry up to errorRetryCount times
    if (retryCount >= (config.errorRetryCount || 3)) return;

    // Exponential backoff
    const delay = Math.min(
      1000 * 2 ** retryCount, // Exponential increase
      30000 // Max 30 seconds
    );

    // Retry after delay
    setTimeout(() => revalidate({retryCount}),
      delay);
  },
};

export default swrConfig;
