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

export const getOptimizedImageUrl = (url, width = 1200, quality = 75) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.origin !== CDN_DOMAIN) {
      return encodeUrlPath(url);
    }

    if (parsed.pathname.startsWith("/cdn-cgi/image/")) {
      return encodeUrlPath(url);
    }

    const encodedUrl = encodeUrlPath(url);
    const encodedParsed = new URL(encodedUrl);
    const path = `${encodedParsed.pathname}${encodedParsed.search}`;

    return `${CDN_DOMAIN}/cdn-cgi/image/width=${width},quality=${quality},format=auto${path}`;
  } catch {
    return url;
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