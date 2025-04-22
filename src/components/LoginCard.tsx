"use client";

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email) return;
    setErrorMessage(null);
    // Explicitly redirect to /login so auth tokens are processed by AuthContext
    const redirectTo = `${window.location.origin}/login`;
    const { error } = await supabase.auth.signInWithOtp({ 
      email, 
      options: { emailRedirectTo: redirectTo } 
    });
    if (!error) setSent(true);
    if (error) setErrorMessage(error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl max-w-md w-full p-8 text-center shadow-xl border border-white/20">
        <img
          src="/blacklogo.png"
          alt="Barefoot Reset Logo"
          width={140}
          height={32}
          className="mx-auto mb-3"
        />
        <h1 className="text-2xl sm:text-3xl font-bebas tracking-wide text-white">
          Built Different Starts Here 👣
        </h1>
        <p className="text-white/80 text-sm mt-1">
          Your performance journey begins now.
        </p>

        {!sent ? (
          <>
            <div className="flex items-center bg-white/10 mt-6 rounded-lg px-3 py-2">
              <Mail className="h-4 w-4 text-white/60 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none border-none w-full text-white placeholder-white/60 text-sm"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!email}
              className="mt-4 w-full py-3 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#007FFF] to-[#00D9FF] shadow-md hover:scale-[1.02] transition-all"
            >
              Send Magic Link
            </button>
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
          </>
        ) : (
          <p className="text-white mt-6 text-sm">
            ✅ Magic link sent. Check your inbox to log in.
          </p>
        )}
      </div>

      <img
        src="/wolfthumbup.png"
        alt="Mascot"
        width={120}
        height={120}
        className="mt-6"
      />
    </div>
  );
}
