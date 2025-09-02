import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { API_BASE_URL, API_KEY } from "@/utils/constants";

type BalanceContextType = {
  balance: number;
  setBalance: (value: number) => void;
  loading: boolean;
};

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/cliente/dados-perfil`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `${API_KEY}`,
        },
      });

      const data = await response.json();
      
      if (data?.info?.saldoDisponivel) {
        setBalance(Number(data.info.saldoDisponivel));
      }
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, setBalance, loading }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) throw new Error("useBalance deve ser usado dentro de um BalanceProvider");
  return context;
};
