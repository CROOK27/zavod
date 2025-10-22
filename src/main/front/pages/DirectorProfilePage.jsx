import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/DirectorProfilePage.module.css';
import { getAllOrders, getEmployeeById } from '../api/api';

export default function DirectorProfilePage({ user, onLogout }) {
    const navigate = useNavigate();
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ... остальной код ...

    return (
        <div className={styles.page}>
            {/* Передаем onLogout в Header */}
            <Header
                isAuthenticated={true}
                isDirector={true}
                onLogout={onLogout}
            />

            <main className={styles.main}>
                {/* ... остальной код ... */}
            </main>

            <Footer />
        </div>
    );
}