import React, { useState, useEffect } from 'react';
import { User, FitnessPlan, FitnessMetrics, UserData } from './types';
import { getCurrentUser, logout, savePlanForUser, clearPlanForUser, initializeAdmin, restorePlan } from './services/authService';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import PendingApprovalPage from './pages/PendingApprovalPage';
import FitnessPlanner from './pages/FitnessPlanner';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeAdmin(); // Ensure admin account exists on first load
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setView('login');
  };

  const handleSavePlan = async (data: { plan: FitnessPlan, metrics: FitnessMetrics, userData: UserData }): Promise<void> => {
    if (currentUser) {
      const updatedUser = await savePlanForUser(currentUser.id, data.plan, data.metrics, data.userData);
      setCurrentUser(updatedUser);
    }
  };
  
  const handleResetPlan = async () => {
    if (currentUser) {
       const updatedUser = await clearPlanForUser(currentUser.id);
       setCurrentUser(updatedUser);
    }
  };

  const handleRestorePlan = async (planCreatedAt: string) => {
    if (currentUser) {
        const updatedUser = await restorePlan(currentUser.id, planCreatedAt);
        setCurrentUser(updatedUser);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (currentUser) {
    const isApprovedUser = currentUser.status === 'approved' || currentUser.isAdmin;
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
        <Navbar user={currentUser} onLogout={handleLogout} />
        <div className="max-w-6xl mx-auto mt-8 space-y-8">
          {currentUser.isAdmin && <AdminDashboard />}
          
          {currentUser.status === 'pending' ? (
            <PendingApprovalPage />
          ) : isApprovedUser ? (
            <FitnessPlanner 
                user={currentUser} 
                onPlanGenerated={handleSavePlan}
                onResetPlan={handleResetPlan}
                onRestorePlan={handleRestorePlan}
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {view === 'login' ? (
        <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} />
      ) : (
        <SignupPage onSignupSuccess={() => setView('login')} onSwitchToLogin={() => setView('login')} />
      )}
    </div>
  );
};

export default App;