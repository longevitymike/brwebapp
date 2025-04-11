
import React from "react";

interface MascotCelebrationProps {
  show: boolean;
}

export default function MascotCelebration({ show }: MascotCelebrationProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <img
        src="/lovable-uploads/69cd4be6-21c5-4aef-b7e1-7cdb8b776fa5.png"
        alt="Mascot Celebration"
        className="w-32 h-32 animate-bounce drop-shadow-lg"
      />
    </div>
  );
}
