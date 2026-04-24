import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { Badge } from './Badge';

interface Food {
  id?: string;
  name: string;
  brand?: string;
  serving_size?: number;
  serving_unit?: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface FoodCardProps {
  food: Food;
  onSelect?: () => void;
  onAdd?: () => void;
  selected?: boolean;
  showAddButton?: boolean;
  className?: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onSelect,
  onAdd,
  selected = false,
  showAddButton = false,
  className,
}) => {
  return (
    <Card
      variant="default"
      className={cn(
        'overflow-hidden transition-all',
        selected && 'ring-2 ring-green-500',
        onSelect && 'cursor-pointer',
        className
      )}
      onClick={onSelect}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">{food.name}</p>
            {food.brand && (
              <p className="text-xs text-gray-500 truncate">{food.brand}</p>
            )}
            {(food.serving_size || food.serving_unit) && (
              <p className="text-xs text-gray-400 mt-0.5">
                {food.serving_size && `${food.serving_size}`}
                {food.serving_unit && ` ${food.serving_unit}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <span className="text-sm font-bold text-green-600">
                {food.calories}
              </span>
              <span className="text-xs text-gray-400 ml-0.5">kcal</span>
            </div>
            {(showAddButton || onAdd) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd?.();
                }}
                className="w-7 h-7 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors flex-shrink-0"
                aria-label={`Add ${food.name}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {(food.protein !== undefined || food.carbs !== undefined || food.fat !== undefined) && (
          <div className="flex gap-1.5 mt-2">
            {food.protein !== undefined && (
              <Badge variant="info" size="sm">P {food.protein}g</Badge>
            )}
            {food.carbs !== undefined && (
              <Badge variant="warning" size="sm">C {food.carbs}g</Badge>
            )}
            {food.fat !== undefined && (
              <Badge variant="default" size="sm">F {food.fat}g</Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FoodCard;
