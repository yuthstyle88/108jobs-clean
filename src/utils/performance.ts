import {isBrowser} from "@/utils/browser";

/**
 * Utility functions for measuring and monitoring performance
 */

/**
 * Measures the time it takes to execute a function
 * @param fn The function to measure
 * @param label A label for the measurement
 * @returns The result of the function
 */
export function measureExecutionTime<T>(fn: () => T, label: string): T {
  if (typeof performance === 'undefined') {
    return fn();
  }

  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();

  console.log(`[Performance] ${label}: ${endTime - startTime}ms`);

  return result;
}

/**
 * Measures the time it takes to execute an async function
 * @param fn The async function to measure
 * @param label A label for the measurement
 * @returns A promise that resolves to the result of the function
 */
export async function measureAsyncExecutionTime<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  if (typeof performance === 'undefined') {
    return fn();
  }

  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();

  console.log(`[Performance] ${label}: ${endTime - startTime}ms`);

  return result;
}

/**
 * Measures the time it takes to load an image
 * @param src The image source
 * @param label A label for the measurement
 * @returns A promise that resolves when the image is loaded
 */
export function measureImageLoadTime(src: string, label: string): Promise<void> {
  return new Promise((resolve) => {
    if (!isBrowser()) {
      resolve();
      return;
    }

    const img = new Image();
    const startTime = performance.now();

    img.onload = () => {
      const endTime = performance.now();
      console.log(`[Performance] Image load ${label}: ${endTime - startTime}ms`);
      resolve();
    };

    img.onerror = () => {
      const endTime = performance.now();
      console.error(`[Performance] Image load error ${label}: ${endTime - startTime}ms`);
      resolve();
    };

    img.src = src;
  });
}

/**
 * Tracks a custom performance metric
 * @param metricName The name of the metric
 * @param value The value of the metric
 */
export function trackMetric(metricName: string, value: number): void {
  if (!isBrowser() || !window.performance || !window.performance.mark) {
    return;
  }

  // Create a performance mark
  window.performance.mark(`${metricName}-${value}`);

  // Log the metric
  console.log(`[Metric] ${metricName}: ${value}`);

  // If available, send to analytics
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event',
    'performance_metric',
    {
      metric_name: metricName,
      metric_value: value
    });
}

/**
 * Measures component render time using React's Profiler
 * Usage:
 * <Profiler id="MyComponent" onRender={measureRenderTime}>
 *   <MyComponent />
 * </Profiler>
 */
export function measureRenderTime(
  id: string,
  phase: string,
  actualDuration: number,
  baseDuration: number,
  _startTime: number,
  _commitTime: number
): void {
  console.log(`[Render] ${id} took ${actualDuration.toFixed(2)}ms (Base: ${baseDuration.toFixed(2)}ms)`);

  // Track the metric
  trackMetric(`render_${id}`,
    actualDuration);
}

/**
 * Creates a performance observer to monitor specific performance entries
 * @param entryTypes The types of entries to observe
 * @param callback The callback to execute when entries are observed
 * @returns A function to disconnect the observer
 */
export function createPerformanceObserver(
  entryTypes: string[],
  callback: (entries: PerformanceObserverEntryList) => void
): () => void {
  if (typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  const observer = new PerformanceObserver((list) => {
    callback(list);
  });

  observer.observe({entryTypes});

  return () => {
    observer.disconnect();
  };
}

/**
 * Monitors First Contentful Paint (FCP)
 * @param callback The callback to execute when FCP is observed
 * @returns A function to disconnect the observer
 */
export function monitorFCP(callback: (value: number) => void): () => void {
  return createPerformanceObserver(['paint'],
    (list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          callback(entry.startTime);
        }
      }
    });
}

/**
 * Monitors Largest Contentful Paint (LCP)
 * @param callback The callback to execute when LCP is observed
 * @returns A function to disconnect the observer
 */
export function monitorLCP(callback: (value: number) => void): () => void {
  return createPerformanceObserver(['largest-contentful-paint'],
    (list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      callback(lastEntry.startTime);
    });
}

/**
 * Monitors Cumulative Layout Shift (CLS)
 * @param callback The callback to execute when CLS is observed
 * @returns A function to disconnect the observer
 */
export function monitorCLS(callback: (value: number) => void): () => void {
  let clsValue = 0;
  const clsEntries: PerformanceEntry[] = [];

  return createPerformanceObserver(['layout-shift'],
    (list) => {
      for (const entry of list.getEntries()) {
        // Only count layout shifts without recent user input
        const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!e.hadRecentInput) {
          clsValue += e.value ?? 0;
          clsEntries.push(entry);
          callback(clsValue);
        }
      }
    });
}

/**
 * Monitors First Input Delay (FID)
 * @param callback The callback to execute when FID is observed
 * @returns A function to disconnect the observer
 */
export function monitorFID(callback: (value: number) => void): () => void {
  return createPerformanceObserver(['first-input'],
    (list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & { processingStart?: number };
        const delay = (e.processingStart ?? entry.startTime) - entry.startTime;
        callback(delay);
      }
    });
}

/**
 * Initializes performance monitoring for modules web vitals
 * @returns An object with functions to disconnect the observers
 */
export function initPerformanceMonitoring(): {
  disconnectFCP: () => void;
  disconnectLCP: () => void;
  disconnectCLS: () => void;
  disconnectFID: () => void;
} {
  const disconnectFCP = monitorFCP((value) => {
    console.log(`[Core Web Vital] FCP: ${value}ms`);
    trackMetric('FCP',
      value);
  });

  const disconnectLCP = monitorLCP((value) => {
    console.log(`[Core Web Vital] LCP: ${value}ms`);
    trackMetric('LCP',
      value);
  });

  const disconnectCLS = monitorCLS((value) => {
    console.log(`[Core Web Vital] CLS: ${value}`);
    trackMetric('CLS',
      value);
  });

  const disconnectFID = monitorFID((value) => {
    console.log(`[Core Web Vital] FID: ${value}ms`);
    trackMetric('FID',
      value);
  });

  return {
    disconnectFCP,
    disconnectLCP,
    disconnectCLS,
    disconnectFID
  };
}