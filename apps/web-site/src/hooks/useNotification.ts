import { useState, useEffect } from 'react';
import apiClient from '../utils/api';

export function useNotification(userId: string) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/users/${userId}/notifications`)
      .then(response => setNotifications(response.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { notifications, loading };
}