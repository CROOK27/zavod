import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/CreatePositionPage.module.css';
import { createPosition } from '../api/api';

export default function CreatePositionPage({ onLogout }) {
    const [formData, setFormData] = useState({
        name: '',
        salary: '',
        grade: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const positionData = {
                name: formData.name,
                salary: parseFloat(formData.salary),
                grade: parseInt(formData.grade)
            };

            const response = await createPosition(positionData);

            if (response.success) {
                alert('Должность успешно создана!');
                navigate('/director'); // или другую страницу
            } else {
                setError(response.error);
            }
        } catch (err) {
            console.error('Ошибка при создании должности:', err);
            setError('Произошла ошибка при создании должности');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return formData.name.trim() !== '' &&
               formData.salary !== '' &&
               formData.grade !== '';
    };

    return (
        <div className={styles.page}>
            <Header isAuthenticated={true} onLogout={onLogout} />

            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Создание новой должности</h1>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Название должности</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Введите название должности"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Зарплата</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Введите зарплату"
                                step="0.01"
                                min="0"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Грейд</label>
                            <input
                                type="number"
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Введите грейд"
                                min="1"
                                max="10"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.buttons}>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={!isFormValid() || loading}
                            >
                                {loading ? 'Создание...' : 'Создать должность'}
                            </button>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => navigate('/positions')}
                                disabled={loading}
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}