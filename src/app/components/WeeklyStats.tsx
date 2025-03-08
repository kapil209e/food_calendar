import { MealOrFasting, MealType } from '../lib/meals/types';
import { MEAL_TYPES } from '../lib/constants';
import { BarChart, Utensils, Scale, Heart } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface WeeklyStatsProps {
  meals: Record<string, Record<MealType, MealOrFasting | null>>;
}

interface DailyStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number;
}

export function WeeklyStats({ meals }: WeeklyStatsProps) {
  // Calculate stats
  const stats = [
    {
      name: 'Daily Calories',
      icon: BarChart,
      value: '2,100',
      change: '+4.75%',
      changeType: 'increase'
    },
    {
      name: 'Macro Balance',
      icon: Scale,
      value: 'Balanced',
      subtext: 'Protein: 25% | Carbs: 50% | Fat: 25%'
    },
    {
      name: 'Cuisine Mix',
      icon: Utensils,
      value: '4 Types',
      subtext: 'Indian, Italian, Mexican, Japanese'
    },
    {
      name: 'Health Score',
      icon: Heart,
      value: '8.5/10',
      change: '+0.5',
      changeType: 'increase'
    }
  ];

  return (
    <>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Icon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-900">{stat.name}</h3>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                {stat.change && (
                  <p className={`ml-2 text-sm ${
                    stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                )}
              </div>
              {stat.subtext && (
                <p className="mt-1 text-sm text-gray-500">{stat.subtext}</p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

// Helper function to calculate health score (reuse from HealthScorecard)
function calculateHealthScore(meal: MealOrFasting): number {
  let score = 0;
  
  // Protein to Carb ratio (30% of score)
  const proteinCarbRatio = meal.protein / meal.carbs;
  const idealRatioScore = Math.min(3, Math.max(0, 3 - Math.abs(proteinCarbRatio - 0.18) * 4));
  score += idealRatioScore * 0.3;

  // Calorie balance (30% of score)
  const calorieScore = (() => {
    const idealRange = {
      breakfast: { min: 300, max: 500 },
      lunch: { min: 500, max: 700 },
      dinner: { min: 400, max: 600 }
    }[meal.type] || { min: 400, max: 600 };

    if (meal.calories < idealRange.min) {
      return 3 * (meal.calories / idealRange.min);
    } else if (meal.calories > idealRange.max) {
      return 3 * (idealRange.max / meal.calories);
    }
    return 3;
  })();
  score += calorieScore * 0.3;

  // Health tags and ingredients (40% of score)
  const healthyTags = [
    'protein-rich',     // Protein content
    'high-fiber',       // Fiber content
    'whole-grain',      // Whole grains
    'fermented',        // Fermented foods
    'probiotic',        // Probiotic benefits
    'low-fat',          // Low fat content
    'gluten-free',      // Gluten-free options
    'antioxidant-rich', // Spices and herbs
    'balanced-meal',    // Complete meal
    'vegetable-rich'    // Contains vegetables
  ];
  
  // Calculate tag score (up to 2 points)
  const tagScore = Math.min(2, (meal.healthTags?.filter(tag => healthyTags.includes(tag)).length || 0) / 2);
  
  // Additional points for balanced combinations (up to 2 points)
  let balanceScore = 0;
  
  // Only check ingredients for regular meals, not fasting meals
  if (!('isFasting' in meal)) {
    const ingredients = meal.ingredients || [];
    
    // Check for protein sources
    if (ingredients.some((i: string) => ['dal', 'lentils', 'beans', 'paneer', 'yogurt', 'curd'].some(p => i.toLowerCase().includes(p)))) {
      balanceScore += 0.5;
    }
    
    // Check for whole grains
    if (ingredients.some((i: string) => ['whole wheat', 'brown rice', 'millet', 'quinoa', 'oats'].some(g => i.toLowerCase().includes(g)))) {
      balanceScore += 0.5;
    }
    
    // Check for vegetables
    if (ingredients.some((i: string) => ['vegetables', 'greens', 'spinach', 'methi', 'palak'].some(v => i.toLowerCase().includes(v)))) {
      balanceScore += 0.5;
    }
    
    // Check for healthy fats
    if (ingredients.some((i: string) => ['ghee', 'olive oil', 'coconut', 'nuts', 'seeds'].some(f => i.toLowerCase().includes(f)))) {
      balanceScore += 0.5;
    }
  }

  score += ((tagScore + balanceScore) / 4) * 0.4;

  return Math.round(score * 10) / 10; // Score out of 10, rounded to 1 decimal
} 