// src/pages/auth/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Loader2, Dumbbell, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/stores/authStore';

const LoginPage: React.FC = () => {
  const [membershipId, setMembershipId] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setError, clearError, isLoading, error, setLoading } = useAuthStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    
    try {
      const response = await fetch(`/api/v2/method/ptrainer.ptrainer_methods.get_membership?membership=${membershipId}`);
      const result = await response.json();

      // Check if the response has a specific Frappe error format
      if (result.exc_type || result.exception || !response.ok) {
        throw new Error(result.exception || result.message || 'Invalid membership ID or expired membership');
      }

      // Assuming successful response has data property
      if (!result.data) {
        throw new Error('Invalid response format');
      }

      // Store the login data
      login(result.data);

      // Redirect to the originally requested URL or dashboard
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while trying to log in';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-4000" />
      </div>

      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-lg animate-bounce-in">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-slide-up">
            byShujaa
          </h1>
          <p className="text-gray-400 animate-slide-up animation-delay-200">
            Personal Training Studio
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8 animate-slide-up animation-delay-400">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Membership ID
                </label>
                <input
                  type="text"
                  value={membershipId}
                  onChange={(e) => setMembershipId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           transition-all duration-200"
                  placeholder="Enter your membership ID"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400 animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <button
                type="submit"
                disabled={isLoading || !membershipId}
                className="w-full group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                         text-white rounded-2xl py-3 font-medium relative overflow-hidden
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <div className="relative flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6 animate-fade-in animation-delay-600">
            Contact your trainer if you need help with your membership ID
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;