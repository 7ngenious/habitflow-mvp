import { format } from 'date-fns';
import { ko as koLocale, ja as jaLocale } from 'date-fns/locale';
import { formatDate } from '../utils/dateUtils';
import { useLanguage } from '../contexts/Languagecontext';

export default function DailyCheck({ habits, checks, onToggleCheck }) {
  const { t, language } = useLanguage();

  const today = formatDate(new Date());
  const todayDate = new Date();

  // 날짜 포맷 (언어별)
  const dateLocale = language === 'ko' ? koLocale : jaLocale;
  const dateFormat =
    language === 'ko' ? 'yyyy년 M월 d일 EEEE' : 'yyyy年M月d日 EEEE';
  const formattedDate = format(todayDate, dateFormat, { locale: dateLocale });

  // 오늘의 완료 현황
  const completedCount = habits.filter(
    (habit) => checks[habit.id]?.[today] === true
  ).length;

  const completionRate =
    habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const allCompleted = habits.length > 0 && completedCount === habits.length;

  if (habits.length === 0) {
    return (
      <div className='daily-check'>
        <div className='empty-state'>
          <p>{t.dailyCheck.emptyState.line1}</p>
          <p>{t.dailyCheck.emptyState.line2}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='daily-check'>
      <div className='daily-header'>
        <h2>{formattedDate}</h2>
        <div className='completion-badge'>
          <span className='completion-rate'>{completionRate}%</span>
          <span className='completion-text'>{t.dailyCheck.completion}</span>
        </div>
      </div>

      <div className='progress-section'>
        <div className='progress-bar'>
          <div
            className='progress-fill'
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className='progress-text'>
          {completedCount} / {habits.length} {t.dailyCheck.progressText}
        </p>
      </div>

      {allCompleted && (
        <div className='celebration-message'>{t.dailyCheck.celebration}</div>
      )}

      <div className='habits-checklist'>
        {habits.map((habit) => {
          const isChecked = checks[habit.id]?.[today] === true;

          return (
            <div
              key={habit.id}
              className={`habit-check-item ${isChecked ? 'checked' : ''}`}
              onClick={() => onToggleCheck(habit.id, today)}
            >
              <div className='habit-check-content'>
                <span className='habit-icon'>{habit.icon}</span>
                <span className='habit-name'>{habit.name}</span>
              </div>
              <div
                className='checkbox'
                style={{
                  borderColor: habit.color,
                  backgroundColor: isChecked ? habit.color : 'transparent',
                }}
              >
                {isChecked && <span className='checkmark'>✓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
