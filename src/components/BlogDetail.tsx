import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import { getProxiedImageUrl } from '../utils/image';

// 定义 ImageProps 接口
interface ImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  node?: any;
}

// 组件代码
function BlogDetail() {
  // ...其他代码...

  return {
    img: ({ node, ...props }: ImageProps) => {
      return (
        <figure className="my-8">
          <img 
            {...props} 
            src={getProxiedImageUrl(props.src || '')}
            className="rounded-lg shadow-xl w-full" 
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.retried) {
                img.dataset.retried = 'true';
                img.src = img.src.replace('/proxy-image/', 'http://');
              }
            }}
          />
          {props.alt && (
            <figcaption className="mt-2 text-center text-sm text-white/40">
              {props.alt}
            </figcaption>
          )}
        </figure>
      );
    }
  };
}

export default BlogDetail; 