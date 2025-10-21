import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('access_token');
            const authStatus = localStorage.getItem('isAuthenticated');
            setIsAuthenticated(!!token && authStatus === 'true');
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Проверка авторизации...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}