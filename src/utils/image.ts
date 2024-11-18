export function getProxiedImageUrl(originalUrl: string): string {
  if (!originalUrl) return '';
  
  // 如果已经是 HTTPS，直接返回
  if (originalUrl.startsWith('https://')) {
    return originalUrl;
  }
  
  // 使用 Vercel 的图片代理服务
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
  return proxyUrl;
} 