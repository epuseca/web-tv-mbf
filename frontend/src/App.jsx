import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ImageManagement from './pages/ImageManagement';
import DisplayPage from './pages/DisplayPage';

const App = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#6366f1',
                    borderRadius: 8,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                },
                algorithm: theme.defaultAlgorithm,
            }}
        >
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public — TV Display */}
                        <Route path="/display" element={<DisplayPage />} />

                        {/* Public — Login */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected — Admin Routes */}
                        <Route
                            element={
                                <ProtectedRoute>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/admin/images" element={<ImageManagement />} />
                        </Route>

                        {/* Default redirect */}
                        <Route path="/" element={<Navigate to="/display" replace />} />
                        <Route path="*" element={<Navigate to="/display" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ConfigProvider>
    );
};

export default App;
