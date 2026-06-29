import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPostWithAuth, apiGetWithAuth } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  benefits: string;
  price: number;
  discount_percent: number;
  final_price: number;
  type: "basic" | "free" | "paid";
  duration_days: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type PlansResponse = {
  status: boolean;
  message: string;
  data: SubscriptionPlan[];
};

export type TransactionResponse = {
  id: string;
  user_id: string;
  subscription_plan_id: string;
  reference_id: string;
  product_name: string;
  payment_total: number;
  status: string;
  payment_method: string;
  payment_number: string;
  order_id: string | null;
  payment_at: string | null;
  created_at: string;
  updated_at: string;
};

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => apiGet<PlansResponse>("/api/subscription-plans"),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubscriptionPlanDetail(id: string | null) {
  return useQuery({
    queryKey: ["subscription-plan", id],
    queryFn: () => apiGet<ApiResponse<SubscriptionPlan>>(`/api/subscription-plans/${id}`),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: (payload: { subscription_plan_id: string; payment_method: string }) =>
      apiPostWithAuth<ApiResponse<TransactionResponse>>("/api/transactions", payload, token!),
  });
}

export function useTransactionDetail(id: string | null) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => apiGetWithAuth<ApiResponse<TransactionResponse>>(`/api/transactions/${id}`, token!),
    select: (res) => res.data,
    enabled: !!id && !!token,
  });
}

export function useTransactionList() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiGetWithAuth<ApiResponse<TransactionResponse[]>>("/api/transactions", token!),
    select: (res) => res.data,
    enabled: !!token,
  });
}

export type CurrentSubscription = {
  has_active: boolean;
  subscription: {
    id: string;
    user_id: string;
    transaction_id: string;
    plan_id: string;
    product_name: string;
    product_price: number;
    status: string;
    expired_at: string;
    created_at: string;
    updated_at: string;
  } | null;
  rules: {
    max_storage_mb: string;
    max_videos: string;
    clip_quality: string;
  } | null;
  usage: {
    storage_limit_mb: number;
    storage_used_bytes: number;
    storage_used_mb: string;
  } | null;
};

export function useCurrentSubscription() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["current-subscription"],
    queryFn: () => apiGetWithAuth<ApiResponse<CurrentSubscription>>("/api/orders/subscription", token!),
    select: (res) => res.data,
    enabled: !!token,
    staleTime: 30 * 1000,
  });
}
