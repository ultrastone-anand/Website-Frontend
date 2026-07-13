const CDN_DOMAIN = "https://cdn.ultrastone.in";

const encodeUrlPath = (url) => {
  try {
    const parsed = new URL(url);

    parsed.pathname = parsed.pathname
      .split("/")
      .map((part) => encodeURIComponent(decodeURIComponent(part)))
      .join("/");

    return parsed.toString();
  } catch {
    return url;
  }
};

export const getOptimizedImageUrl = (
  url,
  width = 1200,
  quality = 75
) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    // Optimize only images from your CDN.
    if (parsed.origin !== CDN_DOMAIN) {
      return encodeUrlPath(url);
    }

    // Avoid applying Cloudflare transformation twice.
    if (parsed.pathname.startsWith("/cdn-cgi/image/")) {
      return encodeUrlPath(url);
    }

    const safeWidth = Math.max(
      100,
      Math.round(Number(width) || 1200)
    );

    const safeQuality = Math.min(
      100,
      Math.max(1, Math.round(Number(quality) || 75))
    );

    parsed.pathname = parsed.pathname
      .split("/")
      .map((part) => encodeURIComponent(decodeURIComponent(part)))
      .join("/");

    const originalPath = `${parsed.pathname}${parsed.search}`;

    return `${CDN_DOMAIN}/cdn-cgi/image/width=${safeWidth},quality=${safeQuality},format=auto${originalPath}`;
  } catch {
    return encodeUrlPath(url);
  }
};

export const getOriginalSafeUrl = (url) => {
  if (!url) return "";
  return encodeUrlPath(url);
};

export const getOptimizedVideoUrl = (url) => {
  if (!url) return "";
  return encodeUrlPath(url);
};