import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🧱 Страницы
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import DirectorProfilePage from './pages/DirectorProfilePage';
import CreatePlanPage from './pages/CreatePlanPage';
import RegisterEmployeePage from './pages/RegisterEmployeePage';
import OrdersPage from './pages/OrdersPage';
import OrderApprovalPage from './pages/OrderApprovalPage';
import OrderCompletionPage from './pages/OrderCompletionPage';

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    // Загружаем пользователя при монтировании
    useEffect(() => {
        console.log('App: Загрузка состояния при запуске...');

        const savedUser = localStorage.getItem('user');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const token = localStorage.getItem('token');

        console.log('App: localStorage user:', savedUser);
        console.log('App: localStorage isAuthenticated:', isAuthenticated);
        console.log('App: localStorage token:', token ? 'exists' : 'none');

        if (isAuthenticated === 'true' && savedUser && token) {
            try {
                const userData = JSON.parse(savedUser);
                console.log('App: Восстанавливаем пользователя:', userData);
                setUser(userData);
            } catch (e) {
                console.error('App: Ошибка парсинга user data:', e);
                handleLogout();
            }
        } else {
            console.log('App: Нет сохраненной сессии');
            setUser(null);
        }

        setAuthChecked(true);
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        console.log('App: handleLogin вызван с данными:', userData);

        // ОБЯЗАТЕЛЬНО обновляем состояние
        setUser(userData);

        // Дублируем в localStorage для надежности
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');

        console.log('App: Состояние обновлено, новый user:', userData);
    };

    const handleLogout = () => {
        console.log('App: Logging out user');

        // Очищаем localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');

        // Сбрасываем состояние
        setUser(null);

        console.log('App: Logout completed');
    };

    const isAuthenticated = !!user && localStorage.getItem('isAuthenticated') === 'true';

    // Пока проверяем аутентификацию, показываем загрузку
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Загрузка приложения...
            </div>
        );
    }

    console.log('App: Рендер - isAuthenticated:', isAuthenticated, 'user:', user);

    return (
        <Router>
            <Routes>
                {/* Главная */}
                <Route path="/" element={<HomePage />} />

                {/* Авторизация */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to={user.role === 'DIRECTOR' ? '/director' : '/profile'} replace />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />

                {/* Профиль обычного пользователя */}
                <Route
                    path="/profile"
                    element={
                        isAuthenticated ? (
                            user.role === 'DIRECTOR' ? (
                                <Navigate to="/director" replace />
                            ) : (
                                <ProfilePage user={user} onLogout={handleLogout} />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Профиль директора */}
                <Route
                    path="/director"
                    element={
                        isAuthenticated ? (
                            user.role === 'DIRECTOR' ? (
                                <DirectorProfilePage user={user} onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/profile" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Создание производственного плана */}
                <Route
                    path="/create-plan"
                    element={
                        isAuthenticated ? (
                            <CreatePlanPage user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Регистрация сотрудника */}
                <Route
                    path="/register-employee"
                    element={
                        isAuthenticated ? (
                            <RegisterEmployeePage user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Заказы */}
                <Route
                    path="/orders"
                    element={
                        isAuthenticated ? (
                            <OrdersPage user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Утверждение заказа директором */}
                <Route
                    path="/order-approval/:orderId"
                    element={
                        isAuthenticated && user.role === 'DIRECTOR' ? (
                            <OrderApprovalPage user={user} onLogout={handleLogout} />
                        ) : isAuthenticated ? (
                            <Navigate to="/profile" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Отметка выполнения заказа пользователем */}
                <Route
                    path="/order-completion/:orderId"
                    element={
                        isAuthenticated ? (
                            <OrderCompletionPage user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Заглушка на неизвестные маршруты */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}