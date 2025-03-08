import { GoogleGenerativeAI } from "@google/generative-ai";

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model
export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export type MealPreferences = {
  isVegetarian?: boolean;
  hasOnionGarlic?: boolean;
  cookingMedium?: ("ghee" | "oil" | "both")[];
  spiceLevel?: "mild" | "medium" | "spicy";
  region?: ("north" | "south" | "east" | "west")[];
  healthPreferences?: string[];
  mealType?: "roti-based" | "rice-based" | "both";
};

export type Meal = {
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  description: string;
  ingredients: string[];
  dietaryTags: string[];
  region: string;
  cookingTime: number;
};

export async function generateMealSuggestions(
  mealType: "breakfast" | "lunch" | "dinner",
  preferences: MealPreferences
): Promise<Meal[]> {
  try {
    console.log("Generating meals with preferences:", { mealType, preferences });

    const prompt = `Generate 3 Indian ${mealType} suggestions based on these preferences:
    ${JSON.stringify(preferences, null, 2)}
    
    Format the response as a JSON array with exactly this structure for each meal:
    {
      "name": "Dish name",
      "type": "${mealType}",
      "description": "Brief description",
      "ingredients": ["main ingredients"],
      "dietaryTags": ["relevant dietary tags"],
      "region": "origin region",
      "cookingTime": cooking time in minutes
    }
    
    Ensure all meals are authentic Indian dishes that match the given preferences.
    Only respond with the JSON array, no other text.`;

    console.log("Sending prompt to Gemini:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw Gemini response:", text);

    try {
      const parsedMeals = JSON.parse(text) as Meal[];
      console.log("Successfully parsed meals:", parsedMeals);
      return parsedMeals;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      throw new Error("Failed to parse meal suggestions from AI response");
    }
  } catch (error) {
    console.error("Error in generateMealSuggestions:", error);
    throw error;
  }
} 