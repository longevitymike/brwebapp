"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext"; // Temporarily commented out

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Keep for button state
  const [error, setError] = useState<string | null>(null); // Keep for UI
  // const { sendMagicLink } = useAuth(); // Temporarily commented out

  const validateEmail = (email: string) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email); // Basic regex
  };

  const handleSubmit = async () => {
    // Temporarily disable auth logic
    console.log("Attempting to send magic link for:", email);
    setIsLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    console.log("Simulated magic link sent.");
    setSent(true); 
    setIsLoading(false);
    
    /* Original Logic:
    if (!email) return;
    
    // Reset states
    setError(null);
    setIsLoading(true);
    
    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    
    // Send magic link
    const result = await sendMagicLink(email);
    setIsLoading(false);
    
    if (result.success) {
      setSent(true);
    } else {
      setError(result.error?.message || "Failed to send magic link");
    }
    */
  };

  return (
    <>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!email || isLoading}
              className={`mt-4 w-full py-3 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#007FFF] to-[#00D9FF] shadow-md hover:scale-[1.02] transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Sending..." : "Send Magic Link"} 
              {/* {isLoading ? "Sending..." : "Send Magic Link"} // Original text kept for reference */
            </button>
          </>
        ) : (
          <p className="text-white mt-6 text-sm">
            ✅ Magic link sent. Check your inbox to log in.
          </p>
        )}
      </div>
      <img
        src="/teenwolf.png"
        alt="Mascot"
        width={120}
        height={120}
        className="mt-6"
      />
    </>
  );
}
