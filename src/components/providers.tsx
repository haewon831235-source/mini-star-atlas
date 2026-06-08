"use client";

import { UserProvider } from "@/store/user-provider";
import { CartProvider } from "@/store/cart-provider";
import { ToastProvider } from "@/store/toast-provider";
import { SettingsProvider } from "@/store/settings-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <UserProvider>
        <CartProvider>
          <ToastProvider>{children}</ToastProvider>
        </CartProvider>
      </UserProvider>
    </SettingsProvider>
  );
}
