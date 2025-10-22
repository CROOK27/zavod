// src/front/pages/OrderCompletionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/OrderCompletionPage.module.css';
import { getOrderById, updateOrder } from '../api/api';

export default function OrderCompletionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

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

    const handleMarkComplete = async () => {
        if (!order) return;

        setActionLoading(true);
        try {
            const updateData = {
                ...order,
                status: 'completed',
                completionDate: new Date().toISOString().split('T')[0] // Текущая дата
            };

            const response = await updateOrder(order.id, updateData);
            if (response.success) {
                alert(`Заказ №${order.id} отмечен как выполненный`);
                navigate('/profile');
            } else {
                alert('Ошибка при отметке заказа как выполненного: ' + response.error);
            }
        } catch (error) {
            console.error('Ошибка при отметке заказа:', error);
            alert('Произошла ошибка при отметке заказа');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkExpired = async () => {
        if (!order) return;

        if (!window.confirm('Вы уверены, что хотите отметить заказ как просроченный?')) {
            return;
        }

        setActionLoading(true);
        try {
            const updateData = {
                ...order,
                status: 'expired'
            };

            const response = await updateOrder(order.id, updateData);
            if (response.success) {
                alert(`Заказ №${order.id} отмечен как просроченный`);
                navigate('/profile');
            } else {
                alert('Ошибка при отметке заказа как просроченного: ' + response.error);
            }
        } catch (error) {
            console.error('Ошибка при отметке заказа:', error);
            alert('Произошла ошибка при отметке заказа');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <Header isAuthenticated={true} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.loading}>Загрузка данных заказа...</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.page}>
                <Header isAuthenticated={true} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <h1 className={styles.title}>Заказ не найден</h1>
                        <p className={styles.error}>Заказ с ID {id} не существует или был удален.</p>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate('/profile')}
                        >
                            Вернуться в профиль
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header isAuthenticated={true} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Заказ №{order.id}</h1>

                    <div className={styles.content}>
                        <div className={styles.imageWrapper}>
                            <div className={styles.placeholderImage}>
                                📋
                            </div>
                        </div>

                        <div className={styles.info}>
                            <h2 className={styles.subtitle}>{order.name || 'Название не указано'}</h2>
                            <p className={styles.description}>
                                {order.quest || 'Описание заказа отсутствует'}
                            </p>
                            {order.manager && (
                                <p>
                                    <strong>Ответственный менеджер:</strong>{' '}
                                    {order.manager.user ?
                                        `${order.manager.user.firstname} ${order.manager.user.lastname}` :
                                        'Не указан'
                                    }
                                </p>
                            )}
                            {order.customer && (
                                <p>
                                    <strong>Заказчик:</strong> {order.customer}
                                </p>
                            )}
                            {/* Добавьте другие поля заказа по необходимости */}
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            onClick={handleMarkComplete}
                            className={`${styles.button} ${styles.green}`}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Обработка...' : 'Выполнен'}
                        </button>
                        <button
                            onClick={handleMarkExpired}
                            className={`${styles.button} ${styles.red}`}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Обработка...' : 'Просрочен'}
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}