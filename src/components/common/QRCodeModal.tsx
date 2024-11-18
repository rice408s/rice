interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">扫描二维码</h3>
          {/* 这里放置你的二维码图片 */}
          <div className="w-48 h-48 mx-auto bg-gray-200 mb-4">
            <img src="http://cdn.innov.ink/images/二维码美化 (3).png?image" alt="微信二维码" />
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
} 