// src/locales/ja.js
export const ja = {
  // ヘッダー
  header: {
    title: 'HabitFlow',
    subtitle: '習慣を流れにしましょう',
  },

  // 習慣管理
  habitList: {
    title: 'マイ習慣',
    addButton: '習慣を追加',
    emptyState: {
      line1: 'まだ習慣がありません。',
      line2: '上の「習慣を追加」ボタンを押して始めましょう！',
    },
    deleteConfirm: '本当にこの習慣を削除しますか？',
  },

  // 習慣フォーム
  habitForm: {
    nameLabel: '習慣名',
    namePlaceholder: '例：朝の運動',
    iconLabel: 'アイコン',
    colorLabel: 'カラー',
    submitButton: '追加',
    cancelButton: 'キャンセル',
  },

  // タブナビゲーション
  tabs: {
    today: '今日',
    calendar: 'カレンダー',
    stats: '統計',
  },

  // 今日のチェック
  dailyCheck: {
    completion: '完了',
    progressText: '習慣完了',
    emptyState: {
      line1: 'チェックする習慣がありません。',
      line2: 'まず習慣を追加してください！',
    },
    celebration: '🎉 今日のすべての習慣を完了しました！',
  },

  // 月間カレンダー
  calendar: {
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    weekLabel: '週',
    legendTitle: '習慣一覧',
  },

  // 統計
  statistics: {
    title: '進捗分析',
    overallRate: '全体完了率',
    totalChecks: '総チェック数',
    bestRecord: '最高記録',
    recentDays: '最近30日の完了率',
    weeklyAverage: '週間平均完了率',
    habitStats: '習慣別統計（最近30日）',
    days: '日',
    emptyState: {
      message: '統計を見るには、まず習慣を追加してください！',
    },
  },

  // フッター
  footer: {
    madeWith: 'Made with ❤️ by 7ngenious',
  },
};
