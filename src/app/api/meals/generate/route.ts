import { NextResponse } from "next/server";
import { MealPreferences, MealType } from "@/app/lib/meals/types";
import { getRandomMeals } from "@/app/lib/meals/mealSelector";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mealType, preferences, useAI = true } = body as {
      mealType: MealType;
      preferences: MealPreferences;
      useAI?: boolean;
    };

    console.log('API Request:', { mealType, preferences, useAI });

    try {
      const meals = await getRandomMeals(mealType, preferences, 3, useAI);
      console.log('Generated meals:', meals);

      if (!meals || meals.length === 0) {
        console.log('No meals were generated');
        return NextResponse.json(
          { error: "No meals could be generated with the given preferences" },
          { status: 404 }
        );
      }

      return NextResponse.json({ meals });
    } catch (mealError) {
      console.error('Error in getRandomMeals:', mealError);
      throw mealError;
    }
  } catch (error) {
    console.error("Error in meal generation API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate meal suggestions" },
      { status: 500 }
    );
  }
} 