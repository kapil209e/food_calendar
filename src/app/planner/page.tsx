'use client';

import { useState } from 'react';
import Header from "../components/Header";
import { Plus } from "lucide-react";
import MealSelectionModal from '../components/MealSelectionModal';
import { Meal, MealType } from '../lib/meals/types';

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"] as const;

type DayOfWeek = typeof DAYS_OF_WEEK[number];
type MealTypeKey = typeof MEAL_TYPES[number];

type SelectedMeals = {
  [K in DayOfWeek]: {
    [M in MealTypeKey]: Meal | null;
  };
};

const initialSelectedMeals: SelectedMeals = DAYS_OF_WEEK.reduce((acc, day) => {
  acc[day] = {
    Breakfast: null,
    Lunch: null,
    Dinner: null,
  };
  return acc;
}, {} as SelectedMeals);

export default function PlannerPage() {
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeals>(initialSelectedMeals);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [selectedType, setSelectedType] = useState<MealType | null>(null);

  const handleCellClick = (day: DayOfWeek, type: MealTypeKey) => {
    setSelectedDay(day);
    setSelectedType(type.toLowerCase() as MealType);
    setModalOpen(true);
  };

  const handleMealSelect = (meal: Meal) => {
    if (selectedDay && selectedType) {
      setSelectedMeals(prev => ({
        ...prev,
        [selectedDay]: {
          ...prev[selectedDay],
          [selectedType.charAt(0).toUpperCase() + selectedType.slice(1) as MealTypeKey]: meal
        }
      }));
    }
  };

  return (
    <>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Meal Planner</h1>
          <button 
            onClick={() => {
              setSelectedDay("Monday");
              setSelectedType("breakfast");
              setModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Meal
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-8 border-b">
            <div className="p-4 font-semibold text-gray-500 border-r">
              Meals
            </div>
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="p-4 font-semibold text-center">
                {day}
              </div>
            ))}
          </div>

          {MEAL_TYPES.map((mealType) => (
            <div key={mealType} className="grid grid-cols-8 border-b last:border-b-0">
              <div className="p-4 font-medium text-gray-600 border-r bg-gray-50">
                {mealType}
              </div>
              {DAYS_OF_WEEK.map((day) => {
                const selectedMeal = selectedMeals[day][mealType];
                return (
                  <div
                    key={`${mealType}-${day}`}
                    className="p-4 min-h-[100px] border-r last:border-r-0 hover:bg-gray-50 transition-colors"
                  >
                    {selectedMeal ? (
                      <div className="h-full">
                        <h3 className="font-medium text-sm">{selectedMeal.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{selectedMeal.description}</p>
                        <button 
                          onClick={() => handleCellClick(day, mealType)}
                          className="mt-2 text-xs text-emerald-600 hover:text-emerald-700"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleCellClick(day, mealType)}
                        className="w-full h-full flex items-center justify-center text-gray-400 hover:text-emerald-600"
                      >
                        <Plus size={20} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {modalOpen && selectedDay && selectedType && (
        <MealSelectionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={handleMealSelect}
          mealType={selectedType}
          day={selectedDay}
        />
      )}
    </>
  );
} 