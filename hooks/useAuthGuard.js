'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function useAuthGuard() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/login');
      return;
    }

    const checkAuth = async () => {
      try {
        await api.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAuthChecked(true); // ✅ Autenticado
      } catch (error) {
        console.warn('Token inválido o expirado. Redirigiendo a login...');
        localStorage.removeItem('access_token');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return isAuthChecked;
}
