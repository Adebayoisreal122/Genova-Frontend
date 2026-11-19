import { downloadUrl } from "@/lib/cloudinary";

/** Download an image. Works for Cloudinary URLs (cross-origin) and local blob: URLs. */
export function downloadImage(url: string, baseName: string, ext = "png") {
  const a = document.createElement("a");
  a.href = url.startsWith("blob:") ? url : downloadUrl(url, baseName);
  a.download = `${baseName}.${ext}`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
