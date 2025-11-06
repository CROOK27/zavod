import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/OrdersPage.module.css';
import { getOrdersUserById, updateOrderStatus } from '../api/api';

export default function OrdersPage({ user, onLogout }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const navigate = useNavigate();

    // Загрузка списка заказов конкретного пользователя
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrdersUserById(user.id);
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
    }, [user.id]);

    const handleUpdateStatus = async (orderId, status) => {
        setUpdatingOrder(orderId);
        try {
            const response = await updateOrderStatus(orderId, status);
            if (response.success) {
                // Обновляем локальное состояние
                const updatedOrders = orders.map(order =>
                    order.id === orderId
                        ? { ...order, status: status }
                        : order
                );
                setOrders(updatedOrders);

                alert(`Статус заказа обновлен на: ${getStatusText(status)}`);
            } else {
                alert('Ошибка при обновлении статуса: ' + response.error);
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
            alert('Произошла ошибка при обновлении статуса');
        } finally {
            setUpdatingOrder(null);
        }
    };

    const handleViewOrder = (orderId) => {
        navigate(`/order-completion/${orderId}`);
    };

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

    return (
        <div className={styles.page}>
            <Header
                isAuthenticated={true}
                onLogout={onLogout}
            />

            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Мои заказы</h1>
                    <p className={styles.subtitle}>
                        Всего заказов: {orders.length}
                    </p>

                    {loading ? (
                        <div className={styles.loading}>Загрузка заказов...</div>
                    ) : orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>У вас пока нет заказов</p>
                        </div>
                    ) : (
                        <div className={styles.ordersList}>
                            {orders.map(order => (
                                <div key={order.id} className={styles.orderCard}>
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderInfo}>
                                            <h2 className={styles.orderTitle}>
                                                {order.name || `Заказ #${order.id}`}
                                            </h2>
                                            <div className={styles.orderMeta}>
                                                <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                                <span className={styles.orderId}>
                                                    ID: {order.id}
                                                </span>
                                            </div>
                                            <p className={styles.orderDetail}>
                                                <strong>Заказчик:</strong> {order.customer || 'Не указан'}
                                            </p>
                                            {order.managerName && (
                                                <p className={styles.orderDetail}>
                                                    <strong>Ответственный:</strong> {order.managerName}
                                                </p>
                                            )}
                                            {order.quest && (
                                                <p className={styles.orderDetail}>
                                                    <strong>Описание:</strong> {order.quest}
                                                </p>
                                            )}
                                            {order.deadline && (
                                                <p className={styles.orderDetail}>
                                                    <strong>Срок выполнения:</strong> {new Date(order.deadline).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.orderActions}>
                                        <button
                                            onClick={() => handleViewOrder(order.id)}
                                            className={styles.viewButton}
                                        >
                                            Подробнее
                                        </button>

                                        {/* Кнопки изменения статуса - всегда видны */}
                                        <div className={styles.statusButtons}>
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                                disabled={updatingOrder === order.id || order.status === 'COMPLETED'}
                                                className={`${styles.statusButton} ${styles.completedButton}`}
                                            >
                                                {updatingOrder === order.id ? 'Обновление...' : 'Выполнен'}
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'FAILED')}
                                                disabled={updatingOrder === order.id || order.status === 'FAILED'}
                                                className={`${styles.statusButton} ${styles.failedButton}`}
                                            >
                                                {updatingOrder === order.id ? 'Обновление...' : 'Провален'}
                                            </button>
                                        </div>
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