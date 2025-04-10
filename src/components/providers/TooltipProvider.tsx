
import React from 'react';
import { TooltipProvider as RadixTooltipProvider } from '@/components/ui/tooltip';

interface TooltipProviderProps {
  children: React.ReactNode;
}

export function TooltipProviderWrapper({ children }: TooltipProviderProps) {
  return <RadixTooltipProvider delayDuration={300}>{children}</RadixTooltipProvider>;
}
