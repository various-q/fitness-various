import React from 'react';
import { User } from '../types';

interface NavbarProps {
    user: User;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 rounded-lg p-4 flex justify-between items-center shadow-lg">
            <div className="text-lg font-bold text-teal-300">
                مرحباً, {user.isAdmin ? 'مسؤول النظام' : user.email}
            </div>
            <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
                تسجيل الخروج
            </button>
        </header>
    );
};

export default Navbar;
