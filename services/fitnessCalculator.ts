
import { UserData, FitnessMetrics, Gender, ActivityLevel, Goal } from '../types';

const calculateBMR = (data: UserData): number => {
    const { weight, height, age, gender } = data;
    // Mifflin-St Jeor Equation
    if (gender === Gender.Male) {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
};

const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
    const factors = {
        [ActivityLevel.Sedentary]: 1.2,
        [ActivityLevel.Light]: 1.375,
        [ActivityLevel.Moderate]: 1.55,
        [ActivityLevel.Active]: 1.725,
        [ActivityLevel.VeryActive]: 1.9,
    };
    return bmr * factors[activityLevel];
};

export const calculateFitnessMetrics = (data: UserData): FitnessMetrics => {
    const { weight, height, goal, activityLevel } = data;
    
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);

    const bmr = calculateBMR(data);
    const tdee = calculateTDEE(bmr, activityLevel);

    let targetCalories: number;
    switch (goal) {
        case Goal.WeightLoss:
            // A 20% deficit is generally a sustainable rate for weight loss.
            targetCalories = tdee * 0.80;
            break;
        case Goal.WeightGain:
            // A 15% surplus is recommended for lean muscle gain while minimizing fat gain.
            targetCalories = tdee * 1.15;
            break;
        case Goal.Maintenance:
        default:
            targetCalories = tdee;
            break;
    }
    
    // Using Robinson formula for ideal weight range
    const idealWeightMin = (data.gender === Gender.Male ? 52 : 49) + 1.9 * ((height / 2.54) - 60);
    const idealWeightMax = idealWeightMin * 1.1; // Approx 10% range

    return {
        bmi,
        bmr,
        tdee,
        idealWeight: { min: idealWeightMin, max: idealWeightMax },
        targetCalories
    };
};
