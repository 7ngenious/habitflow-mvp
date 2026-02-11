// src/locales/ko.js
export const ko = {
  // 헤더
  header: {
    title: 'HabitFlow',
    subtitle: '습관을 흐름으로 만들어보세요',
  },

  // 습관 관리
  habitList: {
    title: '내 습관',
    addButton: '습관 추가',
    emptyState: {
      line1: '아직 습관이 없습니다.',
      line2: "위의 '습관 추가' 버튼을 눌러 시작하세요!",
    },
    deleteConfirm: '정말 이 습관을 삭제하시겠습니까?',
  },

  // 습관 폼
  habitForm: {
    nameLabel: '습관 이름',
    namePlaceholder: '예: 아침 운동',
    iconLabel: '아이콘',
    colorLabel: '색상',
    submitButton: '추가',
    cancelButton: '취소',
  },

  // 탭 네비게이션
  tabs: {
    today: '오늘',
    calendar: '캘린더',
    stats: '통계',
  },

  // 오늘 체크
  dailyCheck: {
    completion: '완료',
    progressText: '습관 완료',
    emptyState: {
      line1: '체크할 습관이 없습니다.',
      line2: '먼저 습관을 추가해주세요!',
    },
    celebration: '🎉 오늘의 모든 습관을 완료했어요!',
  },

  // 월별 캘린더
  calendar: {
    weekdays: ['일', '월', '화', '수', '목', '금', '토'],
    weekLabel: 'Week',
    legendTitle: '습관 목록',
  },

  // 통계
  statistics: {
    title: '진행도 분석',
    overallRate: '전체 완료율',
    totalChecks: '총 체크 수',
    bestRecord: '최고 기록',
    recentDays: '최근 30일 완료율',
    weeklyAverage: '주간 평균 완료율',
    habitStats: '습관별 통계 (최근 30일)',
    days: '일',
    emptyState: {
      message: '통계를 보려면 먼저 습관을 추가하세요!',
    },
  },

  // 푸터
  footer: {
    madeWith: 'Made with ❤️ by 7ngenious',
  },
};
