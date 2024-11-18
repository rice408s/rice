export function getProxiedImageUrl(url: string): string {
  // 使用 images.weserv.nl 作为图片代理
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
} 