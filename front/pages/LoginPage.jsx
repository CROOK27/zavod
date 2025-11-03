import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Eye, EyeOff } from 'lucide-react';
import { getUserByEmail } from '../api/api';
import Store from '../api/Store';
import styles from '../styles/LoginPage.module.css';

export default function LoginPage({ onLogin }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const store = new Store();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Очищаем ошибку при изменении поля
        if (error) setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Пытаемся выполнить вход
            const response = await store.login(formData.email, formData.password);

            // Если успешно, получаем данные пользователя
            const userData = await getUserByEmail(formData.email);

            // Сохраняем данные в localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');

            // Ждем немного для гарантии сохранения
            await new Promise(resolve => setTimeout(resolve, 100));

            // Вызываем callback авторизации
            if (onLogin) onLogin(userData);

            await new Promise(resolve => setTimeout(resolve, 50));
            console.log("userData: ", userData);

            // Определяем путь для перенаправления
            const redirectPath =
                userData.data.role === 'ADMIN' ? '/director' :
                userData.data.role === 'MANAGER' ? '/manager' :
                '/profile';

            console.log('Перенаправление на:', redirectPath);
            navigate(redirectPath);

        } catch (err) {
            console.error('Ошибка авторизации:', err);

            // Проверяем тип ошибки
            if (err.response) {
                // Ошибка от сервера с HTTP статусом
                const status = err.response.status;
                const message = err.response.data?.message || err.response.data?.error;

                if (status === 401 || status === 403) {
                    setError('Неверный email или пароль');
                } else if (status >= 500) {
                    setError('Ошибка сервера. Попробуйте позже.');
                } else if (message) {
                    setError(message);
                } else {
                    setError('Произошла ошибка при авторизации');
                }
            } else if (err.request) {
                // Ошибка сети
                setError('Ошибка соединения с сервером. Проверьте интернет.');
            } else if (err.message) {
                // Другие ошибки
                if (err.message.includes('401') || err.message.includes('Unauthorized')) {
                    setError('Неверный email или пароль');
                } else {
                    setError(err.message);
                }
            } else {
                setError('Неверный email или пароль');
            }
        } finally {
            setIsLoading(false);
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

                    <div className={styles.passwordContainer}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.passwordInput}
                            required
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
}