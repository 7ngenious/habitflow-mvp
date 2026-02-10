import { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  getCalendarDays,
  formatDate,
  getWeekOfMonth,
} from '../utils/dateUtils';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function MonthCalendar({ habits, checks, onToggleCheck }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const calendarDays = getCalendarDays(year, month);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 특정 날짜의 완료율 계산
  const getCompletionRate = (date) => {
    if (!date) return 0;
    const dateStr = formatDate(date);
    const completedCount = habits.filter(
      (habit) => checks[habit.id]?.[dateStr] === true
    ).length;
    return habits.length > 0
      ? Math.round((completedCount / habits.length) * 100)
      : 0;
  };

  // 주별 완료율 계산
  const getWeeklyStats = () => {
    const weekStats = {};
    calendarDays.forEach((day) => {
      if (day) {
        const weekNum = getWeekOfMonth(day);
        if (!weekStats[weekNum]) {
          weekStats[weekNum] = { total: 0, sum: 0 };
        }
        weekStats[weekNum].total += 1;
        weekStats[weekNum].sum += getCompletionRate(day);
      }
    });

    return Object.entries(weekStats).map(([week, stats]) => ({
      week: parseInt(week),
      rate: Math.round(stats.sum / stats.total),
    }));
  };

  const weeklyStats = getWeeklyStats();

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className='month-calendar'>
      <div className='calendar-header'>
        <button onClick={handlePrevMonth} className='btn-nav'>
          <FaChevronLeft />
        </button>
        <h2>{format(currentDate, 'yyyy년 M월', { locale: ko })}</h2>
        <button onClick={handleNextMonth} className='btn-nav'>
          <FaChevronRight />
        </button>
      </div>

      {/* 주별 통계 */}
      <div className='weekly-stats'>
        {weeklyStats.map(({ week, rate }) => (
          <div key={week} className='week-stat'>
            <span className='week-label'>Week {week}</span>
            <span className='week-rate'>{rate}%</span>
          </div>
        ))}
      </div>

      {/* 요일 헤더 */}
      <div className='calendar-weekdays'>
        {weekdays.map((day) => (
          <div key={day} className='weekday-header'>
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className='calendar-grid'>
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <div key={`empty-${index}`} className='calendar-day empty' />
            );
          }

          const dateStr = formatDate(day);
          const completionRate = getCompletionRate(day);
          const isToday = dateStr === formatDate(new Date());

          return (
            <div
              key={dateStr}
              className={`calendar-day ${isToday ? 'today' : ''}`}
            >
              <div className='day-header'>
                <span className='day-number'>{format(day, 'd')}</span>
                <span className='day-rate'>{completionRate}%</span>
              </div>

              <div className='day-habits'>
                {habits.map((habit) => {
                  const isChecked = checks[habit.id]?.[dateStr] === true;
                  return (
                    <div
                      key={habit.id}
                      className={`habit-check ${isChecked ? 'checked' : ''}`}
                      onClick={() => onToggleCheck(habit.id, dateStr)}
                      style={{
                        borderColor: habit.color,
                        backgroundColor: isChecked
                          ? habit.color
                          : 'transparent',
                      }}
                      title={habit.name}
                    >
                      {isChecked && (
                        <svg viewBox='0 0 24 24' fill='none' stroke='white'>
                          <polyline points='20 6 9 17 4 12'></polyline>
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 습관 범례 */}
      <div className='calendar-legend'>
        <h3>습관 목록</h3>
        <div className='legend-items'>
          {habits.map((habit) => (
            <div key={habit.id} className='legend-item'>
              <div
                className='legend-color'
                style={{ backgroundColor: habit.color }}
              />
              <span className='legend-icon'>{habit.icon}</span>
              <span className='legend-name'>{habit.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
