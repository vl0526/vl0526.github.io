import { motion } from "framer-motion";

interface ToastProps {
  msg: string;
  onClose: () => void;
}

export const Toast = ({ msg, onClose }: ToastProps) => (
  <div className="fixed right-4 top-4 z-50">
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="glass-effect rounded-2xl px-6 py-4 text-white shadow-2xl border border-white/20 max-w-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <i className="fas fa-info-circle text-vn-gold"></i>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium leading-5">{msg}</div>
        </div>
        <button onClick={onClose} className="flex-shrink-0 text-white/70 hover:text-white transition-colors">
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>
    </motion.div>
  </div>
);
