
export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum ActivityLevel {
  Sedentary = 'sedentary',
  Light = 'light',
  Moderate = 'moderate',
  Active = 'active',
  VeryActive = 'very_active',
}

export enum Goal {
  WeightLoss = 'loss',
  Maintenance = 'maintenance',
  WeightGain = 'gain',
}

export enum WorkoutPreference {
  Home = 'home',
  Gym = 'gym',
}

export interface UserData {
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  goal: Goal;
  workoutPreference: WorkoutPreference;
  dailyRoutine: string;
}

export interface FitnessMetrics {
  bmi: number;
  bmr: number;
  tdee: number;
  idealWeight: { min: number; max: number };
  targetCalories: number;
}

export interface Exercise {
  name: string;
  description: string;
  sets: string;
  reps: string;
  duration?: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
  rest_day: boolean;
}

export interface NutritionTip {
    title: string;
    description: string;
}

export interface DailyScheduleItem {
    time: string;
    activity: string;
    details: string;
    icon: string;
}

export interface FitnessPlan {
  exercise_plan: {
    title: string;
    weekly_schedule: DailyWorkout[];
  };
  nutrition_plan: {
    title: string;
    summary: string;
    macro_split: {
        protein_percent: number;
        carbs_percent: number;
        fat_percent: number;
    },
    tips: NutritionTip[];
  };
  daily_schedule_plan: DailyScheduleItem[];
}

export interface PlanRecord {
    plan: FitnessPlan;
    planMetrics: FitnessMetrics;
    planUserData: UserData;
    createdAt: string; // ISO String for unique ID and timestamp
}

export interface User {
    id: string;
    email: string;
    password?: string; // Should be hashed in a real app
    status: 'pending' | 'approved';
    isAdmin: boolean;
    activePlan?: PlanRecord | null;
    planHistory?: PlanRecord[];
}