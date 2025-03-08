'use client';

import { useState, useEffect } from 'react';
import { Meal, MealPreferences, MealType } from '../lib/meals/types';
import { X, Sparkles } from 'lucide-react';

interface MealSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (meal: Meal) => void;
  mealType: MealType;
  day: string;
}

const defaultPreferences: MealPreferences = {
  isVegetarian: true,
  hasOnionGarlic: true,
  cookingMedium: ['ghee', 'oil'],
  spiceLevel: 'medium',
};

export default function MealSelectionModal({
  isOpen,
  onClose,
  onSelect,
  mealType,
  day,
}: MealSelectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Meal[]>([]);
  const [error, setError] = useState('');
  const [useAI, setUseAI] = useState(true);

  async function generateSuggestions() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/meals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealType,
          preferences: defaultPreferences,
          useAI,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meals');
      }

      setSuggestions(data.meals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  }

  // Generate suggestions when modal opens or when AI toggle changes
  useEffect(() => {
    if (isOpen) {
      generateSuggestions();
    }
  }, [isOpen, useAI]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Select {mealType} for {day}
          </h2>
          <button
            onClick={() => setUseAI(!useAI)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              useAI 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Sparkles size={16} />
            AI Suggestions {useAI ? 'On' : 'Off'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {useAI ? 'Generating AI suggestions...' : 'Loading suggestions...'}
              </p>
            </div>
          ) : (
            <>
              {suggestions.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No meals found matching your preferences. Try adjusting your preferences or enabling AI suggestions.
                </div>
              ) : (
                suggestions.map((meal) => (
                  <div
                    key={meal.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      onSelect(meal);
                      onClose();
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{meal.name}</h3>
                      {meal.id.startsWith('ai-') && (
                        <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                          <Sparkles size={12} />
                          AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{meal.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        {meal.cookingTime} mins
                      </span>
                      <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        {meal.region}
                      </span>
                      <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        {meal.spiceLevel}
                      </span>
                    </div>
                    {meal.healthTags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {meal.healthTags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={generateSuggestions}
            disabled={loading}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? 'Generating...' : 'Generate More Suggestions'}
          </button>
          
          <div className="text-sm text-gray-500">
            {suggestions.length > 0 && `${suggestions.length} suggestions available`}
          </div>
        </div>
      </div>
    </div>
  );
} 