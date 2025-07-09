/**
 * 防抖函数
 * @param func 需要防抖的函数
 * @param wait 等待时间
 * @param immediate 是否立即执行
 * @returns 带有flush方法的防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate: boolean = false): ((...args: Parameters<T>) => void) & { flush: (...args: Parameters<T>) => void } {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = undefined;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  } as ((...args: Parameters<T>) => void) & { flush: (...args: Parameters<T>) => void };

  // 添加flush方法，用于立即执行
  debounced.flush = function (this: any, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
      func.apply(this, args);
    }
  };

  return debounced;
}

/**
 * 节流函数
 * @param func 需要节流的函数
 * @param limit 间隔时间
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  return function (this: any, ...args: Parameters<T>) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan)
      );
    }
  };
}

/**
 * 延迟执行函数
 * @param ms 毫秒
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
