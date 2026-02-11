import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useLanguage } from '../contexts/Languagecontext';

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
  const { t } = useLanguage();
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
        <h2>
          {t.habitList.title} ({habits.length})
        </h2>
        <button className='btn-add' onClick={() => setIsAdding(!isAdding)}>
          <FaPlus /> {t.habitList.addButton}
        </button>
      </div>

      {isAdding && (
        <form className='habit-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>{t.habitForm.nameLabel}</label>
            <input
              type='text'
              value={newHabit.name}
              onChange={(e) =>
                setNewHabit({ ...newHabit, name: e.target.value })
              }
              placeholder={t.habitForm.namePlaceholder}
              autoFocus
            />
          </div>

          <div className='form-group'>
            <label>{t.habitForm.iconLabel}</label>
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
            <label>{t.habitForm.colorLabel}</label>
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
              {t.habitForm.submitButton}
            </button>
            <button
              type='button'
              className='btn-secondary'
              onClick={() => setIsAdding(false)}
            >
              {t.habitForm.cancelButton}
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
          <p>{t.habitList.emptyState.line1}</p>
          <p>{t.habitList.emptyState.line2}</p>
        </div>
      )}
    </div>
  );
}
