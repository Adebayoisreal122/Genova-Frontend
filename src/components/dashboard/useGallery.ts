"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "./Toast";
import { toItem, type DbImage, type GalleryItem } from "./types";

interface Page {
  images: DbImage[];
  nextCursor: string | null;
  total: number | null;
}

const PAGE_SIZE = 24;

export function useGallery() {
  const toast = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadFirst = useCallback(async () => {
    try {
      const page = await api<Page>(`/api/images?limit=${PAGE_SIZE}`);
      setItems(page.images.map(toItem));
      setTotal(page.total ?? page.images.length);
      setCursor(page.nextCursor);
    } catch (err) {
      toast((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadMore = useCallback(async () => {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const page = await api<Page>(`/api/images?limit=${PAGE_SIZE}&cursor=${cursor}`);
      setItems((p) => [...p, ...page.images.map(toItem)]);
      setCursor(page.nextCursor);
    } catch (err) {
      toast((err as Error).message);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, toast]);

  /** Called after the server saved a new image. */
  const add = useCallback((img: DbImage) => {
    setItems((p) => [toItem(img), ...p]);
    setTotal((t) => t + 1);
  }, []);

  const remove = useCallback(
    async (id: string) => {
      setItems((p) => p.filter((i) => i.id !== id)); // optimistic
      setTotal((t) => Math.max(0, t - 1));
      try {
        await api(`/api/images/${id}`, { method: "DELETE" });
      } catch (err) {
        toast((err as Error).message);
        loadFirst(); // put the real state back
      }
    },
    [toast, loadFirst],
  );

  return { items, total, loading, loadingMore, hasMore: cursor !== null, loadFirst, loadMore, add, remove };
}
