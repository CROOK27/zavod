import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllOrders, getUserByToken, getEmployeeByUserId, getOrdersUserById } from '../api/api';
import styles from '../styles/ProfilePage.module.css';

export default function ProfileHR({ user }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
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

    const clearAuthData = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('email');
    };

    // 🔹 Функция для преобразования числовой даты в читаемый формат
    const formatNumericDate = (numericDate) => {
        if (!numericDate) return 'Не указана';

        if (typeof numericDate === 'string' && numericDate.includes('-')) {
            return numericDate;
        }

        const dateStr = numericDate.toString();

        if (dateStr.length === 8) {
            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);
            return `${year}-${month}-${day}`;
        }

        if (dateStr.length === 7) {
            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = '0' + dateStr.substring(6, 7);
            return `${year}-${month}-${day}`;
        }

        return numericDate;
    };

    // 🔹 Функция для преобразования даты в красивый формат
    const formatDisplayDate = (dateValue) => {
        if (!dateValue) return 'Не указана';

        const formattedDate = formatNumericDate(dateValue);

        try {
            const date = new Date(formattedDate);
            if (isNaN(date.getTime())) {
                return formattedDate;
            }

            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return formattedDate;
        }
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
            'PENDING': 'Ожидание утверждения',
            'APPROVED': 'Утвержден',
            'COMPLETED': 'Выполнен',
            'FAILED': 'Провален',
            'IN_PROGRESS': 'В работе',
            'REJECTED': 'Отклонен'
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
            'IN_PROGRESS': styles.statusInProgress,
            'REJECTED': styles.statusRejected
        };
        return statusClassMap[status] || styles.statusDefault;
    };

    // 🔹 Функция для отправки заказа на утверждение директору
    const sendForApproval = (orderId) => {
        alert(`Заказ #${orderId} отправлен на утверждение директору`);
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

                // Форматируем даты сотрудника
                const formattedEmployeeInfo = {
                    ...employee,
                    birthDate: formatNumericDate(employee?.birthDate),
                    hireDate: formatNumericDate(employee?.hireDate)
                };

                console.log('Данные сотрудника с преобразованными датами:', formattedEmployeeInfo);

                // Загружаем все заказы (для HR)
                const allOrdersResponse = await getAllOrders();
                console.log("All orders response", allOrdersResponse);

                // Загружаем заказы созданные этим HR
                const userOrdersResponse = await getOrdersUserById(user.id);
                console.log("User orders response", userOrdersResponse);

                if (allOrdersResponse.success) {
                    setOrders(allOrdersResponse.data);
                } else {
                    console.error('Ошибка загрузки всех заказов:', allOrdersResponse.error);
                }

                if (userOrdersResponse.success) {
                    setUserOrders(userOrdersResponse.data);
                } else {
                    console.error('Ошибка загрузки заказов пользователя:', userOrdersResponse.error);
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

    if (error) return (
        <div className={styles.page}>
            <Header isAuthenticated={true} />
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
                        <p><strong>Дата найма:</strong> {formatDisplayDate(employeeInfo?.hireDate)}</p>
                        <p><strong>Дата рождения:</strong> {formatDisplayDate(employeeInfo?.birthDate)}</p>
                    </div>

                    {/* Правая часть — панель управления HR */}
                    <div className={styles.hrSection}>

                        {/* Мои созданные заказы */}
                        <div className={styles.ordersBlock}>
                            <h2 className={styles.ordersTitle}>Мои созданные заказы</h2>
                            {userOrders.length > 0 ? (
                                <div className={styles.ordersList}>
                                    {userOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className={styles.orderCard}
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
                                                    <p><strong>Срок выполнения:</strong> {formatDisplayDate(order.deadline)}</p>
                                                )}
                                            </div>

                                            <div className={styles.orderActions}>
                                                {order.status === 'PENDING' && (
                                                    <button
                                                        className={`${styles.smallButton} ${styles.yellow}`}
                                                        onClick={() => sendForApproval(order.id)}
                                                    >
                                                        Отправлен на утверждение
                                                    </button>
                                                )}
                                                {order.status === 'APPROVED' && (
                                                    <span className={styles.approvedText}> Утвержден директором</span>
                                                )}
                                                {order.status === 'REJECTED' && (
                                                    <span className={styles.rejectedText}> Отклонен директором</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noOrders}>
                                    <p>Вы еще не создали ни одного заказа</p>
                                </div>
                            )}
                        </div>

                        {/* Все заказы отдела */}
                        <div className={styles.ordersBlock}>
                            <h2 className={styles.ordersTitle}>Все заказы отдела ({orders.length})</h2>
                            {orders.length > 0 ? (
                                <div className={styles.ordersList}>
                                    {orders.slice(0, 5).map((order) => ( // Показываем только первые 5
                                        <div
                                            key={order.id}
                                            className={styles.orderCard}
                                            onClick={() => navigate(`/order-approval/${order.id}`)}
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
                                                    <p><strong>Срок выполнения:</strong> {formatDisplayDate(order.deadline)}</p>
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
                                    <p>Нет заказов в отделе</p>
                                </div>
                            )}
                        </div>

                        {/* Кнопки управления */}
                        <div className={styles.hrActions}>
                            <h2 className={styles.actionsTitle}>Панель управления</h2>
                            <div className={styles.actionButtons}>
                                <button
                                    className={`${styles.button} ${styles.yellow}`}
                                    onClick={() => navigate('/create-plan')}
                                >
                                    Создать заказ
                                </button>
                                <button
                                    className={`${styles.button} ${styles.blue}`}
                                    onClick={() => navigate('/register-employee')}
                                >
                                    Зарегистрировать сотрудника
                                </button>
                                <button
                                    className={`${styles.button} ${styles.green}`}
                                    onClick={() => navigate('/orders')}
                                >
                                    Все заказы
                                </button>
                                <button
                                    className={`${styles.button} ${styles.yellow}`}
                                    onClick={() => navigate('/create-position')}
                                >
                                    Создать должность
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}