export type Region = 'north' | 'south' | 'east' | 'west';
export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type SpiceLevel = 'mild' | 'medium' | 'spicy';
export type CookingMedium = 'ghee' | 'oil' | 'both';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type FastingType = 
  | 'water-fast' 
  | 'fruit-fast'
  | 'liquid-fast' 
  | 'ekadashi' 
  | 'navratri'
  | 'karva-chauth';

export interface MealPreferences {
  isVegetarian: boolean;
  hasOnionGarlic: boolean;
  cookingMedium: CookingMedium[];
  spiceLevel: SpiceLevel;
  region?: Region[];
  healthPreferences?: string[];
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  description: string;
  region: Region;
  ingredients: string[];
  cookingTime: number; // in minutes
  spiceLevel: SpiceLevel;
  cookingMedium: CookingMedium[];
  isVegetarian: boolean;
  hasOnionGarlic: boolean;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  healthTags: string[];
  accompaniments?: string[]; // suggested side dishes
  alternatives?: string[]; // similar dishes
}

export interface FastingMeal extends Omit<Meal, 'ingredients' | 'cookingTime' | 'cookingMedium' | 'spiceLevel'> {
  id: string;
  type: MealType;
  name: string;
  fastingType: FastingType;
  description: string;
  allowedFoods?: string[];
  duration: {
    start: string; // Time in 24hr format, e.g., "06:00"
    end: string;   // Time in 24hr format, e.g., "18:00"
  };
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthTags: string[];
  benefits: string[];
  precautions?: string[];
  isFasting: true;
}

export type MealOrFasting = Meal | FastingMeal;

export interface WeeklyPlan {
  id: string;
  meals: Record<DayOfWeek, Record<MealType, MealOrFasting | null>>;
} 