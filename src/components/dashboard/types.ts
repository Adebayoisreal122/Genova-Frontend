import { API_URL } from "@/lib/api";

export type ImageType = "generated" | "bg-removed" | "upscaled";
export type Tab = "generate" | "remove-bg" | "upscale" | "gallery";

export interface ImageModel {
  id: string;
  name: string;
  hint?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  credits: number;
}

/** An image record as the API returns it. */
export interface DbImage {
  _id: string;
  type: ImageType;
  url?: string | null;
  filename?: string | null; // legacy records saved on the server disk
  prompt?: string | null;
  model?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: string;
}

export interface ImageMeta {
  width?: number;
  height?: number;
  model?: string;
  prompt?: string;
  createdAt: Date;
}

export interface GalleryItem {
  id: string;
  url: string;
  type: ImageType;
  meta: ImageMeta;
}

export function toItem(img: DbImage): GalleryItem {
  return {
    id: img._id,
    url: img.url ?? (img.filename ? `${API_URL}${img.filename}` : ""),
    type: img.type ?? "generated",
    meta: {
      prompt: img.prompt ?? undefined,
      model: img.model ?? undefined,
      width: img.width ?? undefined,
      height: img.height ?? undefined,
      createdAt: new Date(img.createdAt),
    },
  };
}
