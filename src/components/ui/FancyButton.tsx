import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button"; // Assuming you use shadcn/ui button
import clsx from 'clsx';

// Extend ButtonProps to accept children and className
interface FancyButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const FancyButton: React.FC<FancyButtonProps> = ({ children, className, ...props }) => {
  return (
    // Basic styling, can be customized further
    <Button
      className={clsx(
        "bg-primary-gradient text-white font-semibold px-6 py-3 rounded-full transition-all hover:brightness-110 active:scale-95 shadow-lg", // Example styling
        className // Allow overriding/extending classes
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FancyButton;