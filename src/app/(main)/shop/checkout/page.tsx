"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { useCart } from "@/store/cart-provider";
import { useUser } from "@/store/user-provider";
import { useToast } from "@/store/toast-provider";
import { formatKRW } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const { profile, earnBadge } = useUser();
  const toast = useToast();
  const [form, setForm] = useState({ name: profile?.nickname ?? "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <main className="relative min-h-[100dvh]">
        <TopBar title="주문" back />
        <EmptyState icon="🧾" title="주문할 상품이 없어요" />
      </main>
    );
  }

  const pay = () => {
    if (!form.name || !form.phone || !form.address) {
      return toast("배송 정보를 모두 입력해 주세요.");
    }
    setLoading(true);
    setTimeout(() => {
      earnBadge("ac-shopper");
      clear();
      setLoading(false);
      toast("주문이 완료됐어요! 🎉");
      router.replace("/home");
    }, 800);
  };

  return (
    <main className="relative min-h-[100dvh] pb-28">
      <Starfield count={15} />
      <TopBar title="주문/결제" back />
      <div className="relative z-10 space-y-5 px-4 py-4">
        <Card className="space-y-3 p-4">
          <p className="text-sm font-bold text-ink">배송 정보</p>
          <Input label="받는 분" value={form.name} onChange={set("name")} />
          <Input label="연락처" placeholder="010-0000-0000" value={form.phone} onChange={set("phone")} />
          <Input label="주소" placeholder="배송 주소" value={form.address} onChange={set("address")} />
        </Card>

        <Card className="p-4">
          <p className="mb-3 text-sm font-bold text-ink">주문 상품 ({items.length})</p>
          <div className="space-y-2">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-ink-soft">{product.name} × {quantity}</span>
                <span className="font-semibold text-ink">{formatKRW(product.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-line pt-3">
            <span className="font-bold text-ink">합계</span>
            <span className="text-lg font-extrabold text-accent">{formatKRW(total)}</span>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-bold text-ink">결제 수단</p>
          <p className="mt-1 text-sm text-ink-muted">데모 결제 (실제 결제되지 않습니다)</p>
        </Card>
      </div>

      <div className="fixed bottom-16 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-line bg-surface/95 p-4 backdrop-blur">
        <Button size="lg" className="w-full" disabled={loading} onClick={pay}>
          {loading ? "결제 중..." : `${formatKRW(total)} 결제하기`}
        </Button>
      </div>
    </main>
  );
}
