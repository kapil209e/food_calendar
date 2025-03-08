import { Meal, MealType } from '../lib/meals/types';

interface HealthScorecardProps {
  meal: Meal;
}

const calculateHealthScore = (meal: Meal) => {
  let score = 0;
  
  // Protein to Carb ratio (30% of score)
  // For Indian meals, ideal ratio is around 1:5 to 1:6
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
  const ingredients = meal.ingredients || [];
  
  // Check for protein sources
  if (ingredients.some(i => ['dal', 'lentils', 'beans', 'paneer', 'yogurt', 'curd'].some(p => i.toLowerCase().includes(p)))) {
    balanceScore += 0.5;
  }
  
  // Check for whole grains
  if (ingredients.some(i => ['whole wheat', 'brown rice', 'millet', 'quinoa', 'oats'].some(g => i.toLowerCase().includes(g)))) {
    balanceScore += 0.5;
  }
  
  // Check for vegetables
  if (ingredients.some(i => ['vegetables', 'greens', 'spinach', 'methi', 'palak'].some(v => i.toLowerCase().includes(v)))) {
    balanceScore += 0.5;
  }
  
  // Check for healthy fats
  if (ingredients.some(i => ['ghee', 'olive oil', 'coconut', 'nuts', 'seeds'].some(f => i.toLowerCase().includes(f)))) {
    balanceScore += 0.5;
  }

  score += ((tagScore + balanceScore) / 4) * 0.4;

  return Math.round(score * 10) / 10; // Score out of 10, rounded to 1 decimal
};

const getScoreColor = (score: number) => {
  if (score >= 7) return 'bg-emerald-500';
  if (score >= 5) return 'bg-yellow-500';
  return 'bg-red-500';
};

export function HealthScorecard({ meal }: HealthScorecardProps) {
  const score = calculateHealthScore(meal);
  const scoreColor = getScoreColor(score);
  const scoreWidth = `${score * 10}%`;

  return (
    <div className="w-full mt-1">
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${scoreColor} transition-all duration-300 ease-out`}
          style={{ width: scoreWidth }}
        />
      </div>
    </div>
  );
} 