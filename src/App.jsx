import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import HabitList from './components/HabitList';
import DailyCheck from './components/DailyCheck';
import MonthCalendar from './components/MonthCalendar';
import ProgressChart from './components/ProgressChart';
import { FaHome, FaCalendarAlt, FaChartLine, FaCog } from 'react-icons/fa';
import './App.css';

function App() {
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
    if (window.confirm('정말 이 습관을 삭제하시겠습니까?')) {
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
    { id: 'today', icon: <FaHome />, label: '오늘' },
    { id: 'calendar', icon: <FaCalendarAlt />, label: '캘린더' },
    { id: 'stats', icon: <FaChartLine />, label: '통계' },
  ];

  return (
    <div className='app'>
      {/* 헤더 */}
      <header className='app-header'>
        <h1>HabitFlow</h1>
        <p className='app-subtitle'>습관을 흐름으로 만들어보세요</p>
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
        <p>Made with ❤️ by 7ngenious</p>
      </footer>
    </div>
  );
}

export default App;
