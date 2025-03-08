'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Meal, MealOrFasting, FastingMeal, MealType } from '../lib/meals/types';
import { sampleMeals, sampleFastingMeals } from '../lib/meals/aiMealGenerator';
import { X, Utensils, Droplet, RefreshCw } from 'lucide-react';

interface MealSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMeal: (meal: MealOrFasting) => void;
  day: string;
  mealType: MealType;
}

type Tab = 'meals' | 'fasting';

export default function MealSelectionModal({
  isOpen,
  onClose,
  onSelectMeal,
  day,
  mealType,
}: MealSelectionModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('meals');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);

  // Load initial meals when modal opens
  useEffect(() => {
    if (isOpen) {
      regenerateMeals();
    }
  }, [isOpen, mealType]);

  // Get meals for the current meal type
  const mealsForType = meals.length > 0 ? meals : [];
  
  const regularMeals = mealsForType.filter((meal: Meal) => 
    searchTerm === '' || 
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fastingOptions = sampleFastingMeals.filter((meal: FastingMeal) =>
    searchTerm === '' || 
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const regenerateMeals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/meals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealType: mealType,
          preferences: {
            isVegetarian: true,
            hasOnionGarlic: true,
            cookingMedium: ['oil', 'ghee'],
            spiceLevel: 'medium',
            region: [],
            healthPreferences: []
          },
          useAI: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }

      const data = await response.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.error('Error regenerating meals:', error);
      // Fallback to sample meals if API fails
      setMeals(sampleMeals[mealType] || []);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="relative bg-white rounded-lg max-w-2xl w-full mx-4 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Select {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('meals')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === 'meals'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Utensils className="h-4 w-4 mr-2" />
                Meals
              </button>
              <button
                onClick={() => setActiveTab('fasting')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === 'fasting'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Droplet className="h-4 w-4 mr-2" />
                Fasting
              </button>
            </div>

            {/* Search and Refresh */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={regenerateMeals}
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Meal List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activeTab === 'meals' ? (
                regularMeals.length > 0 ? (
                  regularMeals.map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() => {
                        onSelectMeal(meal);
                        onClose();
                      }}
                      className="w-full p-4 text-left border rounded-lg hover:border-emerald-500 hover:shadow-md transition-all group"
                    >
                      <h3 className="font-medium text-gray-900 group-hover:text-emerald-600">
                        {meal.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {meal.description}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No meals found. Try regenerating or adjusting your search.
                  </p>
                )
              ) : (
                fastingOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onSelectMeal(option);
                      onClose();
                    }}
                    className="w-full p-4 text-left border rounded-lg hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-emerald-600">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {option.description}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 