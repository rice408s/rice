export function getProxiedImageUrl(url: string): string {
  // 如果已经是 HTTPS，直接返回
  if (url.startsWith('https://')) {
    return url;
  }
  
  // 移除 http:// 前缀
  const cleanUrl = url.replace(/^http:\/\//, '');
  
  // 方案1：使用 images.weserv.nl
  return `https://images.weserv.nl/?url=http://${cleanUrl}`;
  
  // 方案2：使用 wsrv.nl
  // return `https://wsrv.nl/?url=http://${cleanUrl}`;
  
  // 方案3：使用 imageproxy.org
  // return `https://imageproxy.org/v1/?url=http://${cleanUrl}`;
} 