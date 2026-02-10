import { useState, useEffect } from 'react';

/**
 * LocalStorage를 React State처럼 사용하는 커스텀 훅
 * @param {string} key - LocalStorage 키
 * @param {any} initialValue - 초기값
 */
export function useLocalStorage(key, initialValue) {
  // State 초기화
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // 값이 변경될 때마다 LocalStorage에 저장
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
