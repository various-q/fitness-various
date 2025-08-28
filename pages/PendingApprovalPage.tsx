import React from 'react';

const PendingApprovalPage: React.FC = () => {
    return (
        <div className="text-center p-10 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-w-2xl mx-auto mt-16">
            <svg className="mx-auto h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-100">حسابك قيد المراجعة</h2>
            <p className="mt-2 text-gray-400">
                شكرًا لتسجيلك! حسابك في انتظار الموافقة من قبل المسؤول. سيتم إعلامك قريبًا.
            </p>
        </div>
    );
};

export default PendingApprovalPage;
