import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import photos from '../assets/images/photos.json';
import { getProxiedImageUrl } from '../utils/image';

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const photo = photos.photos.find(p => p.id === id);
  
  if (!photo) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <button 
          onClick={() => navigate('/gallery')}
          className="px-4 py-2 bg-white/[0.02] border border-white/[0.05] 
            text-white/60 hover:text-white/90 hover:border-indigo-500/30 
            transition-all duration-300 rounded-lg"
        >
          返回相册
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center">
      <div className="w-full max-w-6xl mx-auto px-4 py-20">
        {/* 标题区域 - 居中显示 */}
        <div className="mb-16 space-y-8 text-center">
          {/* 装饰线 */}
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent mx-auto" />
          
          <div className="space-y-4">
            <h1 className="text-4xl font-light tracking-wider text-white/90">
              {photo.title}
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto font-light">
              {photo.description}
            </p>
          </div>

          <div className="flex justify-center items-center gap-12 text-sm">
            <div className="flex items-center gap-2 text-white/40">
              <span className="w-4 h-4 flex items-center justify-center opacity-60">📅</span>
              <span>{photo.created}</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <span className="w-4 h-4 flex items-center justify-center opacity-60">🏷️</span>
              <span>{photo.category}</span>
            </div>
          </div>
        </div>

        {/* 照片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {photo.urls.map((url, index) => (
            <div 
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden 
                bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 
                cursor-pointer"
            >
              <img 
                src={getProxiedImageUrl(url)}
                alt={`${photo.title} ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.dataset.retried) {
                    img.dataset.retried = 'true';
                    const originalUrl = new URL(img.src).searchParams.get('url');
                    if (originalUrl) {
                      img.src = originalUrl;
                    }
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* 返回按钮 - 底部居中 */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/gallery')}
            className="px-8 py-3 bg-white/[0.02] border border-white/[0.05] 
              text-white/60 hover:text-white/90 hover:border-indigo-500/30 
              transition-all duration-300 rounded-lg inline-flex items-center gap-3"
          >
            <span className="text-lg">←</span>
            <span>返回��册</span>
          </button>
        </div>
      </div>

      {/* 全屏预览 */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setSelectedImageIndex(null)}
        >
          <img
            src={getProxiedImageUrl(photo.urls[selectedImageIndex])}
            alt={photo.title}
            className="max-w-full max-h-[90vh] object-contain"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.retried) {
                img.dataset.retried = 'true';
                const originalUrl = new URL(img.src).searchParams.get('url');
                if (originalUrl) {
                  img.src = originalUrl;
                }
              }
            }}
          />
          
          {photo.urls.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(prev => 
                    prev !== null ? (prev === 0 ? photo.urls.length - 1 : prev - 1) : 0
                  );
                }}
                className="absolute left-4 p-4 rounded-full bg-black/50 text-white/80 hidden md:block"
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(prev => 
                    prev !== null ? (prev === photo.urls.length - 1 ? 0 : prev + 1) : 0
                  );
                }}
                className="absolute right-4 p-4 rounded-full bg-black/50 text-white/80 hidden md:block"
              >
                →
              </button>
            </>
          )}

          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full text-sm text-white/80">
            {selectedImageIndex + 1} / {photo.urls.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoDetail; 