import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/CreatePlanPage.module.css';
import { createOrder, getAllBranches, getAllEmployees } from '../api/api';

export default function CreatePlanPage({ onNavigate, onLogout }) {
    const [formData, setFormData] = useState({
        companyName: '',
        orderName: '',
        workshop: '',
        executor: '',
        quest: ''
    });

    const [workshops, setWorkshops] = useState([]);
    const [executors, setExecutors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Загрузка данных для селектов с бэкенда
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);

                // Получаем филиалы (как цеха)
                const branchesResponse = await getAllBranches();
                if (branchesResponse.success) {
                    setWorkshops(branchesResponse.data.map(branch => ({
                        id: branch.id,
                        name: branch.nameBranch
                    })));
                }

                // Получаем сотрудников (как исполнителей)
                const employeesResponse = await getAllEmployees();
                if (employeesResponse.success) {
                    setExecutors(employeesResponse.data.map(employee => ({
                        id: employee.id,
                        name: employee.getFullName ? employee.getFullName() :
                              (employee.user ? `${employee.user.firstname} ${employee.user.lastname}` : 'Неизвестно')
                    })));
                }

            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                alert('Ошибка при загрузке данных');
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Создаем объект заказа для отправки на бэкенд
            const orderData = {
                name: formData.orderName,
                customer: formData.companyName,
                quest: formData.quest,
                managerId: parseInt(formData.executor)
            };

            const response = await createOrder(orderData);

            if (response.success) {
                alert('Заказ успешно создан!');

                // Очистка формы
                setFormData({
                    companyName: '',
                    orderName: '',
                    workshop: '',
                    executor: '',
                    quest: ''
                });

                // Перенаправление на страницу заказов или другую страницу
                if (onNavigate) {
                    onNavigate('orders');
                }
            } else {
                alert(`Ошибка при создании заказа: ${response.error}`);
            }

        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            alert('Ошибка при создании заказа');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return formData.companyName.trim() !== '' &&
            formData.orderName.trim() !== '' &&
            formData.workshop !== '' &&
            formData.executor !== '';
    };

    if (loadingData) {
        return (
            <div className={styles.page}>
                <Header
                    isAuthenticated={true}
                    onLogout={onLogout}
                    onNavigate={onNavigate}
                />
                <main className={styles.main}>
                    <div className={styles.loading}>Загрузка данных...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header
                isAuthenticated={true}
                onLogout={onLogout}
                onNavigate={onNavigate}
            />

            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Создание заказа</h1>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Название фирмы-заказчика</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Введите название компании"
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Филиал (цех)</label>
                            <select
                                name="workshop"
                                value={formData.workshop}
                                onChange={handleChange}
                                className={styles.select}
                                required
                            >
                                <option value="">Выберите филиал</option>
                                {workshops.map(workshop => (
                                    <option key={workshop.id} value={workshop.id}>
                                        {workshop.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Менеджер (исполнитель)</label>
                            <select
                                name="executor"
                                value={formData.executor}
                                onChange={handleChange}
                                className={styles.select}
                                required
                            >
                                <option value="">Выберите менеджера</option>
                                {executors.map(executor => (
                                    <option key={executor.id} value={executor.id}>
                                        {executor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Название заказа</label>
                            <input
                                type="text"
                                name="orderName"
                                value={formData.orderName}
                                onChange={handleChange}
                                placeholder="Введите название заказа"
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Описание заказа</label>
                            <textarea
                                name="quest"
                                value={formData.quest}
                                onChange={handleChange}
                                placeholder="Введите описание заказа"
                                className={styles.textarea}
                                rows="4"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={!isFormValid() || loading}
                        >
                            {loading ? 'Создание заказа...' : 'Создать заказ'}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}