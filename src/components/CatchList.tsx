"use client";

import { useState, useTransition } from "react";
import type { CatchRow } from "@/lib/types";
import { deleteCatchAction } from "@/app/catches/actions";
import { CatchListItem } from "./CatchListItem";
import { showToast } from "./Toast";

export function CatchList({ catches }: { catches: CatchRow[] }) {
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [, startTransition] = useTransition();

  const onDelete = (id: number) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    startTransition(async () => {
      try {
        await deleteCatchAction(id);
        showToast("Catch deleted", "success");
      } catch {
        setHidden((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        showToast("Couldn't delete catch", "error");
      }
    });
  };

  const visible = catches.filter((c) => !hidden.has(c.id));

  return (
    <ul className="space-y-2">
      {visible.map((c) => (
        <CatchListItem
          key={c.id}
          catchRow={c}
          onDelete={onDelete}
          isDeleting={hidden.has(c.id)}
        />
      ))}
    </ul>
  );
}
