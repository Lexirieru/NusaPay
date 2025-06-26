import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// =====================
// TIPE DATA
// =====================
interface AuthUser {
  companyId: string; //ambil dari ID google
  email: string;
  companyName?: string;
  walletAddress?: string;
  networkChainId?: string;
}
interface AuthResponse {
  authenticated: boolean;
  user?: AuthUser;
}

interface AddEmployeePayload {
  companyId: string;
  companyName: string;
  name: string;
  bankCode: string;
  bankAccount: string;
  bankAccountName: string;
  walletAddress: string;
  networkChainId: number;
  amountTransfer: number;
}

interface editEmployeePayload {
  _id: string;
  bankCode: string;
  bankAccount: string;
  bankAccountName: string;
  amountTransfer: number;
}

interface ErrorResponse {
  message?: string;
}

// =====================
// KONFIGURASI AXIOS
// =====================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// INTERCEPTOR
// =====================
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject({ message: "Request timeout" });
    }
    return Promise.reject(error.response?.data || { message: "Unknown error" });
  }
);

// =====================
// HOOK CEK AUTH
// =====================
export const useAuthCheck = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get<AuthResponse>("/check-auth");
        if (res.data.authenticated && res.data.user) {
          setUser(res.data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return user;
};

// =====================
// FUNGSI API
// =====================

export const addEmployeeData = async (
  payload: AddEmployeePayload
): Promise<void> => {
  const response = await api.post("/addEmployeeData", payload);
  return response.data;
};

export const editEmployeeData = async (
  payload: editEmployeePayload
): Promise<void> => {
  const response = await api.post("/editEmployeeData", payload);
  return response.data;
};

export const logout = async () => {
  await api.post("/logout"); // backend akan hapus cookie
};

// };
