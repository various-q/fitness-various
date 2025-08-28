import React, { useState, useEffect } from 'react';
import { getUsers, approveUser } from '../services/authService';
import { User } from '../types';

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = () => {
        setIsLoading(true);
        const allUsers = getUsers();
        setUsers(allUsers);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApprove = async (userId: string) => {
        await approveUser(userId);
        fetchUsers(); // Refresh the list
    };

    const pendingUsers = users.filter(u => u.status === 'pending');
    const approvedUsers = users.filter(u => u.status === 'approved' && !u.isAdmin);

    if (isLoading) {
        return <div className="text-center p-10">جاري تحميل المستخدمين...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-teal-300">لوحة تحكم المسؤول</h1>
            
            {/* Pending Users Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">حسابات في انتظار الموافقة ({pendingUsers.length})</h2>
                {pendingUsers.length > 0 ? (
                    <ul className="divide-y divide-gray-700">
                        {pendingUsers.map(user => (
                            <li key={user.id} className="py-3 flex items-center justify-between">
                                <span className="text-gray-300">{user.email}</span>
                                <button
                                    onClick={() => handleApprove(user.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-md text-sm transition"
                                >
                                    موافقة
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">لا توجد حسابات في انتظار الموافقة حاليًا.</p>
                )}
            </div>

            {/* Approved Users Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-green-400">المستخدمون النشطون ({approvedUsers.length})</h2>
                 {approvedUsers.length > 0 ? (
                    <ul className="divide-y divide-gray-700">
                        {approvedUsers.map(user => (
                            <li key={user.id} className="py-3 text-gray-300">
                                {user.email}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">لا يوجد مستخدمون نشطون بعد.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
