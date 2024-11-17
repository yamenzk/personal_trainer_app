
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useClientStore } from "@/stores/clientStore";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const { isLoading, offlineMode } = useClientStore();

  // Don't redirect while auth is initializing or app is in offline mode
  if (!isInitialized || isLoading || offlineMode) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          </div>
          <div className="text-foreground/60 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/client-login" replace />;
  }

  return children;
};