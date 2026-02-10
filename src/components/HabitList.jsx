import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const PRESET_COLORS = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
];

const PRESET_ICONS = [
  '🏃',
  '📚',
  '💪',
  '🎯',
  '☕',
  '🧘',
  '💻',
  '🎨',
  '🎵',
  '✍️',
];

export default function HabitList({ habits, onAddHabit, onDeleteHabit }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: '⭐',
    color: '#3B82F6',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newHabit.name.trim()) {
      onAddHabit({
        ...newHabit,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
      setNewHabit({ name: '', icon: '⭐', color: '#3B82F6' });
      setIsAdding(false);
    }
  };

  return (
    <div className='habit-list'>
      <div className='habit-list-header'>
        <h2>내 습관 ({habits.length})</h2>
        <button className='btn-add' onClick={() => setIsAdding(!isAdding)}>
          <FaPlus /> 습관 추가
        </button>
      </div>

      {isAdding && (
        <form className='habit-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>습관 이름</label>
            <input
              type='text'
              value={newHabit.name}
              onChange={(e) =>
                setNewHabit({ ...newHabit, name: e.target.value })
              }
              placeholder='예: 아침 운동'
              autoFocus
            />
          </div>

          <div className='form-group'>
            <label>아이콘</label>
            <div className='icon-picker'>
              {PRESET_ICONS.map((icon) => (
                <button
                  key={icon}
                  type='button'
                  className={`icon-option ${
                    newHabit.icon === icon ? 'selected' : ''
                  }`}
                  onClick={() => setNewHabit({ ...newHabit, icon })}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className='form-group'>
            <label>색상</label>
            <div className='color-picker'>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type='button'
                  className={`color-option ${
                    newHabit.color === color ? 'selected' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewHabit({ ...newHabit, color })}
                />
              ))}
            </div>
          </div>

          <div className='form-actions'>
            <button type='submit' className='btn-primary'>
              추가
            </button>
            <button
              type='button'
              className='btn-secondary'
              onClick={() => setIsAdding(false)}
            >
              취소
            </button>
          </div>
        </form>
      )}

      <div className='habits-grid'>
        {habits.map((habit) => (
          <div
            key={habit.id}
            className='habit-card'
            style={{ borderLeftColor: habit.color }}
          >
            <div className='habit-info'>
              <span className='habit-icon'>{habit.icon}</span>
              <span className='habit-name'>{habit.name}</span>
            </div>
            <button
              className='btn-delete'
              onClick={() => onDeleteHabit(habit.id)}
              title='삭제'
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {habits.length === 0 && !isAdding && (
        <div className='empty-state'>
          <p>아직 습관이 없습니다.</p>
          <p>위의 "습관 추가" 버튼을 눌러 시작하세요!</p>
        </div>
      )}
    </div>
  );
}
