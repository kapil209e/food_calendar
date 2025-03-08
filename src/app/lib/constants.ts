export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const;

export const MEAL_TYPES = [
  'breakfast',
  'lunch',
  'dinner'
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];
export type MealType = typeof MEAL_TYPES[number]; 