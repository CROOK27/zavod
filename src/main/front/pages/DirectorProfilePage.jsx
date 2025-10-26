import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/DirectorProfilePage.module.css';
import { getAllOrders, getEmployeeById, getUserByToken, getEmployeeByUserId } from '../api/api';

export default function DirectorProfilePage({ user, onLogout }) {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(user || {});
    const [employeeInfo, setEmployeeInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const clearStorageAndRedirect = () => {
        console.log('Очистка localStorage и перенаправление на логин...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('email');
        navigate('/login');
    };

    const arrayToDateString = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
            return 'Не указана';
        }

        const [year, month, day] = dateArray;
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return 'Не указана';
        }

        const formattedMonth = String(month).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');

        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    const getFullName = () => {
        if (userInfo?.firstname && userInfo?.lastname) {
            return `${userInfo.firstname} ${userInfo.lastname}`;
        }
        return userInfo?.name || 'Имя не указано';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                const token = localStorage.getItem('access_token');
                if (!token) {
                    console.log('Токен не найден в localStorage');
                    setError('Требуется авторизация');
                    setTimeout(clearStorageAndRedirect, 2000);
                    return;
                }

                console.log('Токен найден, загружаем данные...');

                const [userData] = await Promise.all([
                    getUserByToken(token)
                ]);
                const user = userData.data;
                console.log('ID пользователя:', user.id);

                const employeeResponse = await getEmployeeByUserId(Number(user.id));
                const employee = employeeResponse.data;

                const formattedEmployeeInfo = {
                    ...employee,
                    birthDate: (employee?.birthDate),
                    hireDate: (employee?.hireDate)
                };

                console.log('Данные сотрудника с преобразованными датами:', formattedEmployeeInfo);

                setUserInfo(user);
                setEmployeeInfo(formattedEmployeeInfo);

            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError('Не удалось загрузить данные пользователя.');

                if (err.response?.status === 401 || err.response?.status === 403) {
                    setTimeout(clearStorageAndRedirect, 2000);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) return (
        <div className={styles.page}>
            <Header isAuthenticated={true} isDirector={true} onLogout={onLogout} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <p>Загрузка данных...</p>
                </div>
            </main>
            <Footer />
        </div>
    );

    if (error) return (
        <div className={styles.page}>
            <Header isAuthenticated={true} isDirector={true} onLogout={onLogout} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <p className={styles.error}>{error}</p>
                    <button
                        className={styles.button}
                        onClick={() => window.location.reload()}
                    >
                        Попробовать снова
                    </button>
                    <button
                        className={styles.button}
                        onClick={clearStorageAndRedirect}
                        style={{ marginLeft: '10px' }}
                    >
                        Войти снова
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );

    return (
        <div className={styles.page}>
            <Header isAuthenticated={true} isDirector={true} onLogout={onLogout} />

            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Левая часть — карточка пользователя */}
                    <div className={styles.userCard}>
                        <img
                            src={userInfo?.photo || 'https://via.placeholder.com/150'}
                            alt="Фото сотрудника"
                            className={styles.userPhoto}
                        />
                        <h2 className={styles.userName}>{getFullName()}</h2>
                        <p><strong>E-mail:</strong> {userInfo?.email || 'Не указан'}</p>
                        <p><strong>Телефон:</strong> {userInfo?.phone || 'Не указан'}</p>
                        <p><strong>Должность:</strong> {employeeInfo?.position?.name || 'Не указана'}</p>
                        <p><strong>Дата найма:</strong> {employeeInfo?.hireDate || 'Не указана'}</p>
                        <p><strong>Дата рождения:</strong> {employeeInfo?.birthDate || 'Не указана'}</p>

                        {/* Кнопка выхода */}
                    </div>

                    {/* Правая часть — кнопки директора */}
                    <div className={styles.actionsSection}>
                        <h2 className={styles.actionsTitle}>Панель управления</h2>

                        <div className={styles.directorActions}>
                            <button
                                className={`${styles.button} ${styles.blue}`}
                                onClick={() => navigate('/register-employee')}
                            >
                                Создать сотрудника
                            </button>
                            <button
                                className={`${styles.button} ${styles.green}`}
                                onClick={() => navigate('/create-position')}
                            >
                                Создать должность
                            </button>
                            <button
                                className={`${styles.button} ${styles.yellow}`}
                                onClick={() => navigate('/all-orders')}
                            >
                                Посмотреть заказы
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}