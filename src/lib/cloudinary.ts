// Cloudinary delivery helpers. Images are stored once at full quality; the browser
// asks Cloudinary for a right-sized, modern-format copy (WebP/AVIF) via the URL.

const isCloudinary = (url: string) => url.includes("res.cloudinary.com") && url.includes("/upload/");
const withTransform = (url: string, t: string) => (isCloudinary(url) ? url.replace("/upload/", `/upload/${t}/`) : url);

/** Small preview for grids. */
export const thumbUrl = (url: string, width = 480) => withTransform(url, `f_auto,q_auto,c_limit,w_${width}`);

/** Large preview for the result panel / lightbox. */
export const previewUrl = (url: string, width = 1280) => withTransform(url, `f_auto,q_auto,c_limit,w_${width}`);

/**
 * A URL that makes the browser download the file. The HTML `download` attribute is ignored
 * for cross-origin links, so Cloudinary's fl_attachment flag sets Content-Disposition instead.
 */
export const downloadUrl = (url: string, name: string) =>
  withTransform(url, `fl_attachment:${name.replace(/[^\w-]+/g, "-").slice(0, 60) || "image"}`);
