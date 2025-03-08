export type Region = 'north' | 'south' | 'east' | 'west';
export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type SpiceLevel = 'mild' | 'medium' | 'spicy';
export type CookingMedium = 'ghee' | 'oil' | 'both';

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