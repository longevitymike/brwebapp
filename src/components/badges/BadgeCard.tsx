
import React from "react";
import { Lock } from "lucide-react";
import clsx from "clsx";

interface BadgeCardProps {
  name: string;
  icon: JSX.Element;
  description: string;
  unlocked: boolean;
  tier?: "bronze" | "silver" | "gold";
  dateEarned?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  icon,
  description,
  unlocked,
  tier,
  dateEarned,
}) => {
  const glow = {
    bronze: "shadow-[0_0_10px_#cd7f32]",
    silver: "shadow-[0_0_12px_#c0c0c0]",
    gold: "shadow-[0_0_15px_#ffd700]",
  };

  return (
    <div
      className={clsx(
        "rounded-xl p-4 bg-white transition-all duration-300 text-center",
        unlocked ? glow[tier || "bronze"] : "bg-gray-100 opacity-50"
      )}
    >
      <div className="text-3xl mb-2 mx-auto flex justify-center">
        {unlocked ? icon : <Lock />}
      </div>
      <h4 className="font-semibold text-md">{name}</h4>
      <p className="text-xs text-gray-600">{description}</p>
      {unlocked && dateEarned && (
        <p className="text-xs mt-2 text-gray-500">{dateEarned}</p>
      )}
    </div>
  );
};
