import React from 'react';
import { Phone } from 'lucide-react';
import styles from '../styles/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.support}>
                    <Phone className={styles.supportIcon} />
                    <span>Техническая поддержка: 8 800 5353535</span>
                </div>

                <div className={styles.social}>
                    <span className={styles.socialLabel}>Наши ресурсы:</span>

                    <a
                        href="https://vk.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.socialLink} ${styles.socialLinkVk}`}
                        aria-label="ВКонтакте"
                    >
                        <svg className={styles.socialIcon} viewBox="0 0 24 24">
                            <path d="M12.785 16.241s.288-.032.436-.194c.136-.149.131-.427.131-.427s-.019-1.304.57-1.496c.58-.189 1.325 1.26 2.115 1.818.597.422 1.05.329 1.05.329l2.111-.03s1.104-.07.581-.961c-.48-.815-1.351-1.729-1.351-1.729s-1.097-.949-2.237-.113c-.99.725-.78 1.231-.78 1.231s.239.395.606.746c.618.592 1.086.96 1.086.96l.001-.001z"/>
                        </svg>
                    </a>

                    <a
                        href="https://t.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.socialLink} ${styles.socialLinkTelegram}`}
                        aria-label="Telegram"
                    >
                        <svg className={styles.socialIcon} viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-.99.53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.04-.75 4.08-1.77 6.8-2.94 8.15-3.51 3.88-1.62 4.69-1.9 5.21-1.91.12 0 .38.03.55.17.14.12.18.27.2.38-.01.06.01.24 0 .38z"/>
                        </svg>
                    </a>

                    <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.socialLink} ${styles.socialLinkYoutube}`}
                        aria-label="YouTube"
                    >
                        <svg className={styles.socialIcon} viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}