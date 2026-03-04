import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [theme, setTheme] = useState(
        () => localStorage.getItem('webtv_theme') || 'light'
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('webtv_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const getPageTitle = () => {
        if (location.pathname.includes('/dashboard')) return 'Dashboard';
        if (location.pathname.includes('/admin/images')) return 'Quản lý Hình ảnh';
        return 'Admin';
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>📺 WebTV</h2>
                    <span>Digital Signage Admin</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                        id="nav-dashboard"
                    >
                        <span className="nav-icon">📊</span>
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/images"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                        id="nav-images"
                    >
                        <span className="nav-icon">🖼️</span>
                        Quản lý Hình ảnh
                    </NavLink>
                    <NavLink
                        to="/display"
                        target="_blank"
                        id="nav-display"
                    >
                        <span className="nav-icon">🖥️</span>
                        Xem TV Display
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div style={{ padding: '8px 16px', marginBottom: 8, fontSize: 13, opacity: 0.7 }}>
                        👤 {user?.username || 'Admin'}
                    </div>
                    <button onClick={logout} id="btn-logout">
                        <span className="nav-icon">🚪</span>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="main-content">
                <header className="top-bar">
                    <h1>{getPageTitle()}</h1>
                    <div className="top-bar-actions">
                        <button className="theme-toggle" onClick={toggleTheme} id="btn-theme-toggle">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                </header>
                <div className="page-content fade-in">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
