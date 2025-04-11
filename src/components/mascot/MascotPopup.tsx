
import React from 'react';

interface MascotPopupProps {
  show: boolean;
}

export default function MascotPopup({ show }: MascotPopupProps) {
  if (!show) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-xl shadow-xl animate-bounce">
      <img src="/lovable-uploads/69cd4be6-21c5-4aef-b7e1-7cdb8b776fa5.png" alt="Mascot" className="w-16 h-16 mb-2" />
      <p className="text-sm font-medium text-center">Need help? I'm here!</p>
    </div>
  );
}
