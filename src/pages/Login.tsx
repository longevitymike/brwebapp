import { useState, ChangeEvent } from "react"; // Import ChangeEvent
import { Mail, Key, Sparkles, AlertCircle } from "lucide-react"; // Add AlertCircle
import clsx from "clsx";
import PageWrapper from "@/components/PageWrapper"; // Corrected import path
import { useAuth } from "@config/useAuth"; // Use Supabase auth hook

export default function Login() {
  const [role, setRole] = useState<"athlete" | "parent" | null>(null);
  const { supabase } = useAuth(); // Get supabase client from hook
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Add missing error state
  const handleLogin = async () => {
    // console.log("handleLogin triggered"); // Diagnostic log removed
    if (!role) {
      setError("Please select a role (Athlete or Parent)");
      return;
    }
    setError(null); // Clear previous errors
    setLoading(true);
    console.log(`Attempting login as ${role} with email: ${email}`);

    try {
      // Call Supabase sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError; // Throw error to be caught below
      }

      // Login successful, Supabase onAuthStateChange listener in useAuth
      // should handle the user state update and potential redirect logic
      // For now, we'll keep the explicit redirect.
      // Successful login is handled by AuthProvider (setting user state)
      // Redirect might happen based on isAuthenticated state changes elsewhere,
      // or we can keep the explicit redirect for now if needed.
      // Login successful! Supabase listener in useAuth handles user state.
      // We might redirect based on onboarding status later, but for now, redirect to dashboard.
      console.log(`Supabase login successful as ${role}! Redirecting...`);
      // TODO: Check onboarding status before redirecting (e.g., redirect to /onboarding if needed)
      window.location.href = '/'; // Or use navigate('/dashboard') if react-router's navigate is available

    } catch (err: any) {
      console.error("Login error:", err);
      // Use the error message from Supabase
      setError(err.error_description || err.message || "An unknown error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <main className="h-screen w-full bg-gradient-to-br from-[#007fff] to-[#005ae0] flex items-center justify-center">
        <div className="relative w-[90%] max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl text-center space-y-6">
          {/* Assuming logo.svg exists in public folder */}
          <img src="/logo.svg" alt="Barefoot Logo" className="mx-auto h-8" />
          <h1 className="text-white font-bold text-2xl">Barefoot Reset</h1>
          <p className="text-white/70 text-sm">
            Login to start your barefoot athletic journey
          </p>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-5 w-5" />
              <input
                placeholder="Email Address"
                className="pl-10 w-full rounded-lg py-2 px-4 bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40"
                value={email} // Use email state
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} // Add onChange handler
                type="email" // Add email type for validation/semantics
              />
            </div>

            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-5 w-5" />
              <input
                type="password"
                placeholder="Password"
                className="pl-10 w-full rounded-lg py-2 px-4 bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40"
                value={password} // Use password state
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Add onChange handler
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !role || !email || !password} // Disable if loading, no role, no email, or no password
              className={clsx(
                "w-full py-2 rounded-lg font-semibold transition-all",
                loading || !role || !email || !password // Match the disabled condition
                  ? "bg-white/20 text-white/50 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-100"
              )}
            >
              {loading ? "Loading..." : "Log In"}
            </button>

            {/* Error Message Display */}
            {error && (
              <div className="flex items-center justify-center gap-2 rounded-md bg-red-500/20 p-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Role Selection Buttons */}
          <div className="mt-4 flex justify-center gap-2 text-sm text-white/70">
            <button
              onClick={() => setRole("athlete")}
              className={clsx(
                "px-4 py-1 rounded-full",
                role === "athlete" ? "bg-white text-blue-600 font-bold" : "hover:bg-white/10"
              )}
            >
              👟 Athlete
            </button>
            <button
              onClick={() => setRole("parent")}
              className={clsx(
                "px-4 py-1 rounded-full",
                role === "parent" ? "bg-white text-blue-600 font-bold" : "hover:bg-white/10"
              )}
            >
              👩‍👧 Parent
            </button>
          </div>

          {/* Demo Info */}
          <div className="text-white/60 text-sm mt-2">
            <p>Select a role and enter your credentials.</p>
            {/* <p>Any password will work for this demo.</p> */} {/* Commented out demo info */}
          </div>


          {/* Footer elements */}
          <div className="absolute bottom-4 right-4 text-white/80 text-xs">
            👋 <Sparkles className="inline h-4 w-4 mr-1 animate-pulse" />
            Meet your Coach (Coming Soon)
          </div>

          {/* Assuming mascot.png exists in public folder */}
          <img
            src="/mascot.png"
            alt="Mascot"
            className="absolute bottom-4 left-4 h-12 animate-bounce"
          />
        </div>
      </main>
    </PageWrapper>
  );
}
