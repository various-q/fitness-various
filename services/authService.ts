import { User, FitnessPlan, FitnessMetrics, UserData, PlanRecord } from '../types';

// Simple UUID generator since we can't import external libraries not in the importmap
const simpleUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};


const USERS_KEY = 'fitness_planner_users';
const CURRENT_USER_SESSION_KEY = 'fitness_planner_session';

export const getUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const initializeAdmin = (): void => {
    const users = getUsers();
    const adminExists = users.some(u => u.isAdmin);
    if (!adminExists) {
        const admin: User = {
            id: simpleUUID(),
            email: 'naif.3u3@gmail.com',
            password: 'Various123', // In a real app, this should be hashed
            isAdmin: true,
            status: 'approved',
            activePlan: null,
            planHistory: []
        };
        users.push(admin);
        saveUsers(users);
    }
};

export const signup = (email: string, password: string): { success: boolean; message: string } => {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل.' };
    }
    const newUser: User = {
        id: simpleUUID(),
        email,
        password,
        isAdmin: false,
        status: 'pending',
        activePlan: null,
        planHistory: []
    };
    users.push(newUser);
    saveUsers(users);
    return { success: true, message: 'تم إنشاء الحساب بنجاح! الرجاء انتظار موافقة المسؤول.' };
};

export const login = (email: string, password: string): { success: boolean; user: User | null; message: string } => {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
        if (user.status === 'approved' || user.isAdmin) {
            sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
            return { success: true, user, message: 'تم تسجيل الدخول بنجاح.' };
        } else {
             return { success: false, user: null, message: 'حسابك في انتظار الموافقة.' };
        }
    }
    return { success: false, user: null, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
};

export const logout = (): void => {
    sessionStorage.removeItem(CURRENT_USER_SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
    const userJson = sessionStorage.getItem(CURRENT_USER_SESSION_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

export const approveUser = async (userId: string): Promise<User[]> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        users[userIndex].status = 'approved';
        saveUsers(users);
    }
    return users;
};

export const savePlanForUser = async (userId: string, plan: FitnessPlan, metrics: FitnessMetrics, userData: UserData): Promise<User | null> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        const user = users[userIndex];
        // Archive current plan if it exists
        if (user.activePlan) {
            if (!user.planHistory) {
                user.planHistory = [];
            }
            user.planHistory.unshift(user.activePlan); // Add to beginning of array
        }

        // Create new active plan record
        const newPlanRecord: PlanRecord = {
            plan,
            planMetrics: metrics,
            planUserData: userData,
            createdAt: new Date().toISOString()
        };
        user.activePlan = newPlanRecord;
        
        saveUsers(users);
        const updatedUser = user;
        // Also update session storage
        sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(updatedUser));
        return updatedUser;
    }
    return null;
};

export const clearPlanForUser = async (userId: string): Promise<User | null> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        const user = users[userIndex];
        // Archive the plan before clearing
        if (user.activePlan) {
            if (!user.planHistory) {
                user.planHistory = [];
            }
            user.planHistory.unshift(user.activePlan);
        }
        user.activePlan = null;
        
        saveUsers(users);
        const updatedUser = user;
        sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(updatedUser));
        return updatedUser;
    }
    return null;
};

export const restorePlan = async (userId: string, planCreatedAt: string): Promise<User | null> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex > -1) {
        const user = users[userIndex];
        const history = user.planHistory || [];
        const planToRestoreIndex = history.findIndex(p => p.createdAt === planCreatedAt);

        if (planToRestoreIndex === -1) {
            return user; // Plan not found in history, return current user
        }

        // Get the plan to restore and remove it from history
        const planToRestore = history.splice(planToRestoreIndex, 1)[0];

        // Archive the current active plan, if it exists
        if (user.activePlan) {
            history.unshift(user.activePlan);
        }

        // Set the restored plan as active
        user.activePlan = planToRestore;
        user.planHistory = history;

        users[userIndex] = user;
        saveUsers(users);
        sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
        return user;
    }
    return null;
};
