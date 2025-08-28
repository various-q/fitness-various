import React, { useState } from 'react';
import { PlanRecord, Exercise, NutritionTip, Goal } from '../types';

interface StatCardProps {
    title: string;
    value: string;
    unit: string;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center border border-gray-700">
        <div className="p-3 ml-4 text-blue-400 bg-gray-700 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">
                {value} <span className="text-base font-normal text-gray-300">{unit}</span>
            </p>
        </div>
    </div>
);

interface PlanSectionProps {
    title: string;
    children: React.ReactNode;
    icon: React.ReactNode;
}

const PlanSection: React.FC<PlanSectionProps> = ({ title, children, icon }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center mb-4">
            <div className="text-teal-300">{icon}</div>
            <h3 className="text-2xl font-bold mr-3 text-teal-300">{title}</h3>
        </div>
        {children}
    </div>
);

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
    <div className="p-4 bg-gray-700/50 rounded-md border border-gray-600 transition-all duration-300 hover:bg-gray-700 hover:border-teal-400">
        <h5 className="font-semibold text-teal-300 flex items-center">{exercise.name}</h5>
        <p className="text-sm text-gray-300 mt-1">{exercise.description}</p>
        <div className="mt-2 text-xs flex space-x-4 rtl:space-x-reverse text-gray-400">
            <span>مجموعات: {exercise.sets}</span>
            <span>تكرارات: {exercise.reps}</span>
            {exercise.duration && <span>المدة: {exercise.duration}</span>}
        </div>
    </div>
);

const MacroProgressBar: React.FC<{ label: string; percentage: number; color: string; }> = ({ label, percentage, color }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-gray-300">{label}</span>
            <span className={`text-sm font-medium ${color}`}>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className={`${color.replace('text-', 'bg-')} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const LightBulbIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-1.833a6.01 6.01 0 0 0-3 0a6.01 6.01 0 0 0 1.5 1.833ZM12 18a2.25 2.25 0 0 1-2.25-2.25H6.75a5.25 5.25 0 0 1 10.5 0h-2.25A2.25 2.25 0 0 1 12 18Z" /></svg>;
const NutritionTipCard: React.FC<{ tip: NutritionTip }> = ({ tip }) => (
    <div className="flex items-start bg-gray-700/50 p-4 rounded-lg border border-gray-600">
        <div className="flex-shrink-0 ml-3 text-teal-400 pt-1">
            {LightBulbIcon}
        </div>
        <div>
            <h5 className="font-semibold text-teal-300">{tip.title}</h5>
            <p className="text-sm text-gray-300 mt-1">{tip.description}</p>
        </div>
    </div>
);

const ScheduleIcon: React.FC<{ icon: string }> = ({ icon }) => {
    const iconMap: { [key: string]: React.ReactNode } = {
        wake: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        meal: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0c-.454-.303-.977-.454-1.5-.454V8.586a1.5 1.5 0 011.5-1.5h12a1.5 1.5 0 011.5 1.5v6.96zM4.5 9.566V15.546" /></svg>,
        work: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        workout: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        relax: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12 3" /></svg>,
        sleep: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
    };
    return iconMap[icon] || null;
};

interface ResultsDashboardProps {
  activePlan: PlanRecord;
  planHistory: PlanRecord[];
  onResetPlan: () => void;
  onRestorePlan: (planCreatedAt: string) => Promise<void>;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ activePlan, planHistory, onResetPlan, onRestorePlan }) => {
    const { plan, planMetrics: metrics } = activePlan;
    const { exercise_plan, nutrition_plan, daily_schedule_plan } = plan;
    const { bmi, tdee, targetCalories, idealWeight } = metrics;
    
    const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);
    const [showHistory, setShowHistory] = useState(false);

    const handleToggleDay = (index: number) => {
        setOpenDayIndex(openDayIndex === index ? null : index);
    };
    
    const goalMap = {
        [Goal.WeightLoss]: 'فقدان الوزن',
        [Goal.Maintenance]: 'الحفاظ على الوزن',
        [Goal.WeightGain]: 'زيادة الوزن',
    };

    const BmiIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>;
    const FireIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.287 8.287 0 0 0 3-7.284Z" /></svg>;
    const TargetIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.917 11.917 0 0 1 12 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0-3.182-5.831M3.284 6.747l3.182 5.831" /></svg>;
    const WeightIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
    const ExerciseIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
    const NutritionIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
    const TimeIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white">خطتك المخصصة جاهزة!</h2>
                    <p className="text-gray-400 mt-1">هذه هي خارطة طريقك لتحقيق أهدافك.</p>
                </div>
                 <button onClick={onResetPlan} className="bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    إنشاء خطة جديدة
                </button>
            </div>
            {/* Metrics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="السعرات اليومية المستهدفة" value={Math.round(targetCalories).toString()} unit="سعرة" icon={TargetIcon} />
                <StatCard title="مؤشر كتلة الجسم (BMI)" value={bmi.toFixed(1)} unit="" icon={BmiIcon} />
                <StatCard title="الوزن المثالي" value={`${idealWeight.min.toFixed(0)}-${idealWeight.max.toFixed(0)}`} unit="كجم" icon={WeightIcon} />
                <StatCard title="إجمالي إنفاق الطاقة (TDEE)" value={Math.round(tdee).toString()} unit="سعرة" icon={FireIcon} />
            </div>

            {/* Daily Schedule Section */}
            <PlanSection title="جدولك اليومي المقترح" icon={TimeIcon}>
                <div className="relative border-r-2 border-gray-700 mr-3">
                    {daily_schedule_plan.map((item, index) => (
                        <div key={index} className="mb-8 flex items-center w-full">
                           <div className="absolute -right-4 bg-gray-900 p-1 rounded-full border-2 border-teal-400">
                                <div className="bg-gray-800 rounded-full p-2">
                                    <ScheduleIcon icon={item.icon} />
                                </div>
                            </div>
                            <div className="pr-12 w-full">
                                <p className="text-sm text-teal-300">{item.time}</p>
                                <h4 className="font-bold text-lg text-white">{item.activity}</h4>
                                <p className="text-gray-400 text-sm">{item.details}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </PlanSection>


            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Exercise Plan */}
                <PlanSection title={exercise_plan.title} icon={ExerciseIcon}>
                    <div className="space-y-2">
                        {exercise_plan.weekly_schedule.map((workout, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                                <button
                                    onClick={() => handleToggleDay(index)}
                                    className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-700/50 transition-colors"
                                    aria-expanded={openDayIndex === index}
                                >
                                    <div className="flex items-center">
                                        <h4 className="font-bold text-lg text-white">{workout.day}</h4>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full mr-3 ${workout.rest_day ? 'bg-yellow-800 text-yellow-200' : 'bg-blue-800 text-blue-200'}`}>
                                            {workout.rest_day ? 'يوم راحة' : workout.focus}
                                        </span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-400 transition-transform ${openDayIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openDayIndex === index && (
                                    <div className="p-4 border-t border-gray-700">
                                        {workout.rest_day ? (
                                            <p className="text-gray-400 text-sm">استشفاء نشط أو راحة تامة. استمع لجسدك.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {workout.exercises.map((ex, exIndex) => <ExerciseCard key={exIndex} exercise={ex} />)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </PlanSection>

                {/* Nutrition Plan */}
                <PlanSection title={nutrition_plan.title} icon={NutritionIcon}>
                    <div className="space-y-6">
                        <p className="text-gray-300">{nutrition_plan.summary}</p>
                        <div>
                            <h4 className="font-semibold text-lg mb-3 text-white">توزيع المغذيات الكبرى</h4>
                            <div className="space-y-4">
                               <MacroProgressBar label="بروتين" percentage={nutrition_plan.macro_split.protein_percent} color="text-blue-400" />
                               <MacroProgressBar label="كربوهيدرات" percentage={nutrition_plan.macro_split.carbs_percent} color="text-green-400" />
                               <MacroProgressBar label="دهون" percentage={nutrition_plan.macro_split.fat_percent} color="text-yellow-400" />
                            </div>
                        </div>
                         <div>
                             <h4 className="font-semibold text-lg mb-3 text-white">نصائح غذائية</h4>
                            <div className="space-y-3">
                                {nutrition_plan.tips.map((tip, index) => <NutritionTipCard key={index} tip={tip} />)}
                            </div>
                        </div>
                    </div>
                </PlanSection>
            </div>

            {/* Plan History Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                <button onClick={() => setShowHistory(!showHistory)} className="w-full flex justify-between items-center text-left" aria-expanded={showHistory}>
                    <h3 className="text-2xl font-bold text-teal-300">سجل الخطط السابقة ({planHistory.length})</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showHistory && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        {planHistory.length > 0 ? (
                            <ul className="space-y-3">
                                {planHistory.map((record) => (
                                    <li key={record.createdAt} className="bg-gray-700/50 p-3 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-600 space-y-2 sm:space-y-0">
                                        <div>
                                            <p className="font-semibold text-white">
                                                خطة لهدف: {goalMap[record.planUserData.goal]}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                تم إنشاؤها في: {new Date(record.createdAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onRestorePlan(record.createdAt)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md text-sm transition self-end sm:self-center"
                                        >
                                            استعادة هذه الخطة
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center py-4">لا يوجد خطط سابقة في سجلك.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsDashboard;