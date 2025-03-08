'use client';

import { useState } from 'react';
import { MealPreferences, Meal } from '../lib/meals/types';
import Header from '../components/Header';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string>('');

  const testPreferences: MealPreferences = {
    isVegetarian: true,
    hasOnionGarlic: true,
    cookingMedium: ['ghee'],
    spiceLevel: 'medium',
    region: ['north'],
    healthPreferences: ['protein-rich']
  };

  async function generateTest() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/meals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealType: 'breakfast',
          preferences: testPreferences
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meals');
      }

      setMeals(data.meals);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Test Meal Generation</h1>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Test Preferences:</h2>
          <ul className="space-y-1 text-sm">
            <li>• Vegetarian: {testPreferences.isVegetarian ? 'Yes' : 'No'}</li>
            <li>• Onion/Garlic: {testPreferences.hasOnionGarlic ? 'Yes' : 'No'}</li>
            <li>• Cooking Medium: {testPreferences.cookingMedium.join(', ')}</li>
            <li>• Spice Level: {testPreferences.spiceLevel}</li>
            <li>• Region: {testPreferences.region?.join(', ')}</li>
            <li>• Health Tags: {testPreferences.healthPreferences?.join(', ')}</li>
          </ul>
        </div>

        <button
          onClick={generateTest}
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Test Meals'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {meals.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Generated Meals:</h2>
            <div className="space-y-4">
              {meals.map((meal, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg">{meal.name}</h3>
                  <p className="text-gray-600 mt-1">{meal.description}</p>
                  <div className="mt-2">
                    <span className="text-sm font-medium">Region:</span>{' '}
                    <span className="text-gray-600">{meal.region}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-medium">Cooking Time:</span>{' '}
                    <span className="text-gray-600">{meal.cookingTime} minutes</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-medium">Ingredients:</span>
                    <div className="text-gray-600 text-sm mt-1">
                      {meal.ingredients.join(', ')}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-medium">Health Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {meal.healthTags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {meal.accompaniments && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Suggested Accompaniments:</span>
                      <div className="text-gray-600 text-sm mt-1">
                        {meal.accompaniments.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
} 