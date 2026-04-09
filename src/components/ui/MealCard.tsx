import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { Badge } from './Badge';

interface Meal {
  id: string;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  logged_at: string;
  total_calories: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  food_count?: number;
}

interface MealCardProps {
  meal: Meal;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const mealTypeEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  onEdit,
  onDelete,
  className,
}) => {
  const timeStr = new Date(meal.logged_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card variant="default" className={cn('overflow-hidden', className)}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">
              {mealTypeEmoji[meal.meal_type]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{meal.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500 capitalize">{meal.meal_type}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">{timeStr}</span>
                {meal.food_count !== undefined && (
                  <>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{meal.food_count} item{meal.food_count !== 1 ? 's' : ''}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-lg font-bold text-green-600">
              {meal.total_calories}
            </span>
            <span className="text-xs text-gray-500">kcal</span>
          </div>
        </div>

        {(meal.total_protein !== undefined || meal.total_carbs !== undefined || meal.total_fat !== undefined) && (
          <div className="flex gap-2 mt-3">
            {meal.total_protein !== undefined && (
              <Badge variant="info" size="sm">P {meal.total_protein}g</Badge>
            )}
            {meal.total_carbs !== undefined && (
              <Badge variant="warning" size="sm">C {meal.total_carbs}g</Badge>
            )}
            {meal.total_fat !== undefined && (
              <Badge variant="default" size="sm">F {meal.total_fat}g</Badge>
            )}
          </div>
        )}

        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-3 justify-end">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Edit meal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Delete meal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MealCard;
