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
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { formatDate } from '../utils/dateUtils';

export default function ProgressChart({ habits, checks }) {
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
        완료율: rate,
        완료: completedCount,
        전체: habits.length,
      });
    }

    return data;
  }, [habits, checks]);

  // 최근 4주 데이터
  const weeklyData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(today, i * 7), { weekStartsOn: 0 });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

      let totalRate = 0;
      weekDays.forEach((day) => {
        const dateStr = formatDate(day);
        const completedCount = habits.filter(
          (habit) => checks[habit.id]?.[dateStr] === true
        ).length;
        const rate =
          habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
        totalRate += rate;
      });

      const avgRate = Math.round(totalRate / 7);

      data.push({
        week: format(weekStart, 'M/d', { locale: ko }),
        완료율: avgRate,
      });
    }

    return data;
  }, [habits, checks]);

  // 전체 통계
  const overallStats = useMemo(() => {
    const totalChecks = Object.values(checks).reduce((sum, habitChecks) => {
      return sum + Object.values(habitChecks).filter((v) => v === true).length;
    }, 0);

    const totalPossible = habits.length * dailyData.length;
    const overallRate =
      totalPossible > 0 ? Math.round((totalChecks / totalPossible) * 100) : 0;

    return {
      totalChecks,
      overallRate,
      bestDay: dailyData.reduce(
        (best, day) => (day.완료율 > best.완료율 ? day : best),
        dailyData[0] || { 완료율: 0 }
      ),
    };
  }, [habits, checks, dailyData]);

  if (habits.length === 0) {
    return (
      <div className='progress-chart'>
        <div className='empty-state'>
          <p>통계를 보려면 먼저 습관을 추가하세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className='progress-chart'>
      <h2>진행도 분석</h2>

      {/* 통계 카드 */}
      <div className='stats-cards'>
        <div className='stat-card'>
          <div className='stat-value'>{overallStats.overallRate}%</div>
          <div className='stat-label'>전체 완료율</div>
        </div>
        <div className='stat-card'>
          <div className='stat-value'>{overallStats.totalChecks}</div>
          <div className='stat-label'>총 체크 수</div>
        </div>
        <div className='stat-card'>
          <div className='stat-value'>{overallStats.bestDay.완료율}%</div>
          <div className='stat-label'>최고 기록</div>
          <div className='stat-sublabel'>{overallStats.bestDay.date}</div>
        </div>
      </div>

      {/* 일별 완료율 그래프 */}
      <div className='chart-container'>
        <h3>최근 30일 완료율</h3>
        <ResponsiveContainer width='100%' height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis
              dataKey='date'
              stroke='#6b7280'
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke='#6b7280'
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Line
              type='monotone'
              dataKey='완료율'
              stroke='#3b82f6'
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 주별 평균 완료율 */}
      <div className='chart-container'>
        <h3>주간 평균 완료율</h3>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis
              dataKey='week'
              stroke='#6b7280'
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke='#6b7280'
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey='완료율' fill='#10b981' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 습관별 상세 통계 */}
      <div className='habit-stats'>
        <h3>습관별 통계 (최근 30일)</h3>
        <div className='habit-stats-list'>
          {habits.map((habit) => {
            const completedDays = dailyData.filter((day) => {
              const dateStr = format(
                subDays(new Date(), 29 - dailyData.indexOf(day)),
                'yyyy-MM-dd'
              );
              return checks[habit.id]?.[dateStr] === true;
            }).length;

            const rate = Math.round((completedDays / 30) * 100);

            return (
              <div key={habit.id} className='habit-stat-item'>
                <div className='habit-stat-info'>
                  <span
                    className='habit-stat-icon'
                    style={{ color: habit.color }}
                  >
                    {habit.icon}
                  </span>
                  <span className='habit-stat-name'>{habit.name}</span>
                </div>
                <div className='habit-stat-bar'>
                  <div
                    className='habit-stat-fill'
                    style={{
                      width: `${rate}%`,
                      backgroundColor: habit.color,
                    }}
                  />
                </div>
                <div className='habit-stat-value'>
                  <span>{completedDays}/30일</span>
                  <span className='habit-stat-rate'>{rate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
