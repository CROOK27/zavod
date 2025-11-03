import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/OrderCompletionPage.module.css';
import { getOrderById, updateOrderStatus } from '../api/api';

// Функция для получения текста статуса (вынесена наружу)
function getStatusText(status) {
    const statusMap = {
        'pending': 'Ожидание утверждения',
        'APPROVED': 'Утвержден',
        'COMPLETED': 'Выполнен',
        'FAILED': 'Провален',
        'IN_PROGRESS': 'В работе',
        'REJECTED': 'Отклонен'
    };
    return statusMap[status] || status;
}

export default function OrderCompletionPage({ user, onLogout }) {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    // Проверяем роль пользователя
    const isDirector = user?.role === 'ADMIN';
    const isHR = user?.role === 'HR';
    const isUser = user?.role === 'USER';

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!orderId) {
                    setLoading(false);
                    return;
                }

                console.log('Fetching order with ID:', orderId);
                const response = await getOrderById(orderId);
                console.log('Order response:', response);

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
    }, [orderId]);

    const handleMarkComplete = async () => {
        if (!order) return;

        setActionLoading(true);
        try {
            const response = await updateOrderStatus(order.id, 'COMPLETED');
            if (response.success) {
                alert(`Заказ №${order.id} отмечен как выполненный`);
                navigate(isDirector ? '/orders' : '/orders-user');
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

    const handleMarkFailed = async () => {
        if (!order) return;

        if (!window.confirm('Вы уверены, что хотите отметить заказ как проваленный?')) {
            return;
        }

        setActionLoading(true);
        try {
            const response = await updateOrderStatus(order.id, 'FAILED');
            if (response.success) {
                alert(`Заказ №${order.id} отмечен как проваленный`);
                navigate(isDirector ? '/orders' : '/orders-user');
            } else {
                alert('Ошибка при отметке заказа как проваленного: ' + response.error);
            }
        } catch (error) {
            console.error('Ошибка при отметке заказа:', error);
            alert('Произошла ошибка при отметке заказа');
        } finally {
            setActionLoading(false);
        }
    };

    // Функция для утверждения заказа (только для директора)
    const handleApproveOrder = async () => {
        if (!order) return;

        setActionLoading(true);
        try {
            const response = await updateOrderStatus(order.id, 'APPROVED');
            if (response.success) {
                alert(`Заказ №${order.id} утвержден`);
                setOrder({ ...order, status: 'APPROVED' });
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

    // Функция для отклонения заказа (только для директора)
    const handleRejectOrder = async () => {
        if (!order) return;

        if (!window.confirm('Вы уверены, что хотите отклонить этот заказ?')) {
            return;
        }

        setActionLoading(true);
        try {
            const response = await updateOrderStatus(order.id, 'REJECTED');
            if (response.success) {
                alert(`Заказ №${order.id} отклонен`);
                setOrder({ ...order, status: 'REJECTED' });
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
                <Header isAuthenticated={true} onLogout={onLogout} />
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
                <Header isAuthenticated={true} onLogout={onLogout} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <h1 className={styles.title}>Заказ не найден</h1>
                        <p className={styles.error}>Заказ с ID {orderId} не существует или был удален.</p>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate(isDirector ? '/orders' : '/orders-user')}
                        >
                            Вернуться к заказам
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header isAuthenticated={true} onLogout={onLogout} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.headerSection}>
                        <h1 className={styles.title}>Заказ №{order.id}</h1>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.orderInfo}>
                            <h2 className={styles.subtitle}>{order.name || `Заказ #${order.id}`}</h2>

                            <div className={styles.details}>
                                <p><strong>Статус: </strong>
                                    <span className={`${styles.status} ${styles[`status${order.status}`]}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </p>

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

                                {order.managerId && (
                                    <p><strong>ID Ответственнго:</strong> {order.managerId}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Кнопки для директора - утверждение/отклонение */}
                    {isDirector && order.status === 'pending' && (
                        <div className={styles.directorActions}>
                            <h3 className={styles.actionsTitle}>Утверждение заказа</h3>
                            <div className={styles.statusButtons}>
                                <button
                                    onClick={handleApproveOrder}
                                    className={`${styles.button} ${styles.approveButton}`}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Обработка...' : '✅ Утвердить'}
                                </button>
                                <button
                                    onClick={handleRejectOrder}
                                    className={`${styles.button} ${styles.rejectButton}`}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Обработка...' : '❌ Отклонить'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Кнопки для выполнения/провала (доступны всем кроме директора для неподтвержденных заказов) */}
                    {order.status === 'APPROVED' && (
                        <div className={styles.userActions}>
                            <h3 className={styles.actionsTitle}>Изменение статуса выполнения</h3>
                            <div className={styles.statusButtons}>
                                <button
                                    onClick={handleMarkComplete}
                                    className={`${styles.button} ${styles.completedButton}`}
                                    disabled={actionLoading || order.status === 'COMPLETED'}
                                >
                                    {actionLoading ? 'Обработка...' : 'Выполнен'}
                                </button>
                                <button
                                    onClick={handleMarkFailed}
                                    className={`${styles.button} ${styles.failedButton}`}
                                    disabled={actionLoading || order.status === 'FAILED'}
                                >
                                    {actionLoading ? 'Обработка...' : 'Провален'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Сообщения о статусе */}
                    {order.status === 'pending' && !isDirector && (
                        <div className={styles.statusMessage}>
                            <p>⏳ Заказ ожидает утверждения директором</p>
                        </div>
                    )}

                    {order.status === 'REJECTED' && (
                        <div className={styles.statusMessage}>
                            <p>❌ Заказ отклонен директором</p>
                        </div>
                    )}

                    {order.status === 'COMPLETED' && (
                        <div className={styles.statusMessage}>
                            <p>✅ Заказ выполнен</p>
                        </div>
                    )}

                    {order.status === 'FAILED' && (
                        <div className={styles.statusMessage}>
                            <p>❌ Заказ провален</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}