'use client';

import React from 'react';

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ className = '', children, onClick }) => {
  return (
    <div
      className={[
        'bg-white rounded-xl shadow-sm border border-gray-100',
        onClick ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export interface MealCardProps {
  mealType: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  itemCount: number;
  onAddFood: () => void;
  onViewDetails: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  mealType,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  itemCount,
  onAddFood,
  onViewDetails,
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-800">{mealType}</h3>
        <span className="text-lg font-bold text-gray-900">{totalCalories} kcal</span>
      </div>

      <div className="flex gap-2 mb-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          P: {totalProtein}g
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
          C: {totalCarbs}g
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          F: {totalFat}g
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>

      <div className="flex gap-2">
        <button
          onClick={onAddFood}
          className="flex-1 text-xs px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-150 font-medium"
        >
          Add Food
        </button>
        <button
          onClick={onViewDetails}
          className="flex-1 text-xs px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150 font-medium"
        >
          View Details
        </button>
      </div>
    </Card>
  );
};

export interface FoodItemCardProps {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servingUnit: string;
  quantity: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  name,
  calories,
  protein,
  carbs,
  fat,
  servingSize,
  servingUnit,
  quantity,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {quantity} × {servingSize}
            {servingUnit}
          </p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs text-blue-700 font-medium">P {protein}g</span>
            <span className="text-xs text-orange-700 font-medium">C {carbs}g</span>
            <span className="text-xs text-purple-700 font-medium">F {fat}g</span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-3">
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            {calories} kcal
          </span>
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Edit food item"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Delete food item"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
