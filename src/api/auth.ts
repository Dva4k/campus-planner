export interface User {
  id: string;
  login: string;
  name: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface UserResponse {
  user: User;
}

interface ApiErrorResponse {
  error?: string;
}

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

function getApiUrl() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      'Не указан адрес API. Добавьте EXPO_PUBLIC_API_URL в файл .env.',
    );
  }

  return apiUrl.replace(/\/+$/, '');
}

async function getErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as ApiErrorResponse;
    if (typeof body.error === 'string' && body.error.length > 0) {
      return body.error;
    }
  } catch {
    // Ответ сервера может быть не JSON.
  }

  return `Ошибка сервера (${response.status}).`;
}

export async function authorizedFetch(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`); // передача токена

  return fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers,
  });
}

export async function signIn( //отправка запроса на сервер для входа пользователя
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${getApiUrl()}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new AuthApiError(
      await getErrorMessage(response),
      response.status,
    );
  }

  const body = (await response.json()) as LoginResponse;

  if (
    typeof body.accessToken !== 'string' ||
    !body.accessToken ||
    !body.user
  ) {
    throw new Error('Сервер вернул некорректный ответ при входе.');
  }

  return body;
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await authorizedFetch('/auth/me', token);

  if (!response.ok) {
    throw new AuthApiError(
      await getErrorMessage(response),
      response.status,
    );
  }

  const body = (await response.json()) as UserResponse;

  if (!body.user) {
    throw new Error('Сервер вернул некорректные данные пользователя.');
  }

  return body.user;
}
