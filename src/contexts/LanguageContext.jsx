// src/contexts/LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { ko } from '../locales/ko';
import { ja } from '../locales/ja';

const LanguageContext = createContext();

const translations = {
  ko,
  ja,
};

export function LanguageProvider({ children }) {
  // LocalStorage에서 저장된 언어 불러오기
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'ko'; // 기본값: 한국어
  });

  // 언어 변경 시 LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ko' ? 'ja' : 'ko'));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
