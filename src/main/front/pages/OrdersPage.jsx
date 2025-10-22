import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/OrdersPage.module.css';
import { getAllOrders } from '../api/api';

export default function OrdersPage({ onLogout }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Загрузка списка заказов
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                if (response.success) {
                    setOrders(response.data);
                } else {
                    console.error('Ошибка загрузки заказов:', response.error);
                    // Можно показать уведомление об ошибке
                }
            } catch (error) {
                console.error('Ошибка при загрузке заказов:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleViewOrder = (orderId) => {
        // Переход на страницу утверждения заказа
        navigate(`/approve-order/${orderId}`);
    };

    const getManagerName = (manager) => {
        if (!manager) return 'Не указан';
        if (manager.user) {
            return `${manager.user.firstname} ${manager.user.lastname}`;
        }
        return 'Менеджер не указан';
    };

    return (
        <div className={styles.page}>
            <Header
                isAuthenticated={true}
                onLogout={onLogout}
            />

            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Список заказов</h1>

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
                                        <div>
                                            <h2 className={styles.projectName}>
                                                {order.name || `Заказ #${order.id}`}
                                            </h2>
                                            <p className={styles.sender}>
                                                Заказчик: {order.customer || 'Не указан'}
                                            </p>
                                            <p className={styles.manager}>
                                                Менеджер: {getManagerName(order.manager)}
                                            </p>
                                            {order.quest && (
                                                <p className={styles.description}>
                                                    {order.quest}
                                                </p>
                                            )}
                                        </div>
                                        <div className={styles.orderId}>
                                            ID: {order.id}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewOrder(order.id)}
                                        className={styles.viewButton}
                                    >
                                        Просмотреть информацию
                                    </button>
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