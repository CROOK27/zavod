import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/OrderApprovalPage.module.css';
import { getOrderById, updateOrder, deleteOrder } from '../api/api';

export default function OrderApprovalPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!id) {
                    setLoading(false);
                    return;
                }

                const response = await getOrderById(id);
                if (response.success) {
                    setOrder(response.data);
                } else {
                    console.error('Ошибка загрузки заказа:', response.error);
                }
            } catch (error) {
                console.error('Ошибка при загрузке заказа:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleApprove = async () => {
        if (!order) return;

        setActionLoading(true);
        try {
            // Обновляем заказ, добавляя статус "утвержден"
            const updateData = {
                ...order,
                status: 'approved' // Предполагаем, что есть поле статуса
            };

            const response = await updateOrder(order.id, updateData);
            if (response.success) {
                alert('Заказ утвержден');
                navigate('/orders'); // Перенаправляем на страницу заказов
            } else {
                alert('Ошибка при утверждении заказа: ' + response.error);
            }
        } catch (error) {
            console.error('Ошибка при утверждении заказа:', error);
            alert('Произошла ошибка при утверждении заказа');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!order) return;

        if (!window.confirm('Вы уверены, что хотите отклонить этот заказ?')) {
            return;
        }

        setActionLoading(true);
        try {
            const response = await deleteOrder(order.id);
            if (response.success) {
                alert('Заказ отклонен');
                navigate('/orders'); // Перенаправляем на страницу заказов
            } else {
                alert('Ошибка при отклонении заказа: ' + response.error);
            }
        } catch (error) {
            console.error('Ошибка при отклонении заказа:', error);
            alert('Произошла ошибка при отклонении заказа');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Загрузка данных...</h2>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Заказ не найден</h2>
                    <p className={styles.subtitle}>Заказ с ID {id} не существует или был удален.</p>
                    <button
                        className={styles.backButton}
                        onClick={() => navigate('/orders')}
                    >
                        Вернуться к списку заказов
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h2 className={styles.title}>Заказ #{order.id}</h2>

                <div className={styles.field}>
                    <label>Название заказа</label>
                    <input
                        type="text"
                        value={order.name || 'Не указано'}
                        readOnly
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label>Фирма-заказчик</label>
                    <input
                        type="text"
                        value={order.customer || 'Не указано'}
                        readOnly
                        className={styles.input}
                    />
                </div>

                {order.manager && (
                    <div className={styles.field}>
                        <label>Менеджер</label>
                        <input
                            type="text"
                            value={
                                order.manager.user ?
                                `${order.manager.user.firstname} ${order.manager.user.lastname}` :
                                'Не указан'
                            }
                            readOnly
                            className={styles.input}
                        />
                    </div>
                )}

                {order.quest && (
                    <div className={styles.field}>
                        <label>Описание</label>
                        <textarea
                            value={order.quest}
                            readOnly
                            className={styles.textarea}
                            rows="3"
                        />
                    </div>
                )}

                <div className={styles.buttons}>
                    <button
                        className={styles.approve}
                        onClick={handleApprove}
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Утверждение...' : 'Утвердить'}
                    </button>
                    <button
                        className={styles.reject}
                        onClick={handleReject}
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Отклонение...' : 'Отклонить'}
                    </button>
                </div>
            </div>
        </div>
    );
}