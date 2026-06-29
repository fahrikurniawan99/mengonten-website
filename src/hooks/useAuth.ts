import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    is_verified: boolean;
    account_status: string;
  };
};

export function useSendOtp() {
  return useMutation({
    mutationFn: (email: string) =>
      apiPost<ApiResponse<unknown>>("/api/auth/login", { email }),
  });
}

export function useVerifyOtp() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      apiPost<ApiResponse<AuthResponse>>("/api/auth/verify-otp", payload),

    onSuccess: (data) => {
      login(data.data.token, data.data.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (email: string) =>
      apiPost<ApiResponse<unknown>>("/api/auth/register", { email }),
  });
}

export function useVerifyEmail() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (token: string) =>
      apiPost<ApiResponse<AuthResponse>>("/api/auth/verify-email", { token }),

    onSuccess: (data) => {
      login(data.data.token, data.data.user);
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) =>
      apiPost<ApiResponse<unknown>>("/api/auth/resend-verification", { email }),
  });
}
