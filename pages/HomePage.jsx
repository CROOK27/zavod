import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/HomePage.module.css';

export default function HomePage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login'); // 🔹 теперь это реальный переход
    };

    return (
        <div className={styles.page}>
            <Header
                isAuthenticated={false}
                onLogin={handleLogin}
            />

            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.imageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=600&fit=crop"
                            alt="Промышленное предприятие"
                            className={styles.image}
                        />
                    </div>

                    <div className={styles.textWrapper}>
                        <div className={styles.textContent}>
                            <h1 className={styles.title}>Добро пожаловать!</h1>
                            <p className={styles.description}>
                                Мы — завод имени [вставить]. Наше предприятие специализируется на
                                многопрофильной продукции и малотоннажной химии. Мы уверенно держим
                                лидерство в производстве каучуков общего и специального назначения,
                                авиационного топлива и добавок к бензинам.
                            </p>
                            <div className={styles.infoBox}>
                                <p className={styles.infoText}>
                                    Номер отдела кадров:{' '}
                                    <span className={styles.infoHighlight}>89108765436</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
