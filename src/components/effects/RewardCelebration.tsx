
import React, { useEffect } from "react";
import MascotCelebration from "./MascotCelebration";
import { useConfettiTrigger } from "./useConfettiTrigger";
import { playBadgeSound } from "./playBadgeSound";

interface RewardCelebrationProps {
  show: boolean;
}

export default function RewardCelebration({ show }: RewardCelebrationProps) {
  useConfettiTrigger(show);

  useEffect(() => {
    if (show) {
      playBadgeSound();
    }
  }, [show]);

  return <MascotCelebration show={show} />;
}
