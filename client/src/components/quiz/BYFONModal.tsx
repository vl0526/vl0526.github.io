interface BYFONModalProps {
  isOpen: boolean;
  strikes: number;
  onClose: () => void;
}

export const BYFONModal = ({ isOpen, strikes, onClose }: BYFONModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-br from-red-800 to-red-900 rounded-2xl border border-red-600/50 shadow-2xl byfon-alert">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Cảnh báo BYFON</h3>
          <p className="text-red-200 mb-4">
            Hệ thống phát hiện hành vi gian lận! Bạn đã bị cảnh báo <span className="font-bold text-red-100">{strikes}/2</span> lần.
          </p>
          <p className="text-sm text-red-300 mb-6">
            Nếu tiếp tục vi phạm, tài khoản sẽ bị khóa và chỉ admin mới có thể mở lại.
          </p>
          <button 
            onClick={onClose}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-all duration-200"
          >
            Tôi hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
