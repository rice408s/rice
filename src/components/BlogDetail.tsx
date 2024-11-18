function getProxiedImageUrl(url: string): string {
  // 使用图片代理服务，比如 images.weserv.nl
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
}

img: ({ node, ...props }: ImageProps) => {
  return (
    <figure className="my-8">
      <img 
        {...props} 
        src={getProxiedImageUrl(props.src || '')}
        className="rounded-lg shadow-xl w-full" 
      />
      {props.alt && (
        <figcaption className="mt-2 text-center text-sm text-white/40">
          {props.alt}
        </figcaption>
      )}
    </figure>
  );
} 