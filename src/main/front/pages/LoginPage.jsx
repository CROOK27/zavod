import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Store from '../store/Store';
import '../styles/Login.css';
import Header from "../components/Header"
import Footer from '../components/Footer';

const Login = observer(() => {
  const navigate = useNavigate();
  const store = new Store();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await store.login(formData.username, formData.password);

      if (store.isAuth) {
        navigate('/profile');
      } else {
        setError("Ошибка входа");
      }
    } catch (err) {
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <h2>Вход в систему</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <FormInput label="Логин" type="text" name="username" value={formData.username} onChange={handleChange} required />
          <FormInput label="Пароль" type="password" name="password" value={formData.password} onChange={handleChange} required />
          <button type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
        <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
      </div>
      <Footer />
    </>
  );
});

export default Login;