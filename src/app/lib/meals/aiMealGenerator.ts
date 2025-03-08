import { HfInference } from '@huggingface/inference';
import { Meal, MealType, Region, SpiceLevel, CookingMedium } from './types';
import { v4 as uuidv4 } from 'uuid';

// Check if API key is available
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
if (!HUGGINGFACE_API_KEY) {
  console.error('HUGGINGFACE_API_KEY is not set in environment variables');
}

const hf = new HfInference(HUGGINGFACE_API_KEY);

// Using a more reliable model for structured text generation
const MODEL_NAME = "tiiuae/falcon-7b-instruct";

// Track used meal names to prevent duplicates
const usedMealNames = new Set<string>();

// Reset used meals when switching meal types
function resetUsedMeals() {
  usedMealNames.clear();
}

function generatePrompt(mealType: MealType, region?: Region) {
  return `You are a helpful AI assistant that generates authentic Indian recipes. Generate a detailed Indian ${mealType} recipe${region ? ` from ${region} India` : ''}.

The response should be in this exact JSON format:
{
  "name": "Name of the dish (authentic Indian name)",
  "description": "Brief description under 100 characters",
  "region": "${region || 'north'}", 
  "ingredients": ["ingredient1", "ingredient2", ...],
  "cookingTime": number_in_minutes,
  "spiceLevel": "mild/medium/spicy",
  "cookingMedium": ["ghee" and/or "oil"],
  "isVegetarian": true_or_false,
  "hasOnionGarlic": true_or_false,
  "calories": number,
  "protein": number_in_grams,
  "carbs": number_in_grams,
  "fat": number_in_grams,
  "healthTags": ["tag1", "tag2", ...],
  "accompaniments": ["item1", "item2", ...],
  "alternatives": ["similar_dish1", "similar_dish2", ...]
}

Ensure the response is ONLY the JSON object, with no additional text. Make it an authentic Indian dish with accurate nutritional information and regional characteristics.`;
}

export const sampleMeals: Record<MealType, Meal[]> = {
  breakfast: [
    {
      id: `ai-${uuidv4()}`,
      type: 'breakfast',
      name: 'Masala Dosa',
      description: 'Crispy rice and lentil crepe filled with spiced potato filling',
      region: 'south',
      ingredients: ['rice', 'urad dal', 'potatoes', 'onions', 'spices'],
      cookingTime: 30,
      spiceLevel: 'medium',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 250,
      protein: 6,
      carbs: 45,
      fat: 8,
      healthTags: ['protein-rich', 'fermented', 'gluten-free'],
      accompaniments: ['coconut chutney', 'sambar'],
      alternatives: ['plain dosa', 'rava dosa']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'breakfast',
      name: 'Aloo Paratha',
      description: 'Whole wheat flatbread stuffed with spiced mashed potatoes',
      region: 'north',
      ingredients: ['whole wheat flour', 'potatoes', 'spices', 'herbs'],
      cookingTime: 25,
      spiceLevel: 'medium',
      cookingMedium: ['ghee'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 300,
      protein: 8,
      carbs: 52,
      fat: 10,
      healthTags: ['high-fiber', 'protein-rich'],
      accompaniments: ['yogurt', 'pickle'],
      alternatives: ['gobi paratha', 'paneer paratha']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'breakfast',
      name: 'Idli Sambar',
      description: 'Steamed rice cakes served with lentil soup and chutneys',
      region: 'south',
      ingredients: ['rice', 'urad dal', 'fenugreek seeds', 'lentils', 'vegetables'],
      cookingTime: 20,
      spiceLevel: 'mild',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 180,
      protein: 5,
      carbs: 35,
      fat: 3,
      healthTags: ['low-fat', 'protein-rich', 'fermented'],
      accompaniments: ['coconut chutney', 'tomato chutney'],
      alternatives: ['rava idli', 'kanchipuram idli']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'breakfast',
      name: 'Poha',
      description: 'Flattened rice tempered with mustard seeds, peanuts, and herbs',
      region: 'west',
      ingredients: ['flattened rice', 'peanuts', 'onions', 'curry leaves', 'spices'],
      cookingTime: 15,
      spiceLevel: 'mild',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 220,
      protein: 7,
      carbs: 40,
      fat: 6,
      healthTags: ['quick-cooking', 'light', 'gluten-free'],
      accompaniments: ['sev', 'lemon wedges'],
      alternatives: ['kanda poha', 'indori poha']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'breakfast',
      name: 'Uttapam',
      description: 'Thick rice and lentil pancake topped with vegetables',
      region: 'south',
      ingredients: ['rice', 'urad dal', 'onions', 'tomatoes', 'carrots'],
      cookingTime: 20,
      spiceLevel: 'mild',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 230,
      protein: 7,
      carbs: 42,
      fat: 5,
      healthTags: ['protein-rich', 'fermented', 'customizable'],
      accompaniments: ['coconut chutney', 'sambar'],
      alternatives: ['onion uttapam', 'tomato uttapam']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'breakfast',
      name: 'Upma',
      description: 'Savory semolina porridge with vegetables and nuts',
      region: 'south',
      ingredients: ['semolina', 'vegetables', 'cashews', 'curry leaves'],
      cookingTime: 20,
      spiceLevel: 'mild',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 210,
      protein: 6,
      carbs: 38,
      fat: 7,
      healthTags: ['quick-cooking', 'nutritious', 'filling'],
      accompaniments: ['coconut chutney', 'lemon wedges'],
      alternatives: ['rava upma', 'vermicelli upma']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'breakfast',
      name: 'Misal Pav',
      description: 'Spicy sprouted moth beans curry with bread rolls',
      region: 'west',
      ingredients: ['moth beans', 'pav bread', 'farsan', 'onions'],
      cookingTime: 30,
      spiceLevel: 'spicy',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 320,
      protein: 12,
      carbs: 48,
      fat: 9,
      healthTags: ['protein-rich', 'high-fiber', 'energizing'],
      accompaniments: ['lemon wedges', 'chopped onions'],
      alternatives: ['usal pav', 'kolhapuri misal']
    }
  ],
  lunch: [
    {
      id: `ai-${uuidv4()}`,
      type: 'lunch',
      name: 'Paneer Butter Masala',
      description: 'Cottage cheese cubes in rich, creamy tomato gravy',
      region: 'north',
      ingredients: ['paneer', 'tomatoes', 'cream', 'spices'],
      cookingTime: 40,
      spiceLevel: 'medium',
      cookingMedium: ['ghee'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 400,
      protein: 18,
      carbs: 12,
      fat: 32,
      healthTags: ['protein-rich', 'calcium-rich'],
      accompaniments: ['naan', 'jeera rice'],
      alternatives: ['shahi paneer', 'kadai paneer']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'lunch',
      name: 'Vegetable Biryani',
      description: 'Fragrant rice cooked with mixed vegetables and aromatic spices',
      region: 'south',
      ingredients: ['basmati rice', 'mixed vegetables', 'biryani masala', 'saffron'],
      cookingTime: 45,
      spiceLevel: 'medium',
      cookingMedium: ['ghee', 'oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 350,
      protein: 8,
      carbs: 65,
      fat: 12,
      healthTags: ['balanced-meal', 'vitamin-rich'],
      accompaniments: ['raita', 'salan'],
      alternatives: ['pulao', 'tehri']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'lunch',
      name: 'Chole Bhature',
      description: 'Spiced chickpea curry served with deep-fried bread',
      region: 'north',
      ingredients: ['chickpeas', 'spices', 'all-purpose flour', 'onions'],
      cookingTime: 50,
      spiceLevel: 'spicy',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 550,
      protein: 15,
      carbs: 80,
      fat: 22,
      healthTags: ['protein-rich', 'fiber-rich'],
      accompaniments: ['pickled onions', 'green chutney'],
      alternatives: ['chole kulche', 'pindi chole']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'lunch',
      name: 'Sambar Rice',
      description: 'Rice mixed with spiced lentil stew and vegetables',
      region: 'south',
      ingredients: ['rice', 'toor dal', 'mixed vegetables', 'sambar powder'],
      cookingTime: 35,
      spiceLevel: 'medium',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 320,
      protein: 10,
      carbs: 60,
      fat: 6,
      healthTags: ['comfort-food', 'protein-rich'],
      accompaniments: ['papad', 'pickle'],
      alternatives: ['bisibelebath', 'rasam rice']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'lunch',
      name: 'Kadhi Chawal',
      description: 'Yogurt-based curry with gram flour dumplings served with rice',
      region: 'north',
      ingredients: ['yogurt', 'gram flour', 'rice', 'spices'],
      cookingTime: 40,
      spiceLevel: 'medium',
      cookingMedium: ['ghee'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 380,
      protein: 12,
      carbs: 65,
      fat: 10,
      healthTags: ['probiotic-rich', 'comfort-food'],
      accompaniments: ['papad', 'pickle'],
      alternatives: ['gujarati kadhi', 'rajasthani kadhi']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'lunch',
      name: 'Rajma Chawal',
      description: 'Red kidney beans curry served with steamed rice',
      region: 'north',
      ingredients: ['kidney beans', 'rice', 'tomatoes', 'spices'],
      cookingTime: 45,
      spiceLevel: 'medium',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 420,
      protein: 15,
      carbs: 70,
      fat: 8,
      healthTags: ['protein-rich', 'fiber-rich', 'iron-rich'],
      accompaniments: ['onion rings', 'green chutney'],
      alternatives: ['dal chawal', 'chole chawal']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'lunch',
      name: 'Avial',
      description: 'Mixed vegetables in coconut and yogurt curry',
      region: 'south',
      ingredients: ['mixed vegetables', 'coconut', 'yogurt', 'curry leaves'],
      cookingTime: 35,
      spiceLevel: 'mild',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: false,
      calories: 280,
      protein: 8,
      carbs: 32,
      fat: 15,
      healthTags: ['vitamin-rich', 'no-onion-garlic'],
      accompaniments: ['rice', 'papadum'],
      alternatives: ['kerala style avial', 'mixed veg curry']
    }
  ],
  dinner: [
    {
      id: `ai-${uuidv4()}`,
      type: 'dinner',
      name: 'Dal Tadka',
      description: 'Yellow lentils tempered with spices and herbs',
      region: 'north',
      ingredients: ['yellow dal', 'tomatoes', 'spices', 'herbs'],
      cookingTime: 35,
      spiceLevel: 'medium',
      cookingMedium: ['ghee'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 250,
      protein: 12,
      carbs: 35,
      fat: 8,
      healthTags: ['protein-rich', 'fiber-rich'],
      accompaniments: ['rice', 'roti'],
      alternatives: ['dal fry', 'dal makhani']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'dinner',
      name: 'Mixed Vegetable Curry',
      description: 'Assorted vegetables in a rich, spiced gravy',
      region: 'north',
      ingredients: ['mixed vegetables', 'tomatoes', 'spices', 'cream'],
      cookingTime: 30,
      spiceLevel: 'medium',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 200,
      protein: 6,
      carbs: 25,
      fat: 10,
      healthTags: ['vitamin-rich', 'low-calorie'],
      accompaniments: ['roti', 'rice'],
      alternatives: ['navratan korma', 'veg kadai']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'dinner',
      name: 'Palak Paneer',
      description: 'Cottage cheese cubes in creamy spinach gravy',
      region: 'north',
      ingredients: ['spinach', 'paneer', 'spices', 'cream'],
      cookingTime: 40,
      spiceLevel: 'mild',
      cookingMedium: ['ghee'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 280,
      protein: 14,
      carbs: 15,
      fat: 18,
      healthTags: ['iron-rich', 'calcium-rich'],
      accompaniments: ['naan', 'rice'],
      alternatives: ['methi paneer', 'saag paneer']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'dinner',
      name: 'Baingan Bharta',
      description: 'Smoky mashed eggplant with spices',
      region: 'north',
      ingredients: ['eggplant', 'tomatoes', 'spices', 'peas'],
      cookingTime: 45,
      spiceLevel: 'medium',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 180,
      protein: 5,
      carbs: 20,
      fat: 12,
      healthTags: ['low-calorie', 'antioxidant-rich'],
      accompaniments: ['roti', 'rice'],
      alternatives: ['bharwa baingan', 'begun bhaja']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'dinner',
      name: 'Malai Kofta',
      description: 'Potato and paneer dumplings in rich creamy gravy',
      region: 'north',
      ingredients: ['paneer', 'potatoes', 'cream', 'cashews'],
      cookingTime: 50,
      spiceLevel: 'mild',
      cookingMedium: ['ghee'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 450,
      protein: 14,
      carbs: 35,
      fat: 28,
      healthTags: ['rich', 'festive', 'protein-rich'],
      accompaniments: ['naan', 'jeera rice'],
      alternatives: ['paneer kofta', 'vegetable kofta']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'dinner',
      name: 'Bhindi Masala',
      description: 'Stir-fried okra with Indian spices',
      region: 'north',
      ingredients: ['okra', 'onions', 'tomatoes', 'spices'],
      cookingTime: 25,
      spiceLevel: 'medium',
      cookingMedium: ['oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 150,
      protein: 4,
      carbs: 18,
      fat: 8,
      healthTags: ['low-calorie', 'fiber-rich', 'quick-cooking'],
      accompaniments: ['roti', 'dal'],
      alternatives: ['kurkuri bhindi', 'bharwa bhindi']
    },
    {
      id: `ai-${uuidv4()}`,
      type: 'dinner',
      name: 'Vegetable Korma',
      description: 'Mixed vegetables in mild coconut and cashew curry',
      region: 'south',
      ingredients: ['mixed vegetables', 'coconut', 'cashews', 'cream'],
      cookingTime: 35,
      spiceLevel: 'mild',
      cookingMedium: ['ghee', 'oil'],
      isVegetarian: true,
      hasOnionGarlic: true,
      calories: 310,
      protein: 9,
      carbs: 28,
      fat: 20,
      healthTags: ['mild-spiced', 'rich', 'restaurant-style'],
      accompaniments: ['naan', 'pulao'],
      alternatives: ['veg kurma', 'hotel style korma']
    }
  ]
};

// Helper function to get a random sample meal that hasn't been used
function getRandomSampleMeal(mealType: MealType, excludeNames: Set<string> = new Set()): Meal | null {
  const availableMeals = sampleMeals[mealType].filter(meal => !excludeNames.has(meal.name));
  if (availableMeals.length === 0) {
    console.log(`No more unique ${mealType} meals available in the sample database`);
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableMeals.length);
  const sampleMeal = availableMeals[randomIndex];
  excludeNames.add(sampleMeal.name);
  
  return {
    ...sampleMeal,
    id: `ai-${uuidv4()}`
  };
}

export async function generateMeal(
  mealType: MealType,
  region?: Region,
  excludeNames: Set<string> = new Set()
): Promise<Meal | null> {
  try {
    if (!HUGGINGFACE_API_KEY) {
      console.log('No Hugging Face API key found, using sample meals');
      return getRandomSampleMeal(mealType, excludeNames);
    }

    console.log('Attempting AI meal generation...');
    
    const response = await hf.textGeneration({
      model: MODEL_NAME,
      inputs: generatePrompt(mealType, region),
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.9,
        top_p: 0.95,
        do_sample: true,
        return_full_text: false,
      },
    });

    console.log('Raw AI response:', response.generated_text);

    // Clean up the response to ensure it's valid JSON
    const cleanedResponse = response.generated_text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/\s+/g, ' ')
      .trim();

    console.log('Cleaned response:', cleanedResponse);

    let mealData;
    try {
      // Try to find JSON-like structure in the response
      const jsonMatch = cleanedResponse.match(/\{.*\}/);
      if (!jsonMatch) {
        console.log('No JSON structure found, falling back to sample meal');
        return getRandomSampleMeal(mealType, excludeNames);
      }
      mealData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Falling back to sample meal');
      return getRandomSampleMeal(mealType, excludeNames);
    }

    // Check if this meal name has been used
    if (excludeNames.has(mealData.name)) {
      console.log('AI generated a duplicate meal, trying sample meal');
      return getRandomSampleMeal(mealType, excludeNames);
    }

    // Validate required fields
    const requiredFields = ['name', 'description', 'region', 'cookingTime', 'spiceLevel', 'cookingMedium'];
    for (const field of requiredFields) {
      if (!mealData[field]) {
        console.log(`AI response missing required field: ${field}, falling back to sample meal`);
        return getRandomSampleMeal(mealType, excludeNames);
      }
    }

    // Add the meal name to used names
    excludeNames.add(mealData.name);

    // Validate and transform the data with default values
    const meal: Meal = {
      id: `ai-${uuidv4()}`,
      type: mealType,
      name: mealData.name,
      description: mealData.description || 'A traditional Indian dish',
      region: (mealData.region as Region) || 'north',
      ingredients: Array.isArray(mealData.ingredients) ? mealData.ingredients : [],
      cookingTime: Number(mealData.cookingTime) || 30,
      spiceLevel: (mealData.spiceLevel as SpiceLevel) || 'medium',
      cookingMedium: Array.isArray(mealData.cookingMedium) ? mealData.cookingMedium as CookingMedium[] : ['ghee'],
      isVegetarian: Boolean(mealData.isVegetarian),
      hasOnionGarlic: Boolean(mealData.hasOnionGarlic),
      calories: Number(mealData.calories) || 0,
      protein: Number(mealData.protein) || 0,
      carbs: Number(mealData.carbs) || 0,
      fat: Number(mealData.fat) || 0,
      healthTags: Array.isArray(mealData.healthTags) ? mealData.healthTags : [],
      accompaniments: Array.isArray(mealData.accompaniments) ? mealData.accompaniments : [],
      alternatives: Array.isArray(mealData.alternatives) ? mealData.alternatives : [],
    };

    return meal;
  } catch (error) {
    console.error('Error generating meal:', error);
    console.log('Falling back to sample meal due to error');
    return getRandomSampleMeal(mealType, excludeNames);
  }
}

export async function generateMultipleMeals(
  mealType: MealType,
  count: number = 3,
  region?: Region
): Promise<Meal[]> {
  console.log(`Generating ${count} ${mealType} meals${region ? ` from ${region}` : ''}`);
  
  // Reset used meals when starting a new generation
  const usedNames = new Set<string>();
  const meals: Meal[] = [];
  const promises: Promise<Meal | null>[] = [];

  // First try AI generation
  for (let i = 0; i < count; i++) {
    promises.push(generateMeal(mealType, region, usedNames));
  }

  try {
    const results = await Promise.allSettled(promises);
    
    // Process results and ensure we have enough unique meals
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        meals.push(result.value);
      }
    }

    // If we don't have enough meals, try to fill with unused sample meals
    while (meals.length < count) {
      const sampleMeal = getRandomSampleMeal(mealType, usedNames);
      if (!sampleMeal) {
        // If we've used all available meals, break
        break;
      }
      meals.push(sampleMeal);
    }

    console.log(`Successfully generated ${meals.length} unique meals`);
    return meals;
  } catch (error) {
    console.error('Error generating multiple meals:', error);
    
    // Fallback to unique sample meals
    const fallbackMeals: Meal[] = [];
    while (fallbackMeals.length < count) {
      const sampleMeal = getRandomSampleMeal(mealType, usedNames);
      if (!sampleMeal) {
        // If we've used all available meals, break
        break;
      }
      fallbackMeals.push(sampleMeal);
    }
    return fallbackMeals;
  }
} 