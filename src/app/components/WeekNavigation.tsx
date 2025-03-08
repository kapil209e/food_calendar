import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, addWeeks, subWeeks } from 'date-fns';

interface WeekNavigationProps {
  currentWeekId: string;
  onNavigate: (weekId: string) => void;
}

export function WeekNavigation({ currentWeekId, onNavigate }: WeekNavigationProps) {
  const currentDate = parseISO(currentWeekId);
  const weekStart = format(currentDate, 'MMM d');
  const weekEnd = format(addWeeks(currentDate, 1), 'MMM d');
  const isCurrentWeek = format(new Date(), 'yyyy-MM-dd') === currentWeekId;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-2">
        <button
          onClick={() => onNavigate(format(subWeeks(currentDate, 1), 'yyyy-MM-dd'))}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Previous week"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigate(format(new Date(), 'yyyy-MM-dd'))}
          className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
            isCurrentWeek 
              ? 'bg-emerald-100 text-emerald-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => onNavigate(format(addWeeks(currentDate, 1), 'yyyy-MM-dd'))}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Next week"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-900">
          {weekStart} - {weekEnd}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {format(currentDate, 'yyyy')}
        </div>
      </div>
    </div>
  );
} 