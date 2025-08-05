import React from 'react';
import './NotificationPanel.css';

export const NotificationPanel = ({ 
  notifications, 
  onNotificationClick, 
  unreadCount 
}) => {
  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </div>
      <div className="notifications-list">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`notification-item ${notification.unread ? 'unread' : ''}`}
            onClick={() => onNotificationClick(notification.id)}
          >
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-description">{notification.description}</div>
              <div className="notification-footer">
                <div className="notification-time">{notification.time}</div>
                {notification.actionText && (
                  <div className="notification-action">{notification.actionText} →</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
