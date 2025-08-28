import React, { useState } from 'react';
import { User, UserData, FitnessPlan, FitnessMetrics } from '../types';
import { calculateFitnessMetrics } from '../services/fitnessCalculator';
import { generateFitnessPlan } from '../services/geminiService';
import UserInputForm from '../components/UserInputForm';
import ResultsDashboard from '../components/ResultsDashboard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

interface FitnessPlannerProps {
    user: User;
    onPlanGenerated: (data: { plan: FitnessPlan; metrics: FitnessMetrics; userData: UserData }) => Promise<void>;
    onResetPlan: () => Promise<void>;
    onRestorePlan: (planCreatedAt: string) => Promise<void>;
}

const FitnessPlanner: React.FC<FitnessPlannerProps> = ({ user, onPlanGenerated, onResetPlan, onRestorePlan }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (userData: UserData) => {
        setIsGenerating(true);
        setError(null);
        try {
            const metrics = calculateFitnessMetrics(userData);
            const plan = await generateFitnessPlan(userData, metrics);
            await onPlanGenerated({ plan, metrics, userData });
        } catch (err: any) {
            setError(err.message || 'حدث خطأ غير متوقع أثناء إنشاء الخطة.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    if (isGenerating) {
        return <Loader />;
    }
    
    if (error) {
        return <ErrorMessage message={error} onRetry={() => setError(null)} />;
    }

    if (user.activePlan) {
        return <ResultsDashboard 
                    activePlan={user.activePlan} 
                    planHistory={user.planHistory || []}
                    onResetPlan={onResetPlan} 
                    onRestorePlan={onRestorePlan}
                />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-2 text-white">
                مرحباً بك في مخطط اللياقة البدنية
            </h1>
            <p className="text-center text-gray-400 mb-8">
                لنبدأ ببناء خطة مخصصة لك. املأ النموذج أدناه.
            </p>
            <UserInputForm onSubmit={handleSubmit} isGenerating={isGenerating} />
        </div>
    );
};

export default FitnessPlanner;