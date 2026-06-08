"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { useCart } from "@/store/cart-provider";
import { formatKRW } from "@/lib/utils";

export default function CartPage() {
  const { items, total, setQty, remove } = useCart();

  return (
    <main className="relative min-h-[100dvh] pb-24">
      <Starfield count={15} />
      <TopBar title="장바구니" back />
      <div className="relative z-10 px-4 py-4">
        {items.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="담은 굿즈가 없어요"
            description="마음에 드는 굿즈를 담아보세요"
            action={
              <Link href="/shop">
                <Button>굿즈 보러가기</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {items.map(({ product, quantity }) => (
              <Card key={product.id} className="flex items-center gap-3 p-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-2xl" style={{ background: `linear-gradient(135deg, ${product.theme_color}, #0D1028)` }}>
                  🎁
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{product.name}</p>
                  <p className="text-sm font-semibold text-accent">{formatKRW(product.price)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <button onClick={() => setQty(product.id, quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-elevated">
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-ink">{quantity}</span>
                    <button onClick={() => setQty(product.id, quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-elevated">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button onClick={() => remove(product.id)} className="text-ink-muted hover:text-error">
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-16 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-line bg-surface/95 p-4 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-ink-soft">총 결제금액</span>
            <span className="text-lg font-extrabold text-accent">{formatKRW(total)}</span>
          </div>
          <Link href="/shop/checkout">
            <Button size="lg" className="w-full">주문하기</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
