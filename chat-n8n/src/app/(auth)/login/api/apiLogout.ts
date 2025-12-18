// src/app/api/apiLogout.ts
import { deleteCookie } from 'cookies-next';

export async function apiLogout() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const erro = await response.json().catch(() => null);
      throw new Error(erro?.erro || 'Erro ao sair');
    }

    deleteCookie('token', {
      path: '/',
    });

    return response.json();
  } catch (error) {
    deleteCookie('token', {
      path: '/',
    });
    throw error;
  }
}
