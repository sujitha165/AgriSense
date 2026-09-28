import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Scan, ShieldAlert, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppNotification } from '../../types';
import { LocalDB, apiRequest } from '../../services/api';
import { formatDate } from '../../utils/formatters';

export const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    const list = LocalDB.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    // Re-check periodically
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(updated);
    LocalDB.saveNotifications(updated);
    try {
      await apiRequest('/notifications/read-all', { method: 'PUT' });
    } catch (e) {
      // ignore
    }
  };

  const markAsRead = (id: number) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, is_read: true } : n));
    setNotifications(updated);
    LocalDB.saveNotifications(updated);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return <Scan className="w-4 h-4 text-agri-600 dark:text-agri-400" />;
      case 'treatment':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'scheme':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-stone-200 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-darkbg-input transition-colors shadow-xs"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-darkbg-border bg-stone-50/70 dark:bg-darkbg-surface/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-agri-100 dark:bg-agri-950 text-agri-700 dark:text-agri-300 px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-agri-600 dark:text-agri-400 hover:underline font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-darkbg-border">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-stone-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3.5 transition-colors flex gap-3 ${
                    notif.is_read
                      ? 'bg-transparent hover:bg-stone-50 dark:hover:bg-darkbg-input/50 opacity-80'
                      : 'bg-agri-50/40 dark:bg-agri-950/20 hover:bg-agri-50/70'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-darkbg-card border border-stone-200/80 dark:border-darkbg-border shrink-0 self-start shadow-2xs">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {formatDate(notif.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-block mt-1.5 text-[11px] font-medium text-agri-600 dark:text-agri-400 hover:underline"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
