import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white/60 dark:bg-white/10 border border-gray-200/60 dark:border-white/40 rounded-lg shadow-xl backdrop-blur-xl backdrop-saturate-150 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 p-8 w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Welcome!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Sign in to build and manage your budget
        </p>

        {/* Error message display - only shows if error exists */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white/40 dark:bg-white/20 backdrop-blur-md border border-gray-300/60 dark:border-white/30 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-white/60 dark:hover:bg-white/30 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
        >
          {/* Google Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Loading..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
