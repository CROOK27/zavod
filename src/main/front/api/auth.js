export const auth = {
  // Получить текущего пользователя
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  // Проверить авторизацию
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true' &&
           localStorage.getItem('access_token') !== null;
  },

  // Выйти
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Перенаправляем на главную страницу
    window.location.href = '/';
  }
};