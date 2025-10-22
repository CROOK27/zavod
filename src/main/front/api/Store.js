import { makeAutoObservable } from "mobx";
import AuthService from "../api/AuthService";
import axios from 'axios';
import { API_URL } from "../api/index";

class Store {
    user = {};
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser (user) {
        this.user = user;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    async login(login, password) {
        try {
            const response = await AuthService.login(login, password);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            this.setAuth(true);
            this.setUser (response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(login, password) {
        try {
            await AuthService.registration(login, password);
            return { success: true };
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            await AuthService.logout(); // Удаляем переменную response
            localStorage.removeItem('access_token');
            this.setAuth(false);
            this.setUser ({});
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }


    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh-token`, { withCredentials: true });
            localStorage.setItem('access_token', response.data.accessToken);
            this.setAuth(true);
            this.setUser (response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}

export default Store;