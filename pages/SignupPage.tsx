import React, { useState } from 'react';
import { signup } from '../services/authService';

interface SignupPageProps {
    onSignupSuccess: () => void;
    onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (password.length < 6) {
            setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل.');
            setIsLoading(false);
            return;
        }

        const result = signup(email, password);
        setIsLoading(false);

        if (result.success) {
            setSuccessMessage(result.message);
            setTimeout(() => {
                onSignupSuccess();
            }, 3000); // Redirect after 3 seconds
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-teal-300 mb-6">إنشاء حساب جديد</h2>
                <form onSubmit={handleSignup}>
                    {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-center">{error}</p>}
                    {successMessage && <p className="bg-green-900/50 text-green-300 p-3 rounded-md mb-4 text-center">{successMessage}</p>}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !!successMessage}
                        className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                    >
                        {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    لديك حساب بالفعل؟{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-teal-400 hover:text-teal-300">
                        تسجيل الدخول
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
