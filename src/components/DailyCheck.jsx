import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getTodayString } from '../utils/dateUtils';

export default function DailyCheck({ habits, checks, onToggleCheck }) {
  const today = getTodayString();
  const todayDate = new Date();
  const formattedDate = format(todayDate, 'yyyy년 M월 d일 EEEE', {
    locale: ko,
  });

  // 오늘의 완료율 계산
  const completedCount = habits.filter(
    (habit) => checks[habit.id]?.[today] === true
  ).length;
  const completionRate =
    habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className='daily-check'>
      <div className='daily-header'>
        <h2>{formattedDate}</h2>
        <div className='completion-badge'>
          <span className='completion-rate'>{completionRate}%</span>
          <span className='completion-text'>완료</span>
        </div>
      </div>

      <div className='daily-progress'>
        <div className='progress-bar'>
          <div
            className='progress-fill'
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className='progress-text'>
          {completedCount} / {habits.length} 습관 완료
        </p>
      </div>

      <div className='habit-checks'>
        {habits.length === 0 ? (
          <div className='empty-state'>
            <p>체크할 습관이 없습니다.</p>
            <p>먼저 습관을 추가해주세요!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isChecked = checks[habit.id]?.[today] === true;

            return (
              <div
                key={habit.id}
                className={`check-item ${isChecked ? 'checked' : ''}`}
                onClick={() => onToggleCheck(habit.id, today)}
              >
                <div className='check-box'>
                  {isChecked && (
                    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                      <polyline points='20 6 9 17 4 12'></polyline>
                    </svg>
                  )}
                </div>
                <div className='check-info'>
                  <span className='check-icon' style={{ color: habit.color }}>
                    {habit.icon}
                  </span>
                  <span className='check-name'>{habit.name}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {completedCount === habits.length && habits.length > 0 && (
        <div className='celebration'>
          <p>🎉 오늘의 모든 습관을 완료했어요!</p>
        </div>
      )}
    </div>
  );
}
