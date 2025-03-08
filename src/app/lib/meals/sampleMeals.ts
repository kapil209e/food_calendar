import { FastingMeal, Meal } from './types';

export const sampleMeals: Meal[] = [
  {
    id: 'meal-1',
    type: 'breakfast',
    name: 'Masala Dosa',
    description: 'Crispy fermented rice crepe served with spiced potato filling and chutneys',
    region: 'south',
    ingredients: ['rice', 'urad dal', 'potato', 'spices', 'coconut'],
    cookingTime: 30,
    spiceLevel: 'medium',
    cookingMedium: ['oil'],
    isVegetarian: true,
    hasOnionGarlic: true,
    calories: 350,
    protein: 8,
    carbs: 45,
    fat: 12,
    healthTags: ['fermented', 'protein-rich', 'traditional'],
    accompaniments: ['coconut chutney', 'sambar'],
    alternatives: ['plain dosa', 'rava dosa']
  },
  {
    id: 'meal-2',
    type: 'breakfast',
    name: 'Oats Upma',
    description: 'Healthy savory oats preparation with vegetables and mild spices',
    region: 'south',
    ingredients: ['oats', 'mixed vegetables', 'spices', 'nuts'],
    cookingTime: 15,
    spiceLevel: 'mild',
    cookingMedium: ['oil'],
    isVegetarian: true,
    hasOnionGarlic: true,
    calories: 250,
    protein: 10,
    carbs: 35,
    fat: 8,
    healthTags: ['high-fiber', 'protein-rich', 'quick-cooking'],
    accompaniments: ['coconut chutney'],
    alternatives: ['quinoa upma', 'daliya upma']
  },
  {
    id: 'meal-3',
    type: 'breakfast',
    name: 'Paneer Paratha',
    description: 'Whole wheat flatbread stuffed with spiced cottage cheese',
    region: 'north',
    ingredients: ['whole wheat flour', 'paneer', 'spices', 'herbs'],
    cookingTime: 25,
    spiceLevel: 'medium',
    cookingMedium: ['ghee'],
    isVegetarian: true,
    hasOnionGarlic: true,
    calories: 400,
    protein: 15,
    carbs: 48,
    fat: 14,
    healthTags: ['protein-rich', 'high-fiber'],
    accompaniments: ['yogurt', 'pickle'],
    alternatives: ['aloo paratha', 'gobi paratha']
  }
];

export const sampleFastingMeals: FastingMeal[] = [
  {
    id: 'fast-1',
    type: 'breakfast',
    name: 'Ekadashi Fast',
    fastingType: 'ekadashi',
    description: 'Traditional Ekadashi fasting following Vedic customs',
    allowedFoods: ['fruits', 'water', 'milk', 'nuts'],
    duration: {
      start: '00:00',
      end: '24:00'
    },
    calories: 200,
    protein: 5,
    carbs: 25,
    fat: 8,
    healthTags: ['spiritual', 'detox', 'mindful-eating'],
    benefits: [
      'Spiritual cleansing',
      'Digestive system rest',
      'Mental clarity'
    ],
    precautions: ['Stay hydrated', 'Avoid heavy physical activity'],
    isFasting: true,
    region: 'north',
    isVegetarian: true,
    hasOnionGarlic: false
  },
  {
    id: 'fast-2',
    type: 'breakfast',
    name: 'Fruit Fast',
    fastingType: 'fruit-fast',
    description: 'A gentle fast consisting of only fruits and fresh juices',
    allowedFoods: ['all fruits', 'fresh juices', 'coconut water'],
    duration: {
      start: '06:00',
      end: '18:00'
    },
    calories: 300,
    protein: 3,
    carbs: 40,
    fat: 2,
    healthTags: ['detox', 'antioxidant-rich', 'natural-sugars'],
    benefits: [
      'Digestive cleanse',
      'Antioxidant boost',
      'Natural hydration'
    ],
    precautions: ['Monitor blood sugar levels'],
    isFasting: true,
    region: 'south',
    isVegetarian: true,
    hasOnionGarlic: false
  },
  {
    id: 'fast-3',
    type: 'breakfast',
    name: 'Navratri Fast',
    fastingType: 'navratri',
    description: 'Traditional Navratri fasting with specific allowed foods',
    allowedFoods: ['kuttu atta', 'sabudana', 'potato', 'sendha namak'],
    duration: {
      start: '00:00',
      end: '24:00'
    },
    calories: 400,
    protein: 8,
    carbs: 45,
    fat: 12,
    healthTags: ['spiritual', 'traditional', 'sattvic'],
    benefits: [
      'Spiritual connection',
      'Body detoxification',
      'Traditional wisdom'
    ],
    precautions: ['Use only fasting-approved ingredients'],
    isFasting: true,
    region: 'north',
    isVegetarian: true,
    hasOnionGarlic: false
  },
  {
    id: 'fast-4',
    type: 'breakfast',
    name: 'Water Fast',
    fastingType: 'water-fast',
    description: 'Intermittent water fasting for detoxification',
    allowedFoods: ['water', 'herbal tea'],
    duration: {
      start: '20:00',
      end: '12:00'
    },
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    healthTags: ['detox', 'autophagy', 'reset'],
    benefits: [
      'Cellular repair',
      'Mental clarity',
      'Digestive rest'
    ],
    precautions: ['Not suitable for everyone', 'Consult healthcare provider'],
    isFasting: true,
    region: 'west',
    isVegetarian: true,
    hasOnionGarlic: false
  }
];

// Add fasting meals to available meals
export const availableMeals = [...sampleMeals, ...sampleFastingMeals]; 