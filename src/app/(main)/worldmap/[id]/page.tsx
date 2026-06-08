"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-provider";
import { useToast } from "@/store/toast-provider";
import { PRODUCTS } from "@/data/products";
import { formatKRW, cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";

const CATS: { key: ProductCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "doll", label: "인형" },
  { key: "keyring", label: "키링" },
  { key: "photocard", label: "포토카드" },
  { key: "figure", label: "피규어" },
  { key: "etc", label: "기타" },
];

function CartButton() {
  const { count } = useCart();
  return (
    <Link href="/shop/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-elevated">
      <ShoppingCart size={20} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-night">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function ShopPage() {
  const { add } = useCart();
  const toast = useToast();
  const [cat, setCat] = useState<ProductCategory | "all">("all");

  const list = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={20} />
      <TopBar title="굿즈샵" right={<CartButton />} />
      <div className="relative z-10 px-4 py-4">
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                cat === c.key ? "bg-accent text-night" : "bg-elevated text-ink-soft",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {list.map((p) => {
            const soldout = p.stock === 0;
            return (
              <Card key={p.id} className="flex flex-col p-3">
                <Link href={`/shop/${p.id}`}>
                  <div className="mb-2 flex h-28 items-center justify-center rounded-lg text-3xl" style={{ background: `linear-gradient(135deg, ${p.theme_color}, #0D1028)` }}>
                    🎁
                  </div>
                  <p className="truncate text-sm font-bold text-ink">{p.name}</p>
                  <p className="text-sm font-semibold text-accent">{formatKRW(p.price)}</p>
                </Link>
                <Button
                  size="sm"
                  variant={soldout ? "ghost" : "outline"}
                  disabled={soldout}
                  className="mt-2 w-full"
                  onClick={() => {
                    add(p);
                    toast("장바구니에 담았어요 🛍️");
                  }}
                >
                  {soldout ? "품절" : "담기"}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
