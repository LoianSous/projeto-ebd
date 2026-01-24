import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  userId: string | null;
  userName: string | null;
  signIn: (token: string, userId: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  token: null,
  userId: null,
  userName: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  /**
   * 🔎 Verifica sessão salva
   */
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("autToken");
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedUserName = await AsyncStorage.getItem("userName");

        if (storedToken && storedUserId) {
          setToken(storedToken);
          setUserId(storedUserId);
          setUserName(storedUserName);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("Erro ao carregar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  /**
   * ✅ Login / Pós-cadastro
   */
  const signIn = async (token: string, userId: string, name?: string) => {
    try {
      await AsyncStorage.setItem("autToken", token);
      await AsyncStorage.setItem("userId", userId);

      if (name) {
        await AsyncStorage.setItem("userName", name);
        setUserName(name);
      }

      setToken(token);
      setUserId(userId);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Erro ao fazer login:", error);
      throw error;
    }
  };

  /**
   * 🚪 Logout
   */
  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove([
        "autToken",
        "userId",
        "userName",
      ]);
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
    } finally {
      setToken(null);
      setUserId(null);
      setUserName(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        token,
        userId,
        userName,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
