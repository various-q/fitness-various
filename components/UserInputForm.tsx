import React, { useState } from 'react';
import { UserData, Gender, ActivityLevel, Goal, WorkoutPreference } from '../types';

interface UserInputFormProps {
  onSubmit: (data: UserData) => void;
  isGenerating: boolean;
}

const InputField = ({ label, name, type, value, error, min, max, onChange }: { label: string, name: keyof UserData, type: string, value: any, error?: string, min?: number, max?: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

const SelectField = ({ label, name, value, children, onChange }: { label: string, name: keyof UserData, value: any, children: React.ReactNode, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {children}
      </select>
    </div>
);


const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, isGenerating }) => {
  const [formData, setFormData] = useState<UserData>({
    age: 25,
    gender: Gender.Male,
    height: 175,
    weight: 70,
    activityLevel: ActivityLevel.Moderate,
    goal: Goal.Maintenance,
    workoutPreference: WorkoutPreference.Gym,
    dailyRoutine: 'أستيقظ في الساعة 6 صباحًا للعمل، وأعود إلى المنزل في الساعة 2 ظهرًا، وأذهب إلى النادي الرياضي بعد ذلك.',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {};
    if (formData.age <= 0 || formData.age > 120) newErrors.age = "الرجاء إدخال عمر صالح.";
    if (formData.height <= 0 || formData.height > 250) newErrors.height = "الرجاء إدخال طول صالح بالسنتيمتر.";
    if (formData.weight <= 0 || formData.weight > 300) newErrors.weight = "الرجاء إدخال وزن صالح بالكيلوجرام.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-300">أخبرنا عن نفسك</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <InputField label="العمر" name="age" type="number" value={formData.age} error={errors.age} min={1} max={120} onChange={handleChange} />
        <SelectField label="الجنس" name="gender" value={formData.gender} onChange={handleChange}>
          <option value={Gender.Male}>ذكر</option>
          <option value={Gender.Female}>أنثى</option>
        </SelectField>
        <InputField label="الطول (سم)" name="height" type="number" value={formData.height} error={errors.height} min={1} max={250} onChange={handleChange} />
        <InputField label="الوزن (كجم)" name="weight" type="number" value={formData.weight} error={errors.weight} min={1} max={300} onChange={handleChange} />
        <div className="md:col-span-2">
            <SelectField label="مستوى النشاط" name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                <option value={ActivityLevel.Sedentary}>خامل (قليل من التمارين أو بدونها)</option>
                <option value={ActivityLevel.Light}>نشاط خفيف (تمارين خفيفة/رياضة 1-3 أيام في الأسبوع)</option>
                <option value={ActivityLevel.Moderate}>نشاط معتدل (تمارين معتدلة/رياضة 3-5 أيام في الأسبوع)</option>
                <option value={ActivityLevel.Active}>نشيط جداً (تمارين شاقة/رياضة 6-7 أيام في الأسبوع)</option>
                <option value={ActivityLevel.VeryActive}>نشاط فائق (تمارين شاقة جداً ووظيفة بدنية)</option>
            </SelectField>
        </div>
         <div className="md:col-span-2">
            <SelectField label="مكان التمرين المفضل" name="workoutPreference" value={formData.workoutPreference} onChange={handleChange}>
                <option value={WorkoutPreference.Gym}>النادي الرياضي</option>
                <option value={WorkoutPreference.Home}>تمارين منزلية</option>
            </SelectField>
        </div>
        <div className="md:col-span-2">
            <SelectField label="هدفك" name="goal" value={formData.goal} onChange={handleChange}>
                <option value={Goal.WeightLoss}>فقدان الوزن</option>
                <option value={Goal.Maintenance}>الحفاظ على الوزن</option>
                <option value={Goal.WeightGain}>زيادة الوزن</option>
            </SelectField>
        </div>
        <div className="md:col-span-2">
            <label htmlFor="dailyRoutine" className="block text-sm font-medium text-gray-300 mb-1">صف روتينك اليومي (اختياري)</label>
            <textarea
                id="dailyRoutine"
                name="dailyRoutine"
                rows={3}
                value={formData.dailyRoutine}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: أستيقظ الساعة 7 صباحًا، أعمل من 9 إلى 5، وأفضل التمرين في المساء."
            />
            <p className="text-xs text-gray-400 mt-1">كلما قدمت تفاصيل أكثر، كان الجدول اليومي المقترح أفضل.</p>
        </div>
        <div className="md:col-span-2 mt-4">
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isGenerating}
          >
            {isGenerating ? 'جاري الإنشاء...' : 'أنشئ خطتي'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInputForm;