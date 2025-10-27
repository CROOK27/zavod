import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Factory, Bell } from 'lucide-react';
import styles from '../styles/Header.module.css';
import NotificationPanel from './NotificationPanel';

export default function Header({
                                   isAuthenticated = false,
                                   isDirector = false,
                                   notifications = [],
                                   onNotificationClick,
                                   onLogout,
                               }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Header: Logout button clicked');
        console.log('Header: onLogout prop:', onLogout);

        if (onLogout) {
            console.log('Header: Calling onLogout from parent');
            onLogout();
        } else {
            console.log('Header: No onLogout prop, using direct logout');
            // Прямой выход без auth модуля
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }

        // Всегда перенаправляем на главную
        navigate('/', { replace: true });
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* 🔹 Логотип */}
                <div className={styles.logo}>
                    <Factory className={styles.logoIcon} />
                    <Link to="/" className={styles.logoButton}>
                        Zavod.ru
                    </Link>
                </div>

                {/* 🔹 Навигация */}
                <nav className={styles.nav}>
                    {isAuthenticated ? (
                        <>
                            {/* 🔔 Уведомления для директора */}
                            {isDirector && (
                                <div className={styles.bellWrapper}>
                                    <Bell
                                        className={styles.bellIcon}
                                        onClick={() => setShowNotifications((prev) => !prev)}
                                    />
                                    {showNotifications && (
                                        <NotificationPanel
                                            notifications={notifications}
                                            onNotificationClick={onNotificationClick}
                                        />
                                    )}
                                </div>
                            )}

                            {/* 🔹 Ссылки на страницы */}
                            <Link to="/profile" className={styles.navLink}>
                                Профиль
                            </Link>

                            <Link to="/orders" className={styles.navLink}>
                                Заказы
                            </Link>

                            <button onClick={handleLogout} className={styles.logoutButton}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <button onClick={handleLoginClick} className={styles.loginButton}>
                            Войти
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}