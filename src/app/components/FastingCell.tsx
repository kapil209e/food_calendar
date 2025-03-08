import { FastingMeal } from '../lib/meals/types';
import { Clock, Droplet } from 'lucide-react';

interface FastingCellProps {
  meal: FastingMeal;
}

export function FastingCell({ meal }: FastingCellProps) {
  const getFastingColor = (type: string) => {
    switch (type) {
      case 'water-fast':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'fruit-fast':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'liquid-fast':
        return 'bg-cyan-50 border-cyan-200 text-cyan-700';
      case 'ekadashi':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'navratri':
        return 'bg-pink-50 border-pink-200 text-pink-700';
      case 'karva-chauth':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className={`rounded-lg border p-2 ${getFastingColor(meal.fastingType)}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-sm">
            {meal.name}
          </h4>
          <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
            <Clock className="w-3 h-3" />
            <span>{meal.duration.start} - {meal.duration.end}</span>
          </div>
        </div>
        <Droplet className="w-4 h-4 opacity-70" />
      </div>
      
      {meal.allowedFoods && meal.allowedFoods.length > 0 && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-1">
            {meal.allowedFoods.map((food) => (
              <span 
                key={food}
                className="px-1.5 py-0.5 rounded-full bg-white/50 text-[10px] font-medium"
              >
                {food}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 