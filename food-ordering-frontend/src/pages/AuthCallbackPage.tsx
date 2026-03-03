import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import * as authApi from "@/api/authApi";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handledRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (handledRef.current) return;
      handledRef.current = true;

      const params = new URLSearchParams(window.location.search);
      const hashStr = window.location.hash?.replace(/^#/, "") || "";
      const hashParams = new URLSearchParams(hashStr);

      const errorParam = params.get("error") || hashParams.get("error");
      if (errorParam) {
        console.error("[AuthCallback] OAuth error:", errorParam);
        toast.error("Connexion échouée");
        navigate("/sign-in?error=" + encodeURIComponent(errorParam));
        return;
      }

      const code = params.get("code") || hashParams.get("code");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("[AuthCallback] exchangeCodeForSession error:", error);
            toast.error("Session invalide. Réessayez.");
            navigate("/sign-in?error=" + encodeURIComponent(error.message));
            return;
          }
          if (data.session) {
            await storeSessionAndNavigate(data.session);
            return;
          }
        } catch (err) {
          console.error("[AuthCallback] exchangeCodeForSession exception:", err);
          toast.error("Erreur de connexion");
          navigate("/sign-in");
          return;
        }
      }

      if (accessToken && refreshToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            console.error("[AuthCallback] setSession error:", error);
            navigate("/sign-in?error=" + encodeURIComponent(error.message));
            return;
          }
          if (data.session) {
            await storeSessionAndNavigate(data.session);
            return;
          }
        } catch (err) {
          console.error("[AuthCallback] setSession exception:", err);
          navigate("/sign-in");
          return;
        }
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("[AuthCallback] getSession error:", error);
        navigate("/sign-in?error=" + encodeURIComponent(error.message));
        return;
      }

      if (session) {
        await storeSessionAndNavigate(session);
        return;
      }

      console.warn("[AuthCallback] No session found, redirecting to sign-in");
      navigate("/sign-in");
    };

    async function storeSessionAndNavigate(session: { access_token: string; user: { id: string; email?: string; user_metadata?: { name?: string; picture?: string } } }) {
      localStorage.setItem("session_id", session.access_token);
      localStorage.setItem("user_id", session.user.id);
      if (session.user.email) localStorage.setItem("user_email", session.user.email);
      if (session.user.user_metadata?.name) localStorage.setItem("user_name", session.user.user_metadata.name);
      if (session.user.user_metadata?.picture) localStorage.setItem("user_image", session.user.user_metadata.picture);

      try {
        const data = await authApi.validateToken();
        localStorage.setItem("is_admin", data?.isAdmin ? "1" : "0");
      } catch {
        localStorage.setItem("is_admin", "0");
      }

      queryClient.invalidateQueries("validateToken");
      toast.success("Connexion réussie !");
      window.location.replace("/");
    }

    handleCallback();
  }, [navigate, queryClient]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-crepe-purple" />
        <p className="text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
