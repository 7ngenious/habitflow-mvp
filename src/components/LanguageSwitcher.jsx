// src/components/Languageswitcher.jsx
import { useLanguage } from '../contexts/Languagecontext';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className='language-switcher'
      onClick={toggleLanguage}
      title={language === 'ko' ? '日本語に切り替え' : '한국어로 전환'}
      aria-label={language === 'ko' ? '일본어로 전환' : '한국어로 전환'}
    >
      {language === 'ko' ? '🇯🇵' : '🇰🇷'}
    </button>
  );
}
