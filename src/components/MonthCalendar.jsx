import { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ko as koLocale, ja as jaLocale } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
  getCalendarDays,
  formatDate,
  getWeeksInMonth,
} from '../utils/dateUtils';
import { useLanguage } from '../contexts/Languagecontext';

export default function MonthCalendar({ habits, checks, onToggleCheck }) {
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // 언어별 날짜 포맷
  const dateLocale = language === 'ko' ? koLocale : jaLocale;
  const monthFormat = language === 'ko' ? 'yyyy년 M월' : 'yyyy年M月';
  const formattedMonth = format(currentDate, monthFormat, {
    locale: dateLocale,
  });

  const calendarDays = getCalendarDays(year, month);
  const weeks = getWeeksInMonth(year, month);
  const weekdays = t.calendar.weekdays;

  const today = formatDate(new Date());

  // 날짜별 완료율 계산
  const getCompletionRate = (day) => {
    if (!day) return 0;
    const dateStr = formatDate(day);
    const completedCount = habits.filter(
      (habit) => checks[habit.id]?.[dateStr] === true
    ).length;
    return habits.length > 0
      ? Math.round((completedCount / habits.length) * 100)
      : 0;
  };

  // 주차별 평균 완료율
  const getWeekAverage = (weekDays) => {
    const validDays = weekDays.filter((day) => day !== null);
    if (validDays.length === 0) return 0;

    const totalRate = validDays.reduce((sum, day) => {
      return sum + getCompletionRate(day);
    }, 0);

    return Math.round(totalRate / validDays.length);
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // 습관 점 클릭 핸들러
  const handleHabitClick = (e, habitId, dateStr) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onToggleCheck(habitId, dateStr);
  };

  return (
    <div className='month-calendar'>
      {/* 월 네비게이션 */}
      <div className='calendar-header'>
        <button className='nav-button' onClick={handlePrevMonth}>
          <FaChevronLeft />
        </button>
        <h2>{formattedMonth}</h2>
        <button className='nav-button' onClick={handleNextMonth}>
          <FaChevronRight />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className='calendar-weekdays'>
        {weekdays.map((day, index) => (
          <div key={index} className='weekday-header'>
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
          const isToday = dateStr === today;

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
                    <button
                      key={habit.id}
                      className={`habit-dot ${
                        isChecked ? 'checked' : 'unchecked'
                      }`}
                      style={{
                        backgroundColor: isChecked ? habit.color : '#e5e7eb',
                        borderColor: habit.color,
                      }}
                      onClick={(e) => handleHabitClick(e, habit.id, dateStr)}
                      title={`${habit.icon} ${habit.name}`}
                      aria-label={`${habit.name} ${
                        isChecked ? '완료됨' : '미완료'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 주차별 통계 */}
      <div className='week-stats'>
        {weeks.map((weekDays, weekIndex) => (
          <div key={weekIndex} className='week-stat'>
            <span className='week-label'>
              {t.calendar.weekLabel} {weekIndex + 1}
            </span>
            <div className='week-progress'>
              <div
                className='week-progress-fill'
                style={{ width: `${getWeekAverage(weekDays)}%` }}
              />
            </div>
            <span className='week-rate'>{getWeekAverage(weekDays)}%</span>
          </div>
        ))}
      </div>

      {/* 습관 범례 */}
      <div className='calendar-legend'>
        <h3>{t.calendar.legendTitle}</h3>
        <div className='legend-items'>
          {habits.map((habit) => (
            <div key={habit.id} className='legend-item'>
              <span className='legend-icon'>{habit.icon}</span>
              <span
                className='legend-color'
                style={{ backgroundColor: habit.color }}
              />
              <span className='legend-name'>{habit.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
