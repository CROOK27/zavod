import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getOrdersUserById, getUserByToken, getEmployeeByUserId } from '../api/api';
import styles from '../styles/ProfilePage.module.css';

export default function ProfilePage({ user }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [userInfo, setUserInfo] = useState(user || {});
    const [employeeInfo, setEmployeeInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const clearStorageAndRedirect = () => {
        console.log('Очистка localStorage и перенаправление на логин...');

        // Очищаем все данные аутентификации
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('email');
        navigate('/login');
    };

    // 🔹 Функция для очистки данных аутентификации
    const clearAuthData = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('email');
    };

    const arrayToDateString = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
            return 'Не указана';
        }

        const [year, month, day] = dateArray;

        // Проверяем, что все элементы - числа
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return 'Не указана';
        }

        const formattedMonth = String(month).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');

        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    // 🔹 Функция для получения полного имени
    const getFullName = () => {
        if (userInfo?.firstname && userInfo?.lastname) {
            return `${userInfo.firstname} ${userInfo.lastname}`;
        }
        return userInfo?.name || 'Имя не указано';
    };

    // 🔹 Функция для получения текста статуса
    const getStatusText = (status) => {
        const statusMap = {
            'PENDING': 'Ожидание',
            'APPROVED': 'Утвержден',
            'COMPLETED': 'Выполнен',
            'FAILED': 'Провален',
            'IN_PROGRESS': 'В работе'
        };
        return statusMap[status] || status;
    };

    // 🔹 Функция для получения класса статуса
    const getStatusClass = (status) => {
        const statusClassMap = {
            'PENDING': styles.statusPending,
            'APPROVED': styles.statusApproved,
            'COMPLETED': styles.statusCompleted,
            'FAILED': styles.statusFailed,
            'IN_PROGRESS': styles.statusInProgress
        };
        return statusClassMap[status] || styles.statusDefault;
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

                // Загружаем данные сотрудника
                const employeeResponse = await getEmployeeByUserId(Number(user.id));
                console.log("Employee response", employeeResponse);
                const employee = employeeResponse.data;

                const formattedEmployeeInfo = {
                    ...employee,
                    birthDate: (employee?.birthDate),
                    hireDate: (employee?.hireDate)
                };

                // Загружаем заказы пользователя
                const ordersResponse = await getOrdersUserById(user.id);
                console.log("Orders response", ordersResponse);

                if (ordersResponse.success) {
                    setOrders(ordersResponse.data);
                } else {
                    console.error('Ошибка загрузки заказов:', ordersResponse.error);
                }

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
            <Header isAuthenticated={true} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <p>Загрузка данных...</p>
                </div>
            </main>
            <Footer />
        </div>
    );

    return (
        <div className={styles.page}>
            <Header isAuthenticated={true} />

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

                    </div>

                    {/* Правая часть — список заказов */}
                    <div className={styles.ordersSection}>
                        <h2 className={styles.ordersTitle}>Мои заказы</h2>

                        {orders.length > 0 ? (
                            <div className={styles.ordersList}>
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className={styles.orderCard}
                                        onClick={() => navigate(`/order-completion/${order.id}`)}
                                    >
                                        <div className={styles.orderHeader}>
                                            <h3 className={styles.orderTitle}>
                                                {order.name || `Заказ #${order.id}`}
                                            </h3>
                                            <span className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>

                                        <div className={styles.orderDetails}>
                                            <p><strong>Заказчик:</strong> {order.customer || 'Не указан'}</p>
                                            {order.quest && (
                                                <p><strong>Описание:</strong> {order.quest}</p>
                                            )}
                                            {order.deadline && (
                                                <p><strong>Срок выполнения:</strong> {new Date(order.deadline).toLocaleDateString()}</p>
                                            )}
                                            {order.managerName && (
                                                <p><strong>Ответственный:</strong> {order.managerName}</p>
                                            )}
                                        </div>

                                        <div className={styles.orderId}>
                                            ID: {order.id}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noOrders}>
                                <p>У вас пока нет заказов</p>
                                <p className={styles.noOrdersSubtitle}>Ожидайте назначения заказов от менеджера</p>
                            </div>
                        )}

                        {orders.length > 0 && (
                            <div className={styles.actions}>
                                <button
                                    className={`${styles.button} ${styles.yellow}`}
                                    onClick={() => navigate('/orders-user')}
                                >
                                    Все мои заказы
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}