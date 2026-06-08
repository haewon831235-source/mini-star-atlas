"use client";

import { use, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-provider";
import { useToast } from "@/store/toast-provider";
import { getProductById } from "@/data/products";
import { getCharacterById } from "@/data/characters";
import { formatKRW } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { add } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);

  const product = getProductById(id);
  if (!product) return notFound();
  const character = product.character_id ? getCharacterById(product.character_id) : null;
  const soldout = product.stock === 0;

  return (
    <main className="relative min-h-[100dvh] pb-24">
      <Starfield count={20} />
      <TopBar title="상품 상세" back />
      <div className="relative z-10 px-4 py-4">
        <div className="mb-4 flex h-56 items-center justify-center rounded-2xl text-6xl" style={{ background: `linear-gradient(135deg, ${product.theme_color}, #0D1028)` }}>
          🎁
        </div>
        <h2 className="text-xl font-extrabold text-ink">{product.name}</h2>
        <p className="mt-1 text-2xl font-extrabold text-accent">{formatKRW(product.price)}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{product.description}</p>
        {character && (
          <p className="mt-2 text-sm text-ink-muted">관련 캐릭터: <b className="text-ink">{character.name}</b></p>
        )}
        <p className="mt-2 text-xs text-ink-muted">{soldout ? "품절" : `재고 ${product.stock}개`}</p>

        {!soldout && (
          <div className="mt-5 flex items-center gap-4">
            <span className="text-sm font-semibold text-ink-soft">수량</span>
            <div className="flex items-center gap-3 rounded-full bg-elevated px-2 py-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface">
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-bold text-ink">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface">
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-line bg-surface/95 p-3 backdrop-blur">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={soldout}
            onClick={() => {
              add(product, qty);
              toast("장바구니에 담았어요 🛍️");
            }}
          >
            장바구니
          </Button>
          <Button
            className="flex-1"
            disabled={soldout}
            onClick={() => {
              add(product, qty);
              router.push("/shop/checkout");
            }}
          >
            {soldout ? "품절" : "바로 구매"}
          </Button>
        </div>
      </div>
    </main>
  );
}
