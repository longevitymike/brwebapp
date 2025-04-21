import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string; // Optional title
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: "-50px", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { y: "50px", opacity: 0, transition: { duration: 0.2 } },
};

const AnimatedModal: React.FC<ModalProps> = ({ show, onClose, children, title }) => {
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);


  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Close on backdrop click
        >
          <motion.div
            className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Optional Title */}
            {title && (
              <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
            )}

            {/* Content */}
            <div className="p-6"> {/* Add padding for content */}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;