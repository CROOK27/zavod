import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory } from 'lucide-react';
import {getUserByEmail} from '../api/api';
import Store  from '../api/Store'; // ← импорт функции логина
import styles from '../styles/LoginPage.module.css';

export default function LoginPage ({ onLogin }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const store = new Store();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 🔹 Запрос к API
            const response = await store.login(formData.email, formData.password);

            const userData = await getUserByEmail(formData.email);
            localStorage.setItem('user', userData);
            localStorage.setItem('isAuthenticated', 'true');
            await new Promise(resolve => setTimeout(resolve, 100));
            if (onLogin) onLogin(userData);
            await new Promise(resolve => setTimeout(resolve, 50));
            console.log("userData: ", userData);
            const redirectPath = userData.data.role === 'ADMIN' ? '/director' : '/profile';
            console.log('Перенаправление на:', redirectPath);
            navigate(redirectPath);
        } catch (err) {
            console.error('Ошибка авторизации:', err);
            setError('Ошибка при обращении к серверу. Попробуйте позже.');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.formContainer}>
                <div className={styles.logo}>
                    <Factory size={36} color="#333" />
                    <h1 className={styles.logoText}>Zavod.ru</h1>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.button}>
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}
