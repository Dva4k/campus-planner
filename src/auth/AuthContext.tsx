import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  AuthApiError,
  getCurrentUser,
  signIn as signInRequest,
  type LoginCredentials,
  type User,
} from '../api/auth';
import {
  readToken,
  removeToken,
  saveToken,
} from './authStorage';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  retrySession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [restoreAttempt, setRestoreAttempt] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      setIsLoading(true);
      setAuthError(null);

      try {
        const savedToken = await readToken();

        if (!savedToken) {
          if (isMounted) {
            setUser(null);
            setAccessToken(null);
          }
          return;
        }

        const currentUser = await getCurrentUser(savedToken);

        if (isMounted) {
          setUser(currentUser);
          setAccessToken(savedToken);
        }
      } catch (error) {
        if (error instanceof AuthApiError && error.status === 401) {
          await removeToken();

          if (isMounted) {
            setUser(null);
            setAccessToken(null);
          }
        } else if (isMounted) {
          // Сеть или ошибка сервера не доказывают, что токен недействителен.
          setAuthError(
            error instanceof Error
              ? error.message
              : 'Не удалось восстановить сессию.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [restoreAttempt]);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    setAuthError(null);

    const response = await signInRequest(credentials);

    // Сначала сохраняем токен безопасно, затем меняем состояние приложения.
    await saveToken(response.accessToken);
    setAccessToken(response.accessToken);
    setUser(response.user);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await removeToken();
    } finally {
      setUser(null);
      setAccessToken(null);
      setAuthError(null);
    }
  }, []);

  const retrySession = useCallback(() => {
    setRestoreAttempt((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isLoading,
      isAuthenticated: Boolean(user && accessToken),
      authError,
      signIn,
      signOut,
      retrySession,
    }),
    [
      user,
      accessToken,
      isLoading,
      authError,
      signIn,
      signOut,
      retrySession,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
