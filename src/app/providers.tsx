"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toast } from "@heroui/react";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000 } },
      })
  );

  return (
      <QueryClientProvider client={queryClient}>
        <Toast.Provider placement="top" />
        {children}
      </QueryClientProvider>
  );
}
