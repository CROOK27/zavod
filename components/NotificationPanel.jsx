import React from "react";
import styles from "../styles/NotificationPanel.module.css";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function NotificationPanel({ notifications, onNotificationClick }) {
    return (
        <div className={styles.panel}>
            {notifications.length === 0 ? (
                <p className={styles.empty}>Нет уведомлений</p>
            ) : (
                notifications.map((note) => (
                    <div
                        key={note.id}
                        className={`${styles.notification} ${styles[note.type]}`}
                        onClick={() => onNotificationClick(note.id)}
                    >
                        {note.type === "success" && <CheckCircle size={18} />}
                        {note.type === "error" && <XCircle size={18} />}
                        {note.type === "info" && <Info size={18} />}
                        <span>{note.message}</span>
                    </div>
                ))
            )}
        </div>
    );
}
