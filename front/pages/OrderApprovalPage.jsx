import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/OrderApprovalPage.module.css';
import { getOrderById, updateOrderStatus, deleteOrder } from '../api/api'; // Добавлен getOrderPdf

export default function OrderApprovalPage({ user, onLogout }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false); // Состояние для загрузки PDF
    const [deleteCountdown, setDeleteCountdown] = useState(null);
    const { orderId } = useParams();
    const navigate = useNavigate();

    // Проверяем роль пользователя
    const isDirector = user?.role === 'ADMIN';
    const canChangeStatus = user?.role === 'HR' || user?.role === 'USER' || isDirector;

    // Функция для скачивания PDF
   const handleDownloadPdf = async () => {
       if (!order) return;

       setPdfLoading(true);
       try {
           const response = await getOrderPdf(order.id);

           if (response.success) {
               // Создаем blob из полученных данных
               const blob = new Blob([response.data], { type: 'application/pdf' });

               // Создаем URL для скачивания
               const url = window.URL.createObjectURL(blob);
               const link = document.createElement('a');
               link.href = url;

               // Формируем имя файла БЕЗ русских букв
               const fileName = `order_${order.id}.pdf`;
               link.download = fileName;

               // Инициируем скачивание
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);

               // Освобождаем память
               window.URL.revokeObjectURL(url);

               console.log('PDF успешно скачан');
           } else {
               alert('Ошибка при загрузке PDF: ' + response.error);
           }
       } catch (error) {
           console.error('Ошибка при скачивании PDF:', error);
           alert('Произошла ошибка при скачивании PDF');
       } finally {
           setPdfLoading(false);
       }
   };

    const startDeleteCountdown = () => {
        if (!window.confirm('Вы уверены, что хотите удалить этот заказ? Запись будет удалена через 5 секунд.')) {
            return;
        }

        setDeleteCountdown(5); // Начинаем отсчет с 5 секунд

        const countdownInterval = setInterval(() => {
            setDeleteCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    handleDeleteOrder(); // Запускаем удаление когда отсчет закончился
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Функция для отмены удаления
    const cancelDelete = () => {
        setDeleteCountdown(null);
    };

    // Функция удаления заказа
    const handleDeleteOrder = async () => {
        if (!order) return;

        setActionLoading(true);
        try {
            const response = await deleteOrder(order.id);
            if (response.success) {
                alert('Заказ успешно удален');
                navigate('/orders'); // Возвращаемся к списку заказов
            } else {
                alert('Ошибка при удалении заказа: ' + response.error);
                setDeleteCountdown(null);
            }
        } catch (error) {
            console.error('Ошибка при удалении заказа:', error);
            alert('Произошла ошибка при удалении заказа');
            setDeleteCountdown(null);
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!orderId) {
                    setLoading(false);
                    return;
                }

                const response = await getOrderById(orderId);
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

    // Функция для утверждения заказа (только для директора)
    const handleApprove = async () => {
        if (!order) return;

        setActionLoading(true);
        try {
            const response = await updateOrderStatus(order.id, 'APPROVED');
            if (response.success) {
                alert('Заказ утвержден');
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
    const handleReject = async () => {
        if (!order) return;

        if (!window.confirm('Вы уверены, что хотите отклонить этот заказ?')) {
            return;
        }

        setActionLoading(true);
        try {
            const response = await updateOrderStatus(order.id, 'REJECTED');
            if (response.success) {
                alert('Заказ отклонен');
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

    // Функция для изменения статуса выполнения (для всех, кто может менять статус)
    const handleStatusChange = async (newStatus) => {
        if (!order) return;

        setActionLoading(true);
        try {
            const response = await updateOrderStatus(order.id, newStatus);
            if (response.success) {
                alert(`Статус заказа изменен на: ${getStatusText(newStatus)}`);
                setOrder({ ...order, status: newStatus });
            } else {
                alert('Ошибка при изменении статуса: ' + response.error);
            }
        } catch (error) {
            console.error('Ошибка при изменении статуса:', error);
            alert('Произошла ошибка при изменении статуса');
        } finally {
            setActionLoading(false);
        }
    };

    // Функция для получения текста статуса
    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Ожидание утверждения',
            'APPROVED': 'Утвержден',
            'COMPLETED': 'Выполнен',
            'FAILED': 'Провален',
            'IN_PROGRESS': 'В работе',
            'REJECTED': 'Отклонен'
        };
        return statusMap[status] || status;
    };

    // Функция для получения класса статуса
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

    if (loading) {
        return (
            <div className={styles.page}>
                <Header isAuthenticated={true} onLogout={onLogout} user={user} />
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
                <Header isAuthenticated={true} onLogout={onLogout} user={user} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <h1 className={styles.title}>Заказ не найден</h1>
                        <p className={styles.error}>Заказ с ID {orderId} не существует или был удален.</p>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate('/orders')}
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
            <Header isAuthenticated={true} onLogout={onLogout} user={user} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.headerSection}>
                        <h1 className={styles.title}>
                            {isDirector && order.status === 'pending' ? 'Утверждение заказа' : 'Информация о заказе'}
                        </h1>
                    </div>

                    <div className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <h2 className={styles.orderTitle}>
                                {order.name || `Заказ #${order.id}`}
                            </h2>
                            <span className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>
                        </div>

                        <div className={styles.orderDetails}>
                            <div className={styles.detailItem}>
                                <strong>Заказчик:</strong> {order.customer || 'Не указан'}
                            </div>

                            {order.quest && (
                                <div className={styles.detailItem}>
                                    <strong>Описание:</strong> {order.quest}
                                </div>
                            )}

                            {order.deadline && (
                                <div className={styles.detailItem}>
                                    <strong>Срок выполнения:</strong> {new Date(order.deadline).toLocaleDateString()}
                                </div>
                            )}

                            {order.managerName && (
                                <div className={styles.detailItem}>
                                    <strong>Ответственный:</strong> {order.managerName}
                                </div>
                            )}
                        </div>

                        {isDirector && (
                            <div className={styles.deleteSection}>
                                <h3 className={styles.deleteTitle}>Управление заказом</h3>

                                {!deleteCountdown ? (
                                    <button
                                        className={styles.deleteButton}
                                        onClick={startDeleteCountdown}
                                        disabled={actionLoading}
                                    >
                                        🗑️ Удалить заказ
                                    </button>
                                ) : (
                                    <div className={styles.countdownSection}>
                                        <p className={styles.countdownText}>
                                            Удаление через: <strong>{deleteCountdown} сек.</strong>
                                        </p>
                                        <div className={styles.countdownButtons}>
                                            <button
                                                className={styles.confirmDeleteButton}
                                                onClick={handleDeleteOrder}
                                                disabled={actionLoading}
                                            >
                                                ✅ Удалить сейчас
                                            </button>
                                            <button
                                                className={styles.cancelDeleteButton}
                                                onClick={cancelDelete}
                                                disabled={actionLoading}
                                            >
                                                ❌ Отменить удаление
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* БЛОК ДЛЯ ДИРЕКТОРА - УТВЕРЖДЕНИЕ ЗАКАЗА */}
                        {isDirector && order.status === 'pending' && (
                            <div className={styles.approvalActions}>
                                <h3 className={styles.actionsTitle}>Утверждение заказа</h3>
                                <div className={styles.buttons}>
                                    <button
                                        className={styles.approveButton}
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Утверждение...' : '✅ Утвердить заказ'}
                                    </button>
                                    <button
                                        className={styles.rejectButton}
                                        onClick={handleReject}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Отклонение...' : '❌ Отклонить заказ'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* БЛОК ДЛЯ ВСЕХ - ИЗМЕНЕНИЕ СТАТУСА ВЫПОЛНЕНИЯ */}
                        {canChangeStatus && order.status !== 'pending' && order.status !== 'REJECTED' && (
                            <div className={styles.statusActions}>
                                <h3 className={styles.actionsTitle}>Изменение статуса выполнения</h3>
                                <div className={styles.buttons}>
                                    {order.status === 'APPROVED' && (
                                        <button
                                            className={styles.inProgressButton}
                                            onClick={() => handleStatusChange('IN_PROGRESS')}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Обновление...' : '🔄 В работу'}
                                        </button>
                                    )}
                                    {(order.status === 'APPROVED' || order.status === 'IN_PROGRESS') && (
                                        <button
                                            className={styles.completeButton}
                                            onClick={() => handleStatusChange('COMPLETED')}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Обновление...' : '✅ Выполнен'}
                                        </button>
                                    )}
                                    {(order.status === 'APPROVED' || order.status === 'IN_PROGRESS') && (
                                        <button
                                            className={styles.failButton}
                                            onClick={() => handleStatusChange('FAILED')}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Обновление...' : '❌ Провален'}
                                        </button>
                                    )}
                                    {order.status === 'COMPLETED' && (
                                        <button
                                            className={styles.inProgressButton}
                                            onClick={() => handleStatusChange('IN_PROGRESS')}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Обновление...' : '🔄 Вернуть в работу'}
                                        </button>
                                    )}
                                    {order.status === 'FAILED' && (
                                        <button
                                            className={styles.inProgressButton}
                                            onClick={() => handleStatusChange('IN_PROGRESS')}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Обновление...' : '🔄 Возобновить работу'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ИНФОРМАЦИЯ ДЛЯ ПРОСМОТРА */}
                        {order.status === 'pending' && !isDirector && (
                            <div className={styles.statusInfo}>
                                <p className={styles.pendingInfo}>⏳ Заказ ожидает утверждения директором</p>
                            </div>
                        )}

                        {order.status === 'REJECTED' && (
                            <div className={styles.statusInfo}>
                                <p className={styles.rejectedInfo}>❌ Заказ был отклонен директором</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.navigation}>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate('/orders')}
                        >
                            ← Вернуться к списку заказов
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}