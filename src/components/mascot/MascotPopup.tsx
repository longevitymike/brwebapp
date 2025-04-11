
import React from 'react';

interface MascotPopupProps {
  show: boolean;
}

export default function MascotPopup({ show }: MascotPopupProps) {
  if (!show) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-white/90 p-4 rounded-xl shadow-xl">
      <img src="/mascot.png" alt="Mascot" className="w-12 h-12 mb-2" />
      <p className="text-sm font-medium">Need help? I'm here!</p>
    </div>
  );
}
