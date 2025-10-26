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
import CreatePositionPage from './pages/CreatePositionPage';

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Загружаем пользователя при монтировании
    useEffect(() => {
        console.log('App: Загрузка состояния при запуске...');

        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        console.log('App: localStorage user:', savedUser);
        console.log('App: localStorage token:', token ? 'exists' : 'none');

        if (token && savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                console.log('App: Восстанавливаем пользователя:', userData);

                // Унифицированная обработка: извлекаем data если есть
                const userToSet = userData.data || userData;
                console.log('App: Устанавливаем пользователя:', userToSet);
                setUser(userToSet);
            } catch (e) {
                console.error('App: Ошибка парсинга user data:', e);
                handleLogout();
            }
        } else {
            console.log('App: Нет сохраненной сессии');
            setUser(null);
        }

        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        console.log('App: handleLogin вызван с данными:', userData);

        // Унифицированная обработка: извлекаем data если есть
        const userToSave = userData.data || userData;
        console.log('App: Сохраняем пользователя:', userToSave);

        if (!userToSave || !userToSave.id) {
            console.error('App: Неверные данные пользователя:', userToSave);
            return;
        }

        // ОБЯЗАТЕЛЬНО обновляем состояние
        setUser(userToSave);

        // Дублируем в localStorage для надежности
        localStorage.setItem('user', JSON.stringify(userToSave)); // Сохраняем только данные пользователя
        localStorage.setItem('isAuthenticated', 'true');

        console.log('App: Состояние обновлено, новый user:', userToSave);
        console.log('App: Роль пользователя:', userToSave.role);
    };

    const handleLogout = () => {
        console.log('App: Logging out user');

        // Очищаем localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Сбрасываем состояние
        setUser(null);

        console.log('App: Logout completed');
    };

    const isAuthenticated = !!user && localStorage.getItem('access_token');

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
    console.log('App: Роль пользователя для маршрутизации:', user?.role);

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
                            <Navigate to={user?.role === 'ADMIN' ? '/director' : '/profile'} replace />
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
                            user?.role === 'ADMIN' ? (
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
                            user?.role === 'ADMIN' ? (
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
                <Route
                    path="/create-position"
                    element={
                        isAuthenticated ? (
                            user?.role === 'ADMIN' ? (
                                <CreatePositionPage user={user} onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/profile" replace />
                            )
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
                        isAuthenticated && user?.role === 'ADMIN' ? (
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