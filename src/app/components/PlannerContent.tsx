'use client';

import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { MealType, MealOrFasting } from '../lib/meals/types';
import { Sparkles } from 'lucide-react';
import MealSelectionModal from './MealSelectionModal';
import { HealthScorecard } from './HealthScorecard';
import { FastingCell } from './FastingCell';
import { WeeklyStats } from './WeeklyStats';
import { WeekNavigation } from './WeekNavigation';
import { useMealPlan } from '../lib/hooks/useMealPlan';
import { useAuth } from '../../lib/hooks/useAuth';
import SignIn from '../../components/SignIn';
import Header from './Header';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

export default function PlannerContent() {
  const { user } = useAuth();
  const { mealPlan, loading, updateMeal } = useMealPlan();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<string[]>(Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }));

  const handleMealSelect = async (meal: MealOrFasting) => {
    if (selectedDay && selectedMealType) {
      await updateMeal(selectedDay, selectedMealType, meal);
    }
    setIsModalOpen(false);
  };

  const handleMealRemove = async (day: string, mealType: MealType) => {
    await updateMeal(day, mealType, undefined);
  };

  const handleMealCopy = async (day: string, mealType: MealType, meal: MealOrFasting) => {
    const nextDay = format(addDays(new Date(day), 1), 'yyyy-MM-dd');
    if (dates.includes(nextDay)) {
      await updateMeal(nextDay, mealType, meal);
    }
  };

  if (!user) {
    return <SignIn />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-gray-600">Loading your meal plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <WeekNavigation 
                currentWeekId={dates[0]} 
                onNavigate={(weekId) => {
                  const newDates = Array.from({ length: 7 }, (_, i) => {
                    const date = addDays(new Date(weekId), i);
                    return format(date, 'yyyy-MM-dd');
                  });
                  setDates(newDates);
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <WeeklyStats meals={mealPlan} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"></th>
                      {dates.map((date) => {
                        const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                        return (
                          <th 
                            key={date} 
                            className={`px-6 py-3 text-center ${
                              isToday ? 'bg-emerald-50' : 'bg-gray-50'
                            }`}
                          >
                            <div className={`text-sm font-semibold ${
                              isToday ? 'text-emerald-700' : 'text-gray-900'
                            }`}>
                              {format(new Date(date), 'EEEE')}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {format(new Date(date), 'MMM d')}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {MEAL_TYPES.map((mealType, index) => (
                      <tr key={mealType} className={index % 2 === 0 ? 'bg-gray-50/50' : ''}>
                        <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize border-r border-gray-100">
                          {mealType}
                        </td>
                        {dates.map((date) => {
                          const meal = mealPlan[date]?.[mealType];
                          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                          return (
                            <td key={date} className={`px-4 py-4 ${isToday ? 'bg-emerald-50/30' : ''}`}>
                              {meal ? (
                                <div className="relative min-h-[120px] p-4 rounded-lg border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all group bg-white">
                                  {'isFasting' in meal ? (
                                    <FastingCell meal={meal} />
                                  ) : (
                                    <>
                                      <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                                          {meal.name}
                                          {meal.id.startsWith('ai-') && (
                                            <Sparkles className="inline-block w-4 h-4 ml-1 text-amber-500" />
                                          )}
                                        </h3>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={() => handleMealCopy(date, mealType, meal)}
                                            className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                                            title="Copy to next day"
                                          >
                                            📋
                                          </button>
                                          <button
                                            onClick={() => handleMealRemove(date, mealType)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            title="Remove meal"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <HealthScorecard meal={meal} />
                                      </div>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedDay(date);
                                    setSelectedMealType(mealType);
                                    setIsModalOpen(true);
                                  }}
                                  className="w-full min-h-[120px] p-4 rounded-lg border border-dashed border-gray-200 hover:border-emerald-500 hover:shadow-md hover:bg-emerald-50/50 transition-all text-gray-400 hover:text-emerald-600 bg-white"
                                >
                                  + Add {mealType}
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <MealSelectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelectMeal={handleMealSelect}
            day={selectedDay || ''}
            mealType={selectedMealType || 'breakfast'}
          />
        </div>
      </div>
    </main>
  );
} 