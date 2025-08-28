import { GoogleGenAI, Type } from "@google/genai";
import { UserData, FitnessMetrics, FitnessPlan, Gender, Goal, ActivityLevel, WorkoutPreference } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        exercise_plan: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                weekly_schedule: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.STRING },
                            focus: { type: Type.STRING },
                            exercises: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        sets: { type: Type.STRING },
                                        reps: { type: Type.STRING },
                                        duration: { type: Type.STRING, nullable: true },
                                    },
                                    required: ['name', 'description', 'sets', 'reps'],
                                },
                            },
                            rest_day: { type: Type.BOOLEAN },
                        },
                        required: ['day', 'focus', 'exercises', 'rest_day'],
                    },
                },
            },
            required: ['title', 'weekly_schedule'],
        },
        nutrition_plan: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                macro_split: {
                    type: Type.OBJECT,
                    properties: {
                        protein_percent: { type: Type.NUMBER },
                        carbs_percent: { type: Type.NUMBER },
                        fat_percent: { type: Type.NUMBER },
                    },
                    required: ['protein_percent', 'carbs_percent', 'fat_percent'],
                },
                tips: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                        },
                        required: ['title', 'description'],
                    },
                },
            },
            required: ['title', 'summary', 'macro_split', 'tips'],
        },
        daily_schedule_plan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    details: { type: Type.STRING },
                    icon: { 
                        type: Type.STRING, 
                        description: "An identifier for an icon. Must be one of: 'wake', 'meal', 'work', 'workout', 'relax', 'sleep'."
                    },
                },
                required: ['time', 'activity', 'details', 'icon']
            }
        }
    },
    required: ['exercise_plan', 'nutrition_plan', 'daily_schedule_plan'],
};


export const generateFitnessPlan = async (userData: UserData, metrics: FitnessMetrics): Promise<FitnessPlan> => {
    
    const goalMap = {
        [Goal.WeightLoss]: 'فقدان الوزن',
        [Goal.Maintenance]: 'الحفاظ على الوزن',
        [Goal.WeightGain]: 'زيادة الوزن',
    };

    const activityLevelMap = {
        [ActivityLevel.Sedentary]: 'خامل',
        [ActivityLevel.Light]: 'نشاط خفيف',
        [ActivityLevel.Moderate]: 'نشاط معتدل',
        [ActivityLevel.Active]: 'نشيط جداً',
        [ActivityLevel.VeryActive]: 'نشاط فائق',
    };

    const genderMap = {
        [Gender.Male]: 'ذكر',
        [Gender.Female]: 'أنثى',
    };

    const workoutPreferenceMap = {
        [WorkoutPreference.Home]: 'تمارين منزلية (باستخدام وزن الجسم أو معدات بسيطة)',
        [WorkoutPreference.Gym]: 'النادي الرياضي (باستخدام الأوزان الحرة والأجهزة)',
    };

    const prompt = `
        تقمص دور مدرب لياقة وخبير تغذية عالمي المستوى. مهمتك هي إنشاء خطة تمارين وتغذية وجدول يومي شامل، مخصص، وآمن لمدة 7 أيام باللغة العربية، بناءً على بيانات المستخدم التالية.

        بيانات المستخدم:
        - العمر: ${userData.age}
        - الجنس: ${genderMap[userData.gender]}
        - الطول: ${userData.height} سم
        - الوزن: ${userData.weight} كجم
        - مستوى النشاط: ${activityLevelMap[userData.activityLevel]}
        - الهدف: ${goalMap[userData.goal]}
        - مكان التمرين المفضل: ${workoutPreferenceMap[userData.workoutPreference]}
        - الروتين اليومي: ${userData.dailyRoutine || 'غير محدد'}

        المقاييس المحسوبة:
        - مؤشر كتلة الجسم (BMI): ${metrics.bmi.toFixed(1)}
        - إجمالي إنفاق الطاقة اليومي (TDEE): ${Math.round(metrics.tdee)} سعر حراري
        - السعرات الحرارية اليومية الموصى بها للهدف: ${Math.round(metrics.targetCalories)} سعر حراري

        التعليمات الصارمة:
        1.  **خطة التمارين**: أنشئ جدول تمارين مفصل لمدة 7 أيام. **يجب أن تكون التمارين مناسبة تمامًا لمكان التمرين المفضل للمستخدم (${workoutPreferenceMap[userData.workoutPreference]})**.
            - إذا كان الخيار هو **"النادي الرياضي"**:
                - استخدم أسماء تمارين شائعة ومعروفة في النوادي الرياضية، واذكر الاسم باللغة الإنجليزية بين قوسين إن أمكن (مثال: تمرين الضغط على الصدر بالبار - Barbell Bench Press).
                - قم بتضمين تمارين تستخدم الأجهزة والأوزان الحرة الشائعة.
            - إذا كان الخيار هو **"تمارين منزلية"**:
                - ركز على تمارين وزن الجسم أو التمارين التي تتطلب الحد الأدنى من المعدات (مثل أحزمة المقاومة أو الدمبل الخفيف).
                - **قدم وصفًا تفصيليًا وواضحًا للغاية لكل تمرين**، يشرح كيفية أداء الحركة خطوة بخطوة بشكل صحيح وآمن، كما لو كنت تشرح لشخص مبتدئ يتمرن بمفرده في المنزل.
            - لكل يوم تمرين، حدد التركيز (مثال: 'قوة الجزء العلوي من الجسم'، 'أرجل وكارديو').
            - اذكر 3-5 تمارين محددة لكل يوم تمرين.
            - لكل تمرين، قدم وصفًا موجزًا وفعالًا، وحدد عدد المجموعات والتكرارات أو المدة.
            - قم بتضمين يومين على الأقل للراحة أو الاستشفاء النشط.
        2.  **خطة التغذية**: قدم إرشادات غذائية شاملة وعملية.
            - **الملخص**: ابدأ بملخص قصير (جملتين إلى ثلاث جمل) للاستراتيجية الغذائية الشاملة.
            - **توزيع المغذيات**: اقترح توزيعًا مناسبًا لنسب المغذيات الكبرى (بروتين، كربوهيدرات، دهون) بناءً على هدف المستخدم وإجمالي السعرات الحرارية المستهدفة.
            - **نصائح عملية**: قدم 4 نصائح غذائية متنوعة وعملية. يجب أن تغطي هذه النصائح مواضيع مختلفة مثل:
                - **الترطيب**: أهمية شرب الماء.
                - **توقيت الوجبات**: نصيحة حول الأكل قبل أو بعد التمرين.
                - **جودة الطعام**: التركيز على الأطعمة الكاملة.
                - **وجبات خفيفة صحية**: اقتراحات بسيطة لوجبات خفيفة.
        3.  **الجدول اليومي المقترح (daily_schedule_plan)**: بناءً على روتين المستخدم، قم بإنشاء جدول يومي مفصل ومنطقي. يجب أن يغطي الجدول اليوم بأكمله من الاستيقاظ حتى النوم.
            - لكل عنصر في الجدول، حدد الوقت (مثال: "06:00 صباحًا")، النشاط (مثال: "الاستيقاظ والترطيب")، تفاصيل موجزة (مثال: "اشرب كوبًا كبيرًا من الماء لبدء عملية الأيض.")، ورمز (icon).
            - **الرموز (icon) المسموح بها هي فقط**: 'wake', 'meal', 'work', 'workout', 'relax', 'sleep'.
            - قم بتوزيع الوجبات الرئيسية والوجبات الخفيفة على مدار اليوم لتتناسب مع وقت عمل المستخدم وتمرينه. (مثال: فطور، وجبة خفيفة، غداء، وجبة خفيفة قبل التمرين، عشاء).
            - قم بتضمين اقتراحات لوجبات ما قبل التمرين وما بعده وتوقيتها المثالي.
            - اقترح وقتًا مثاليًا للتمرين بناءً على عودة المستخدم من العمل.
            - قم بتضمين وقت للاسترخاء قبل النوم واقترح وقتًا مناسبًا للنوم (لضمان 7-9 ساعات من النوم).
            - يجب أن تتماشى أوقات الوجبات مع إجمالي السعرات الحرارية المستهدفة (${Math.round(metrics.targetCalories)}). يمكنك الإشارة إلى توزيع السعرات الحرارية بشكل تقريبي ضمن التفاصيل (مثال: وجبة فطور - حوالي 25% من السعرات اليومية).

        أعد الإجابة بتنسيق JSON المحدد بدقة. تأكد من أن جميع الحقول مملوءة بمعلومات ذات صلة ومفيدة وآمنة باللغة العربية.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const plan: FitnessPlan = JSON.parse(jsonText);
        return plan;
    } catch (error) {
        console.error("Error generating fitness plan:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
};