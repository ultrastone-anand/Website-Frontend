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

export const getOptimizedImageUrl = (url, width = 1200, quality = 85) => {
  if (!url) return "";

  const encodedUrl = encodeUrlPath(url);

  if (!encodedUrl.includes(CDN_DOMAIN)) return encodedUrl;

  const path = encodedUrl.replace(CDN_DOMAIN, "");

  return `${CDN_DOMAIN}/cdn-cgi/image/width=${width},quality=${quality},format=auto${path}`;
};

export const getOriginalSafeUrl = (url) => {
  if (!url) return "";
  return encodeUrlPath(url);
};

export const getOptimizedVideoUrl = (url) => {
  if (!url) return "";
  return encodeUrlPath(url);
};