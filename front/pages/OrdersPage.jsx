import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/OrdersPage.module.css';
import { getAllOrders } from '../api/api';

export default function OrdersPage({ user, onLogout }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Проверка ролей
    const isDirector = user?.role === 'ADMIN';
    const canChangeStatus = user?.role === 'HR' || user?.role === 'USER' || isDirector;

    // Загрузка списка заказов
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                if (response.success) {
                    setOrders(response.data);
                } else {
                    console.error('Ошибка загрузки заказов:', response.error);
                }
            } catch (error) {
                console.error('Ошибка при загрузке заказов:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Единая функция для перехода к заказу
    const handleViewOrder = (orderId) => {
         if (isDirector) {
                    navigate(`/order-approval/${orderId}`);
         } else{
             navigate(`/order-completion/${orderId}`)
         };

    };

    const getManagerName = (manager) => {
        if (!manager) return 'Не указан';
        if (manager.user) {
            return `${manager.user.firstname} ${manager.user.lastname}`;
        }
        return 'Менеджер не указан';
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Ожидает утверждения',
            'APPROVED': 'Утвержден',
            'COMPLETED': 'Выполнен',
            'FAILED': 'Провален',
            'IN_PROGRESS': 'В работе',
            'REJECTED': 'Отклонен'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const statusClassMap = {
            'pending': styles.statusPending,
            'APPROVED': styles.statusApproved,
            'COMPLETED': styles.statusCompleted,
            'FAILED': styles.statusFailed,
            'IN_PROGRESS': styles.statusInProgress,
            'REJECTED': styles.statusRejected
        };
        return statusClassMap[status] || styles.statusDefault;
    };

    // Текст кнопки в зависимости от роли и статуса
    const getButtonText = (order) => {
        if (isDirector && order.status === 'pending') {
            return 'Утвердить заказ';
        }
        if (canChangeStatus && order.status !== 'pending' && order.status !== 'REJECTED') {
            return 'Изменить статус';
        }
        return 'Просмотреть заказ';
    };

    // Класс кнопки в зависимости от роли и статуса
    const getButtonClass = (order) => {
        if (isDirector && order.status === 'pending') {
            return styles.approveButton;
        }
        if (canChangeStatus && order.status !== 'pending' && order.status !== 'REJECTED') {
            return styles.statusButton;
        }
        return styles.viewButton;
    };

    return (
        <div className={styles.page}>
            <Header
                isAuthenticated={true}
                onLogout={onLogout}
                user={user}
            />

            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Список заказов</h1>

                    {/* Информация о правах */}
                    <div className={styles.roleInfo}>
                        {isDirector && (
                            <p className={styles.directorNote}>🎯 Вы можете утверждать планы и изменять статусы</p>
                        )}
                        {!isDirector && canChangeStatus && (
                            <p className={styles.managerNote}>⚡ Вы можете изменять статусы проектов</p>
                        )}
                        {!isDirector && !canChangeStatus && (
                            <p className={styles.userNote}>👀 Вы можете просматривать заказы</p>
                        )}
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Загрузка заказов...</div>
                    ) : orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Нет доступных заказов</p>
                            <button
                                className={styles.createOrderButton}
                                onClick={() => navigate('/create-plan')}
                            >
                                Создать первый заказ
                            </button>
                        </div>
                    ) : (
                        <div className={styles.ordersList}>
                            {orders.map(order => (
                                <div key={order.id} className={styles.orderItem}>
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderInfo}>
                                            <h2 className={styles.projectName}>
                                                {order.name || `Заказ #${order.id}`}
                                            </h2>
                                            <div className={styles.orderMeta}>
                                                <p className={styles.sender}>
                                                    <strong>Заказчик:</strong> {order.customer || 'Не указан'}
                                                </p>
                                                <p className={styles.manager}>
                                                    <strong>Ответственный:</strong> {getManagerName(order.manager)}
                                                </p>
                                                <div className={styles.status}>
                                                    <strong>Статус:</strong>
                                                    <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                            </div>
                                            {order.quest && (
                                                <p className={styles.description}>
                                                    <strong>Описание:</strong> {order.quest}
                                                </p>
                                            )}
                                        </div>
                                        <div className={styles.orderId}>
                                            ID: {order.id}
                                        </div>
                                    </div>

                                    <div className={styles.orderActions}>
                                        <button
                                            onClick={() => handleViewOrder(order.id)}
                                            className={getButtonClass(order)}
                                        >
                                            {getButtonText(order)}
                                        </button>

                                        {/* Информация о недоступных действиях */}
                                        {order.status === 'pending' && !isDirector && (
                                            <span className={styles.pendingInfo}>
                                                ⏳ Ожидает утверждения директором
                                            </span>
                                        )}

                                        {order.status === 'REJECTED' && (
                                            <span className={styles.rejectedInfo}>
                                                ❌ Заказ отклонен
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}