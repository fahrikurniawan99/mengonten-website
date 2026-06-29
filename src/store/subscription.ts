import { create } from "zustand";

type SubscriptionState = {
  selectedPlanId: string | null;
  setSelectedPlanId: (id: string | null) => void;
};

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  selectedPlanId: null,
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
}));
