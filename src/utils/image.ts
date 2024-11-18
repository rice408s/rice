export function getProxiedImageUrl(url: string): string {
  // 创建一个使用 HTTP 的 iframe 来加载图片
  return `data:text/html,<iframe src="${url}" style="border:0;width:100%;height:100%"></iframe>`;
} 