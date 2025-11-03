import axios from 'axios';
import AuthService from './AuthService';
export const API_URL = 'http://localhost:8080/api/v1';

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

$api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh_token = localStorage.getItem('refresh_token');

                if (!refresh_token) {
                    console.error('Refresh token отсутствует');
                    throw new Error('Refresh token отсутствует');
                }

                // Исправлено: правильный endpoint и обработка ответа
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                    headers: {
                        'Authorization': `Bearer ${refresh_token}`
                    }
                });

                // Исправлено: правильные названия полей
                if (response.data.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);
                    $api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
                    return $api.request(originalRequest);
                } else {
                    throw new Error('Invalid refresh token response');
                }
            } catch (e) {
                console.error('Ошибка при обновлении токена:', e);
                AuthService.clearTokens();
                // Перенаправляем на страницу логина
                window.location.href = '/login';
                throw e;
            }
        }

        return Promise.reject(error);
    }
);

$api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export default $api;