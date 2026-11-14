"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { isFavorite, toggleFavorite, subscribeStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { FavoriteItem } from "@/types";

export function FavoriteButton({
  kind,
  id,
  label = "收藏",
  variant = "outline",
  className,
}: {
  kind: FavoriteItem["kind"];
  id: string;
  label?: string;
  variant?: "outline" | "solid" | "compact";
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const sync = () => setActive(isFavorite(kind, id));
    sync();
    return subscribeStorage(sync);
  }, [kind, id]);

  const onClick = () => {
    const next = toggleFavorite(kind, id);
    setActive(next);
    if (next) {
      setFlash(true);
      window.setTimeout(() => setFlash(false), 1600);
    }
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={active ? "取消收藏" : label}
        title={active ? "取消收藏" : label}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition",
          active ? "border-brand bg-brand-soft text-brand-dark" : "border-line bg-white text-muted hover:border-brand hover:text-brand-dark",
          className,
        )}
      >
        {flash ? <Check size={16} /> : <Bookmark size={16} fill={active ? "currentColor" : "none"} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "btn btn-sm",
        active ? "border-brand bg-brand-soft text-brand-dark" : variant === "solid" ? "btn-dark" : "btn-outline",
        className,
      )}
    >
      {flash ? <Check size={15} /> : <Bookmark size={15} fill={active ? "currentColor" : "none"} />}
      {flash ? "已加入收藏" : active ? "已收藏" : label}
    </button>
  );
}
