export function getProxiedImageUrl(url: string): string {
  // 如果已经是 HTTPS，直接返回
  if (url.startsWith('https://')) {
    return url;
  }
  
  // 在开发环境中使用原始 URL
  if (process.env.NODE_ENV === 'development') {
    return url;
  }
  
  // 在生产环境中使用 Edge Function 代理
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
} 