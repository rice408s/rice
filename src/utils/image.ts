export function getProxiedImageUrl(url: string): string {
  const cleanUrl = url.replace(/^http:\/\//, '');
  
  // 方案1：使用 statically.io
  return `https://cdn.statically.io/img/${cleanUrl}`;
  
  // 方案2：使用 wsrv.nl（另一个配置）
  // return `https://wsrv.nl/?url=http://${cleanUrl}`;
  
  // 方案3：使用 proxy.duckduckgo.com
  // return `https://proxy.duckduckgo.com/iu/?u=http://${cleanUrl}`;
} 