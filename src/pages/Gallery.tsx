import { useState } from 'react';
import { Modal } from "@nextui-org/react";
import photos from '../assets/images/photos.json';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../components/common/PageTitle';
import { getProxiedImageUrl } from '../utils/image';

interface Photo {
  id: string;
  urls: string[];
  title: string;
  description: string;
  category: string;
  created: string;
}

const Gallery = () => {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(photos.photos.map(photo => photo.category)));

  const filteredPhotos = selectedCategory 
    ? photos.photos.filter(photo => photo.category === selectedCategory)
    : photos.photos;

  const handlePhotoClick = (photo: Photo) => {
    navigate(`/photo/${photo.id}`);
  };

  const handleNextImage = () => {
    if (selectedPhoto) {
      setCurrentImageIndex((prev) => 
        prev === selectedPhoto.urls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedPhoto) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedPhoto.urls.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <PageTitle title="Gallery" subtitle="记录生活的美好瞬间" />

        {/* 分类标签 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300
              ${!selectedCategory 
                ? 'bg-indigo-500/20 text-white border border-indigo-500/40' 
                : 'bg-white/[0.02] text-white/60 border border-white/[0.05] hover:border-indigo-500/30'
              }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                ${selectedCategory === category 
                  ? 'bg-indigo-500/20 text-white border border-indigo-500/40' 
                  : 'bg-white/[0.02] text-white/60 border border-white/[0.05] hover:border-indigo-500/30'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id}
              onClick={() => handlePhotoClick(photo)}
              className="relative group cursor-pointer overflow-hidden rounded-lg aspect-[4/3]"
            >
              <img
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={getProxiedImageUrl(photo.urls[0])}
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
              {/* 渐变遮罩和信息 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 
                  transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-light text-white/90">
                    {photo.title}
                  </h3>
                  <p className="text-sm text-white/70">
                    {photo.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span className="px-2 py-1 bg-white/10 rounded-full">
                      {photo.category}
                    </span>
                    <span>{photo.created}</span>
                  </div>
                </div>
              </div>
              {/* 多图标识 */}
              {photo.urls.length > 1 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 rounded-full text-xs text-white/80">
                  {photo.urls.length} 张
                </div>
              )}
            </div>
          ))}
        </div>

        <Modal 
          isOpen={!!selectedPhoto} 
          onClose={() => setSelectedPhoto(null)}
          size="5xl"
          className="bg-black/90"
          hideCloseButton
        >
          {selectedPhoto && (
            <div className="relative">
              <img
                alt={selectedPhoto.title}
                className="w-full max-h-[80vh] object-contain"
                src={selectedPhoto.urls[currentImageIndex]}
              />
              
              {selectedPhoto.urls.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full 
                      bg-black/50 text-white/80 hover:bg-black/70 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full 
                      bg-black/50 text-white/80 hover:bg-black/70 transition-colors"
                  >
                    →
                  </button>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full text-sm text-white/80">
                    {currentImageIndex + 1} / {selectedPhoto.urls.length}
                  </div>
                </>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <div className="max-w-4xl mx-auto space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl text-white/90">{selectedPhoto.title}</h3>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/70">
                      {selectedPhoto.category}
                    </span>
                  </div>
                  <p className="text-white/70">{selectedPhoto.description}</p>
                  <p className="text-sm text-white/50">{selectedPhoto.created}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/50 text-white/80 
                  hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Gallery; 