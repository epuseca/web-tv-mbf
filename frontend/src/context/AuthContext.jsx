import { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('webtv_token');
        const savedUser = localStorage.getItem('webtv_user');
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('webtv_token');
                localStorage.removeItem('webtv_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await authApi.login(username, password);
        const { token, user: userData } = response.data.data;
        localStorage.setItem('webtv_token', token);
        localStorage.setItem('webtv_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('webtv_token');
        localStorage.removeItem('webtv_user');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
