export function getProxiedImageUrl(url: string): string {
  // 如果已经是 HTTPS，直接返回
  if (url.startsWith('https://')) {
    return url;
  }
  
  // 移除 http:// 前缀
  const cleanUrl = url.replace(/^http:\/\//, '');
  
  // 在开发环境中使用原始 URL
  if (process.env.NODE_ENV === 'development') {
    return `http://${cleanUrl}`;
  }
  
  // 在生产环境中使用代理
  return `/proxy-image/${cleanUrl}`;
} 