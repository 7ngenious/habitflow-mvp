import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { formatDate } from '../utils/dateUtils';
import { useLanguage } from '../contexts/Languagecontext';

export default function ProgressChart({ habits, checks }) {
  const { t } = useLanguage();

  // 최근 30일 데이터
  const dailyData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = formatDate(date);

      const completedCount = habits.filter(
        (habit) => checks[habit.id]?.[dateStr] === true
      ).length;

      const rate =
        habits.length > 0
          ? Math.round((completedCount / habits.length) * 100)
          : 0;

      data.push({
        date: format(date, 'M/d'),
        [t.statistics.overallRate]: rate,
      });
    }

    return data;
  }, [habits, checks, t]);

  // 주간 평균 데이터
  const weeklyData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let week = 3; week >= 0; week--) {
      const weekDates = [];
      for (let day = 0; day < 7; day++) {
        const date = subDays(today, week * 7 + day);
        weekDates.push(formatDate(date));
      }

      const totalRate = weekDates.reduce((sum, dateStr) => {
        const completedCount = habits.filter(
          (habit) => checks[habit.id]?.[dateStr] === true
        ).length;
        const rate =
          habits.length > 0
            ? Math.round((completedCount / habits.length) * 100)
            : 0;
        return sum + rate;
      }, 0);

      const avgRate = Math.round(totalRate / 7);

      data.push({
        week: `${t.calendar.weekLabel} ${4 - week}`,
        [t.statistics.overallRate]: avgRate,
      });
    }

    return data;
  }, [habits, checks, t]);

  // 습관별 통계
  const habitStats = useMemo(() => {
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) =>
      formatDate(subDays(today, i))
    );

    return habits.map((habit) => {
      const completedDays = last30Days.filter(
        (date) => checks[habit.id]?.[date] === true
      ).length;

      const rate = Math.round((completedDays / 30) * 100);

      return {
        ...habit,
        completedDays,
        rate,
      };
    });
  }, [habits, checks]);

  // 전체 통계
  const overallStats = useMemo(() => {
    const totalChecks = Object.values(checks).reduce((sum, habitChecks) => {
      return sum + Object.values(habitChecks).filter(Boolean).length;
    }, 0);

    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) =>
      formatDate(subDays(today, i))
    );

    const rates = last30Days.map((dateStr) => {
      const completedCount = habits.filter(
        (habit) => checks[habit.id]?.[dateStr] === true
      ).length;
      return habits.length > 0
        ? Math.round((completedCount / habits.length) * 100)
        : 0;
    });

    const avgRate =
      rates.length > 0
        ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
        : 0;

    const bestRate = Math.max(...rates, 0);

    return { totalChecks, avgRate, bestRate };
  }, [habits, checks]);

  if (habits.length === 0) {
    return (
      <div className='empty-state'>
        <p>{t.statistics.emptyState.message}</p>
      </div>
    );
  }

  return (
    <div className='progress-chart'>
      <h2>{t.statistics.title}</h2>

      {/* 전체 통계 카드 */}
      <div className='stats-cards'>
        <div className='stat-card'>
          <div className='stat-value'>{overallStats.avgRate}%</div>
          <div className='stat-label'>{t.statistics.overallRate}</div>
        </div>
        <div className='stat-card'>
          <div className='stat-value'>{overallStats.totalChecks}</div>
          <div className='stat-label'>{t.statistics.totalChecks}</div>
        </div>
        <div className='stat-card'>
          <div className='stat-value'>{overallStats.bestRate}%</div>
          <div className='stat-label'>{t.statistics.bestRecord}</div>
        </div>
      </div>

      {/* 최근 30일 추이 */}
      <div className='chart-container'>
        <h3>{t.statistics.recentDays}</h3>
        <ResponsiveContainer width='100%' height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey={t.statistics.overallRate}
              stroke='#3b82f6'
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 주간 평균 */}
      <div className='chart-container'>
        <h3>{t.statistics.weeklyAverage}</h3>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='week' />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey={t.statistics.overallRate} fill='#10b981' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 습관별 통계 */}
      <div className='habit-stats'>
        <h3>{t.statistics.habitStats}</h3>
        {habitStats.map((habit) => (
          <div key={habit.id} className='habit-stat-item'>
            <div className='habit-stat-header'>
              <span className='habit-icon'>{habit.icon}</span>
              <span className='habit-name'>{habit.name}</span>
              <span className='habit-rate'>{habit.rate}%</span>
            </div>
            <div className='progress-bar'>
              <div
                className='progress-fill'
                style={{
                  width: `${habit.rate}%`,
                  backgroundColor: habit.color,
                }}
              />
            </div>
            <div className='habit-stat-detail'>
              {habit.completedDays} / 30 {t.statistics.days}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
