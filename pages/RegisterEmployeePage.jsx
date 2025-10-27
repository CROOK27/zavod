import React, { useState, useEffect } from 'react';
import { Factory } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RegisterEmployeePage.module.css';
import { register, getAllPositions, createEmployee, getUserByEmail } from '../api/api';

export default function RegisterEmployeePage({ onLogout }) {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        birthDate: '',
        gender: '',
        hireDate: '',
        rate: '1.0',
        positionId: ''
    });

    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPositions, setLoadingPositions] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await getAllPositions();
                if (response.success) {
                    setPositions(response.data);
                } else {
                    setError('Ошибка загрузки должностей');
                }
            } catch (error) {
                console.error('Ошибка при загрузке должностей:', error);
                setError('Ошибка при загрузке должностей');
            } finally {
                setLoadingPositions(false);
            }
        };

        fetchPositions();
    }, []);

    // Функция для определения роли на основе должности
    const getRoleByPosition = (positionId) => {
        const position = positions.find(p => p.id === parseInt(positionId));
        if (!position) return 'USER';

        const positionName = position.name.toLowerCase();

        if (positionName.includes('директор') || positionName.includes('director')) {
            return 'ADMIN';
        } else if (positionName.includes('менеджер') || positionName.includes('manager')) {
            return 'HR';
        } else {
            return 'USER';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Определяем роль на основе выбранной должности
            const userRole = getRoleByPosition(formData.positionId);

            // Регистрируем пользователя
            const userData = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: userRole // Используем определенную роль
            };

            console.log('Creating user with role:', userRole);
            const registerResponse = await register(userData);

            if (!registerResponse.success) {
                setError(registerResponse.error || 'Ошибка регистрации пользователя');
                setLoading(false);
                return;
            }

            const userResponse = await getUserByEmail(formData.email);

            if (!userResponse.success) {
                setError('Не удалось найти созданного пользователя');
                setLoading(false);
                return;
            }

            // Создаем сотрудника
            const employeeData = {
                birthDate: formData.birthDate,
                gender: formData.gender,
                hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
                rate: parseFloat(formData.rate),
                userId: userResponse.data.id,
                positionId: parseInt(formData.positionId),
                orders: null
            };

            console.log('Employee data:', employeeData);
            const employeeResponse = await createEmployee(employeeData);
            console.log("RegisterEmployeePage Response: ", employeeResponse);

            if (employeeResponse.success) {
                alert(`Сотрудник успешно зарегистрирован! Роль: ${userRole}`);
                navigate('/profile');
            } else {
                setError(employeeResponse.error || 'Ошибка создания профиля сотрудника');
            }

        } catch (error) {
            console.error('Ошибка при регистрации сотрудника:', error);
            setError('Произошла ошибка при регистрации сотрудника');
        } finally {
            setLoading(false);
        }
    };

    // Дополнительно: можно показать выбранную роль пользователю
    const selectedRole = formData.positionId ? getRoleByPosition(formData.positionId) : '';

    if (loadingPositions) {
        return (
            <div className={styles.page}>
                <div className={styles.formContainer}>
                    <div className={styles.loading}>Загрузка данных...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.formContainer}>
                <div className={styles.logo}>
                    <Factory size={36} color="#333" />
                    <h1 className={styles.logoText}>Регистрация сотрудника</h1>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.row}>
                        <input
                            type="text"
                            name="firstname"
                            placeholder="Имя"
                            value={formData.firstname}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="given-name"
                            required
                            disabled={loading}
                        />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Фамилия"
                            value={formData.lastname}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="family-name"
                            required
                            disabled={loading}
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        autoComplete="email"
                        required
                        disabled={loading}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Телефон"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.input}
                        autoComplete="tel"
                        required
                        disabled={loading}
                    />

                    <div className={styles.row}>
                        <input
                            type="date"
                            name="birthDate"
                            placeholder="Дата рождения"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="bday"
                            required
                            disabled={loading}
                        />
                        <input
                            type="date"
                            name="hireDate"
                            placeholder="Дата найма"
                            value={formData.hireDate}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="off"
                            required
                            disabled={loading}
                        />
                    </div>

                    <select
                        name="positionId"
                        value={formData.positionId}
                        onChange={handleChange}
                        className={styles.select}
                        required
                        disabled={loading}
                    >
                        <option value="">Выберите должность</option>
                        {positions.map(position => (
                            <option key={position.id} value={position.id}>
                                {position.name}
                            </option>
                        ))}
                    </select>

                    {/* Показываем автоматически определенную роль */}
                    {selectedRole && (
                        <div className={styles.roleInfo}>
                            <strong>Автоматически назначенная роль:</strong>
                            {selectedRole === 'ADMIN' && ' Администратор (Директор)'}
                            {selectedRole === 'HR' && ' Менеджер'}
                            {selectedRole === 'USER' && ' Пользователь'}
                        </div>
                    )}

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={styles.select}
                        required
                        disabled={loading}
                    >
                        <option value="">Выберите пол</option>
                        <option value="M">Мужской</option>
                        <option value="W">Женский</option>
                    </select>

                    <input
                        type="number"
                        name="rate"
                        placeholder="Ставка (например, 1.0)"
                        value={formData.rate}
                        onChange={handleChange}
                        className={styles.input}
                        step="0.1"
                        min="0.1"
                        max="2.0"
                        autoComplete="off"
                        required
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Регистрация...' : 'Создать профиль'}
                    </button>
                </form>
            </div>
        </div>
    );
}