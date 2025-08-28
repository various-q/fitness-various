import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
      <h2 className="text-2xl font-semibold text-gray-200">جاري إنشاء خطتك...</h2>
      <p className="text-gray-400 mt-2">يقوم الذكاء الاصطناعي بصياغة رحلة اللياقة المثالية لك. قد يستغرق هذا بعض الوقت.</p>
    </div>
  );
};

export default Loader;