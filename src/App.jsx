import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LanguageProvider, useLanguage } from './contexts/Languagecontext';
import HabitList from './components/HabitList';
import DailyCheck from './components/DailyCheck';
import MonthCalendar from './components/MonthCalendar';
import ProgressChart from './components/ProgressChart';
import LanguageSwitcher from './components/Languageswitcher';
import { FaHome, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import './App.css';

function AppContent() {
  const { t } = useLanguage();

  // LocalStorage 상태
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [checks, setChecks] = useLocalStorage('habitChecks', {});

  // 현재 탭
  const [activeTab, setActiveTab] = useState('today');

  // 습관 추가
  const handleAddHabit = (habit) => {
    setHabits([...habits, habit]);
    // 새 습관의 체크 기록 초기화
    setChecks({
      ...checks,
      [habit.id]: {},
    });
  };

  // 습관 삭제
  const handleDeleteHabit = (habitId) => {
    if (window.confirm(t.habitList.deleteConfirm)) {
      setHabits(habits.filter((h) => h.id !== habitId));
      // 체크 기록도 삭제
      const newChecks = { ...checks };
      delete newChecks[habitId];
      setChecks(newChecks);
    }
  };

  // 체크 토글
  const handleToggleCheck = (habitId, date) => {
    setChecks((prevChecks) => {
      const habitChecks = prevChecks[habitId] || {};
      const isCurrentlyChecked = habitChecks[date] === true;

      return {
        ...prevChecks,
        [habitId]: {
          ...habitChecks,
          [date]: !isCurrentlyChecked,
        },
      };
    });
  };

  // 탭 구성
  const tabs = [
    { id: 'today', icon: <FaHome />, label: t.tabs.today },
    { id: 'calendar', icon: <FaCalendarAlt />, label: t.tabs.calendar },
    { id: 'stats', icon: <FaChartLine />, label: t.tabs.stats },
  ];

  return (
    <div className='app'>
      {/* 헤더 */}
      <header className='app-header'>
        <div className='header-content'>
          <div>
            <h1>{t.header.title}</h1>
            <p className='app-subtitle'>{t.header.subtitle}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* 습관 관리 섹션 */}
      <section className='habits-section'>
        <HabitList
          habits={habits}
          onAddHabit={handleAddHabit}
          onDeleteHabit={handleDeleteHabit}
        />
      </section>

      {/* 탭 네비게이션 */}
      <nav className='tab-nav'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className='tab-icon'>{tab.icon}</span>
            <span className='tab-label'>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* 탭 컨텐츠 */}
      <main className='tab-content'>
        {activeTab === 'today' && (
          <DailyCheck
            habits={habits}
            checks={checks}
            onToggleCheck={handleToggleCheck}
          />
        )}

        {activeTab === 'calendar' && (
          <MonthCalendar
            habits={habits}
            checks={checks}
            onToggleCheck={handleToggleCheck}
          />
        )}

        {activeTab === 'stats' && (
          <ProgressChart habits={habits} checks={checks} />
        )}
      </main>

      {/* 푸터 */}
      <footer className='app-footer'>
        <p>{t.footer.madeWith}</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
