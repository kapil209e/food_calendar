import { useState, useEffect } from 'react';
import { Meal } from '../meals/types';
import { DAYS_OF_WEEK, MEAL_TYPES, DayOfWeek, MealType } from '../constants';

export type WeeklyPlan = {
  weekId: string;
  startDate: string;
  meals: {
    [K in DayOfWeek]: {
      [M in MealType]: Meal | null;
    };
  };
  metadata: {
    created: string;
    modified: string;
  };
};

export type WeeklyPlans = {
  [weekId: string]: WeeklyPlan;
};

const STORAGE_KEY = 'mealPlanner_weeklyPlans';

export function useWeeklyPlans() {
  const [currentWeekId, setCurrentWeekId] = useState<string>(() => {
    // Get current week's Monday as weekId
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday.toISOString().split('T')[0];
  });

  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlans>({});

  // Load plans from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setWeeklyPlans(parsed);
      } catch (error) {
        console.error('Failed to parse stored weekly plans:', error);
      }
    }
  }, []);

  // Save plans to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(weeklyPlans).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(weeklyPlans));
    }
  }, [weeklyPlans]);

  const navigateWeek = (weekId: string) => {
    setCurrentWeekId(weekId);
  };

  const getCurrentWeekPlan = (): WeeklyPlan => {
    if (!weeklyPlans[currentWeekId]) {
      // Initialize new week plan
      const newPlan: WeeklyPlan = {
        weekId: currentWeekId,
        startDate: currentWeekId,
        meals: DAYS_OF_WEEK.reduce((acc: WeeklyPlan['meals'], day: DayOfWeek) => {
          acc[day] = MEAL_TYPES.reduce((mealAcc: { [key in MealType]: Meal | null }, type: MealType) => {
            mealAcc[type] = null;
            return mealAcc;
          }, {} as { [key in MealType]: Meal | null });
          return acc;
        }, {} as WeeklyPlan['meals']),
        metadata: {
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
        },
      };
      setWeeklyPlans(prev => ({ ...prev, [currentWeekId]: newPlan }));
      return newPlan;
    }
    return weeklyPlans[currentWeekId];
  };

  const updateMeal = (day: DayOfWeek, mealType: MealType, meal: Meal | null) => {
    setWeeklyPlans(prev => {
      const currentPlan = prev[currentWeekId] || getCurrentWeekPlan();
      return {
        ...prev,
        [currentWeekId]: {
          ...currentPlan,
          meals: {
            ...currentPlan.meals,
            [day]: {
              ...currentPlan.meals[day],
              [mealType]: meal,
            },
          },
          metadata: {
            ...currentPlan.metadata,
            modified: new Date().toISOString(),
          },
        },
      };
    });
  };

  const copyDay = (fromDay: DayOfWeek, toDay: DayOfWeek) => {
    const currentPlan = weeklyPlans[currentWeekId];
    if (!currentPlan) return;

    setWeeklyPlans(prev => ({
      ...prev,
      [currentWeekId]: {
        ...currentPlan,
        meals: {
          ...currentPlan.meals,
          [toDay]: { ...currentPlan.meals[fromDay] },
        },
        metadata: {
          ...currentPlan.metadata,
          modified: new Date().toISOString(),
        },
      },
    }));
  };

  const copyWeek = (fromWeekId: string) => {
    const fromPlan = weeklyPlans[fromWeekId];
    if (!fromPlan) return;

    setWeeklyPlans(prev => ({
      ...prev,
      [currentWeekId]: {
        ...fromPlan,
        weekId: currentWeekId,
        startDate: currentWeekId,
        metadata: {
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
        },
      },
    }));
  };

  return {
    currentWeekId,
    weeklyPlans,
    currentPlan: getCurrentWeekPlan(),
    navigateWeek,
    updateMeal,
    copyDay,
    copyWeek,
  };
} 