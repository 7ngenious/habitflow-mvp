import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환
 */
export function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * 특정 월의 모든 날짜 배열 반환
 */
export function getMonthDays(year, month) {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return eachDayOfInterval({ start, end });
}

/**
 * 캘린더 그리드를 위한 날짜 배열 생성 (앞뒤 공백 포함)
 */
export function getCalendarDays(year, month) {
  const firstDay = startOfMonth(new Date(year, month - 1));
  const lastDay = endOfMonth(new Date(year, month - 1));

  // 첫 주의 빈 칸들
  const startPadding = getDay(firstDay); // 0 (일요일) ~ 6 (토요일)
  const emptyStart = Array(startPadding).fill(null);

  // 실제 날짜들
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });

  return [...emptyStart, ...days];
}

/**
 * 주차 계산 (1주차, 2주차, ...)
 */
export function getWeekOfMonth(date) {
  const firstDay = startOfMonth(date);
  const daysSinceStart = Math.floor((date - firstDay) / (1000 * 60 * 60 * 24));
  return Math.floor(daysSinceStart / 7) + 1;
}

/**
 * 특정 주의 날짜 배열 반환
 */
export function getWeekDays(date) {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // 일요일 시작
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

/**
 * 오늘 날짜 문자열 반환
 */
export function getTodayString() {
  return formatDate(new Date());
}

/**
 * 월별 주차 그룹핑
 */
export function getMonthWeeks(year, month) {
  const days = getMonthDays(year, month);
  const weeks = {};

  days.forEach((day) => {
    const weekNum = getWeekOfMonth(day);
    if (!weeks[weekNum]) {
      weeks[weekNum] = [];
    }
    weeks[weekNum].push(day);
  });

  return weeks;
}

export function getWeeksInMonth(year, month) {
  const firstDay = startOfMonth(new Date(year, month - 1));
  const lastDay = endOfMonth(new Date(year, month - 1));
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  
  const weeks = [];
  let currentWeek = [];
  
  // 첫 주의 빈 칸
  const startPadding = getDay(firstDay);
  for (let i = 0; i < startPadding; i++) {
    currentWeek.push(null);
  }
  
  // 날짜 추가
  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // 마지막 주
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }
  
  return weeks;
}
