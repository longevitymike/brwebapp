import React from 'react';

export default function AnimatedGradientBackground() {
  return (
    <div
      className={`
        absolute inset-0 -z-10
        bg-gradient-to-br
        from-[#007FFF] via-[#7FBAFF] to-[#B3E5FC]
        bg-[length:200%_200%]
        animate-[gradient-xy_12s_ease-in-out_infinite]
        sm:bg-[length:250%_250%]
        md:bg-[length:300%_300%]
      `}
    />
  )
}