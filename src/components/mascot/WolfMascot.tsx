import { motion } from 'framer-motion'

// Define the possible poses and their corresponding image paths
type WolfPose = 'idle' | 'wave' | 'celebrate' | 'thinking' | 'rest';

const wolfImages: Record<WolfPose, string> = {
  idle: '/mascot/wolf_idle.png',
  wave: '/mascot/wolf_wave.png',
  celebrate: '/mascot/wolf_celebrate.png',
  thinking: '/mascot/wolf_thinking.png',
  rest: '/mascot/wolf_rest.png'
}

interface WolfMascotProps {
  pose?: WolfPose; // Make pose optional, defaulting to idle
}

export default function WolfMascot({ pose = 'idle' }: WolfMascotProps) {
  // Determine the image source based on the pose, fallback to idle
  const imageSrc = wolfImages[pose] || wolfImages.idle;

  return (
    <motion.div
      key={imageSrc} // Add key to ensure animation reruns when src changes
      className="relative w-fit absolute bottom-4 right-4 z-20" // w-fit added
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }} // Added damping
    >
      {/* Glowing aura */}
      <div className="absolute -inset-1 rounded-full bg-[#007FFF] blur-xl opacity-30 animate-pulse z-0" />

      {/* Wolf image */}
      <img
        src={imageSrc}
        alt={`Wolf Mascot (${pose})`} // More descriptive alt text
        className="relative z-10 w-24 sm:w-32 md:w-40 lg:w-48 drop-shadow-xl" // Added relative z-10
      />
    </motion.div>
  )
}