// src/pages/Profile.jsx

import React, { useEffect, useState } from 'react';
import ProfileEditButton from '../components/ProfileEditButton';
import CreateArticleButton from '../components/CreateArticleButton';
import AdminProfile from '../components/AdminProfile'; // Компонент модерации статей
import '../styles/Profile.css';
import { UserInfo } from '../api/api';
import Header from "../components/Header";
import Footer from '../components/Footer';

const Profile = () => {
  const [user, setUser] = useState({ login: '', image: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Токен не найден');
        }

        const response = await UserInfo(token);
        if (response.success) {
          setUser({
            name: response.data.login,
            image: 'http://127.0.0.1:8000/' + response.data.image || '../img/new_user_ico.png',
            role: response.data.role || 'user'
          });
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-header">
          <div className="user-info">
            <img
              src={user.image}
              alt={user.name}
              className="avatar"
              onError={(e) => {
                e.target.src = '../img/new_user_ico.png';
              }}
            />
            <div>
              <h2>{user.name}</h2>
            </div>
          </div>

          {/* Блок действий */}
          <div className="profile-actions-vertical">
            {/* Кнопки редактирования */}
            <ProfileEditButton />
            <CreateArticleButton />

            {/* Панель админа — только если роль admin */}
            {user.role === 'admin' && <AdminProfile />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;