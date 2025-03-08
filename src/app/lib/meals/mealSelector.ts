import { Meal, MealPreferences, MealType } from './types';
import { sampleMeals } from './aiMealGenerator';
import { generateMultipleMeals } from './aiMealGenerator';

// Use sample meals as the database
const mealDatabase: Record<MealType, Meal[]> = sampleMeals;

export function filterMealsByPreferences(
  meals: Meal[],
  preferences: MealPreferences
): Meal[] {
  return meals.filter(meal => {
    // Must match vegetarian preference
    if (meal.isVegetarian !== preferences.isVegetarian) {
      return false;
    }

    // Must match onion/garlic preference
    if (meal.hasOnionGarlic !== preferences.hasOnionGarlic) {
      return false;
    }

    // Must have at least one matching cooking medium
    if (!meal.cookingMedium.some(medium => 
      preferences.cookingMedium.includes(medium)
    )) {
      return false;
    }

    // Check spice level
    if (meal.spiceLevel !== preferences.spiceLevel) {
      return false;
    }

    // If regions are specified, must match at least one
    if (preferences.region && preferences.region.length > 0) {
      if (!preferences.region.includes(meal.region)) {
        return false;
      }
    }

    // If health preferences are specified, must match at least one
    if (preferences.healthPreferences && preferences.healthPreferences.length > 0) {
      if (!meal.healthTags.some(tag => 
        preferences.healthPreferences?.includes(tag)
      )) {
        return false;
      }
    }

    return true;
  });
}

export async function getRandomMeals(
  mealType: MealType,
  preferences: MealPreferences,
  count: number = 3,
  useAI: boolean = true
): Promise<Meal[]> {
  console.log('getRandomMeals called with:', { mealType, preferences, count, useAI });

  // Ensure mealType is lowercase
  const normalizedMealType = mealType.toLowerCase() as MealType;
  console.log('Normalized meal type:', normalizedMealType);

  // Get meals of the specified type from database
  const mealsOfType = mealDatabase[normalizedMealType];
  console.log(`Found ${mealsOfType?.length || 0} ${normalizedMealType} meals in database`);
  
  if (!mealsOfType || mealsOfType.length === 0) {
    console.log('No meals found in database for type:', normalizedMealType);
    // Try AI generation if no meals found
    if (useAI) {
      console.log('Attempting AI generation due to no meals in database');
      return generateMultipleMeals(normalizedMealType, count);
    }
    return [];
  }

  // Filter by preferences
  const filteredMeals = filterMealsByPreferences(mealsOfType, preferences);
  console.log(`${filteredMeals.length} meals match preferences`);

  // If we have enough meals in the database and AI is not requested
  if (filteredMeals.length >= count && !useAI) {
    console.log('Using database meals only');
    const selectedMeals: Meal[] = [];
    const availableMeals = [...filteredMeals];

    while (selectedMeals.length < count && availableMeals.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMeals.length);
      selectedMeals.push(availableMeals[randomIndex]);
      availableMeals.splice(randomIndex, 1);
    }

    console.log(`Returning ${selectedMeals.length} database meals`);
    return selectedMeals;
  }

  // If AI is requested or we don't have enough meals, try AI generation
  if (useAI) {
    console.log('Attempting AI meal generation');
    try {
      const aiMeals = await generateMultipleMeals(
        normalizedMealType,
        count,
        preferences.region?.[0]
      );
      console.log(`Generated ${aiMeals.length} AI meals`);

      // If AI generation was successful, return AI meals
      if (aiMeals.length > 0) {
        return aiMeals;
      }
    } catch (error) {
      console.error('AI meal generation failed:', error);
      // Continue to fallback logic
    }
  }

  // Fallback: return whatever we have from the database
  console.log('Falling back to database meals');
  const fallbackMeals = filteredMeals.slice(0, count);
  console.log(`Returning ${fallbackMeals.length} fallback meals`);
  return fallbackMeals;
}

// Helper function to get meal suggestions for multiple days
export async function generateWeeklyMealPlan(preferences: MealPreferences) {
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const plan = [];
  for (const day of daysOfWeek) {
    const dayMeals = [];
    for (const type of mealTypes) {
      const suggestions = await getRandomMeals(type, preferences, 3);
      dayMeals.push({ type, suggestions });
    }
    plan.push({ day, meals: dayMeals });
  }
  
  return plan;
} 