import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/hooks/useAuth';
import { collection, query, orderBy, limit, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/firebase';
import { MealOrFasting, MealType } from '../../lib/meals/types';

interface DayMeals {
  [key: string]: Record<MealType, MealOrFasting | null>;
}

interface MealPlanDocument {
  id: string;
  meals: DayMeals;
  createdAt: string;
  updatedAt: string;
}

export function useMealPlan() {
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<DayMeals>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load meal plan data when the component mounts or user changes
  useEffect(() => {
    let mounted = true;

    const loadMealPlan = async () => {
      if (!user) {
        if (mounted) {
          setLoading(false);
          setMealPlan({});
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Check if Firestore is initialized
        if (!db) {
          throw new Error('Firebase not initialized');
        }

        const mealPlansRef = collection(db, 'users', user.uid, 'mealPlans');
        const q = query(mealPlansRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!mounted) return;

        if (!querySnapshot.empty) {
          // Get the most recent meal plan
          const latestMealPlan = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
          } as MealPlanDocument;
          setMealPlan(latestMealPlan.meals || {});
        } else {
          // Initialize with empty meal plan
          setMealPlan({});
        }
      } catch (err) {
        console.error('Error loading meal plan:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load meal plan');
          setMealPlan({});
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMealPlan();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Save or update meal plan
  const saveMealPlan = async (updatedMealPlan: DayMeals) => {
    if (!user) return;

    try {
      setError(null);
      const mealPlansRef = collection(db, 'users', user.uid, 'mealPlans');
      const q = query(mealPlansRef, orderBy('createdAt', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing meal plan
        const latestMealPlan = querySnapshot.docs[0];
        const mealPlanRef = doc(db, 'users', user.uid, 'mealPlans', latestMealPlan.id);
        await updateDoc(mealPlanRef, {
          meals: updatedMealPlan,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create new meal plan
        await addDoc(mealPlansRef, {
          meals: updatedMealPlan,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      setMealPlan(updatedMealPlan);
    } catch (error) {
      console.error('Error saving meal plan:', error);
      setError('Failed to save meal plan. Please try again.');
      throw error;
    }
  };

  // Update a specific meal
  const updateMeal = async (day: string, mealType: MealType, meal: MealOrFasting | undefined) => {
    try {
      const updatedMealPlan = { ...mealPlan };
      
      // Initialize the day object if it doesn't exist
      if (!updatedMealPlan[day]) {
        updatedMealPlan[day] = {} as Record<MealType, MealOrFasting | null>;
      }

      if (meal === undefined) {
        // If meal is undefined, remove the meal type from that day
        if (updatedMealPlan[day]) {
          delete updatedMealPlan[day][mealType];
          // If no meals left for that day, remove the day entry
          if (Object.keys(updatedMealPlan[day]).length === 0) {
            delete updatedMealPlan[day];
          }
        }
      } else {
        // Add or update the meal
        updatedMealPlan[day] = {
          ...updatedMealPlan[day],
          [mealType]: meal
        };
      }

      // Update local state immediately for better UX
      setMealPlan(updatedMealPlan);

      // Then save to Firebase
      await saveMealPlan(updatedMealPlan);
    } catch (error) {
      // If save fails, revert the local state
      console.error('Failed to update meal:', error);
      setError('Failed to update meal. Please try again.');
      throw error;
    }
  };

  return {
    mealPlan,
    loading,
    error,
    updateMeal
  };
} 