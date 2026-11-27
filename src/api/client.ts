const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');

let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export function setUnauthorizedHandler(
  handler: (() => void | Promise<void>) | null,
) {
  unauthorizedHandler = handler;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error('Не указан EXPO_PUBLIC_API_URL в файле .env');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    await unauthorizedHandler?.();
    throw new ApiError('Сессия недействительна. Выполните вход повторно.', 401);
  }

  if (!response.ok) {
    let message = `Ошибка сервера (${response.status})`;

    try {
      const body = await response.json();
      if (typeof body.error === 'string') {
        message = body.error;
      }
    } catch {
      // Сервер мог вернуть не JSON.
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}