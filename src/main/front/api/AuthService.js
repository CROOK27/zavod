import $api from './index';

export default class AuthService {
    static async login(email, password) {
        try {
            const response = await $api.post('/auth/authenticate', {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Исправлено: используем правильные названия полей
            if (response.data.access_token && response.data.refresh_token) {
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                $api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

                return {
                    success: true,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid response from server'
                };
            }
        } catch (error) {
            this.clearTokens();
            return {
                success: false,
                error: error.response?.data?.error || error.response?.data?.message || 'Login failed'
            };
        }
    }

    static async registration(userData) {
        try {
            const response = await $api.post('/auth/register', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    static clearTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete $api.defaults.headers.common['Authorization'];
    }

    static getErrorMessage(error) {
        return error.response?.data?.error ||
               error.response?.data?.message ||
               error.message ||
               'Unknown error occurred';
    }

    static async refreshToken() {
        try {
            const refresh_token = localStorage.getItem('refresh_token');

            if (!refresh_token) {
                throw new Error('Refresh token отсутствует');
            }

            const response = await $api.post('/auth/refresh-token', {}, {
                headers: {
                    'Authorization': `Bearer ${refresh_token}`
                }
            });

            // Исправлено: используем правильные названия полей
            if (response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                $api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
                return response.data.access_token;
            } else {
                throw new Error('Invalid response from refresh token endpoint');
            }
        } catch (error) {
            this.clearTokens();
            throw error;
        }
    }

}