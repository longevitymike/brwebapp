"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'canvas-confetti';
import Button from '@/components/ui/FancyButton';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// SignInScreen.tsx
export function SignInScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendLink = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setSent(!error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand to-[#00CFFF]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 w-full max-w-sm text-center space-y-6"
      >
        <img src="/blacklogo.png" alt="Barefoot Reset" className="mx-auto mb-4 w-32" />
        <h1 className="font-bebas text-3xl text-white">
          <span className="text-white">BAREFOOT</span> <span className="text-white/90">RESET</span>
        </h1>
        {sent ? (
          <p className="text-white font-medium">
            Magic link sent! Check your inbox 🔗
          </p>
        ) : (
          <>
            <p className="text-white/90">
              Enter your email and we’ll send you a magic link to log in.
            </p>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <Button
              onClick={handleSendLink}
              disabled={!email || loading}
              className="w-full py-3"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}

// OnboardingStepCard.tsx
export function OnboardingStepCard({ title, description, progress, onNext, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-brand to-[#00CFFF] p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/50 backdrop-blur-md rounded-2xl max-w-md w-full p-6 space-y-4 border border-white/30 relative font-interTight"
      >
        <img src="/blacklogo.png" alt="Barefoot Reset" className="mx-auto mb-4 w-24" />
        <h2 className="font-bebas text-2xl text-center text-gray-900">{title}</h2>
        <p className="text-gray-700 text-center leading-relaxed">{description}</p>
        <div>{children}</div>
        <Button onClick={onNext} className="w-full py-2">
          Next →
        </Button>
        <div className="h-1 bg-white/50 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-brand" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-center text-gray-800/70 text-sm">
          Step {Math.round((progress / 100) * 8)} of 8
        </p>
      </motion.div>
    </div>
  );
}

// OnboardingComplete.tsx
export function OnboardingComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    Confetti({ particleCount: 400, spread: 90 });
  }, []);

  return (
    <div className="flex items-center justify-center py-20 bg-gradient-to-br from-brand to-[#00CFFF] font-interTight">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/30 backdrop-blur-md rounded-3xl max-w-sm w-full p-8 text-center border border-white/40 shadow-lg"
      >
        <img src="/blacklogo.png" alt="Barefoot Reset" className="mx-auto mb-4 w-24" />
        <h1 className="font-bebas text-3xl text-gray-900 mb-4">
          YOU’RE ALL SET, <span className="text-brand">CHAMP</span> 🎉
        </h1>
        <p className="text-gray-800 mb-6">
          Let’s unlock your first session together.
        </p>
        <div className="bg-white/50 border border-white/40 rounded-lg p-4 mb-6">
          <p className="text-gray-900">
            Your athlete dashboard is ready! Track progress, access workouts, and more.
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 text-lg"
        >
          Go to Dashboard 🚀
        </Button>
        <motion.img
          src="/avatars/mascot-blue.png"
          alt="Mascot"
          className="w-24 h-24 absolute -bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        />
      </motion.div>
    </div>
  );
}
