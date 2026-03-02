import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import * as authApi from "@/api/authApi";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
      const errorParam = params.get("error") || hashParams.get("error");

      if (errorParam) {
        navigate("/sign-in?error=" + encodeURIComponent(errorParam));
        return;
      }

      const code = params.get("code");
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          navigate("/sign-in?error=" + encodeURIComponent(error.message));
          return;
        }
        if (data.session) {
          localStorage.setItem("session_id", data.session.access_token);
          localStorage.setItem("user_id", data.session.user.id);
          if (data.session.user.email) localStorage.setItem("user_email", data.session.user.email);
          if (data.session.user.user_metadata?.name) localStorage.setItem("user_name", data.session.user.user_metadata.name);
          if (data.session.user.user_metadata?.picture) localStorage.setItem("user_image", data.session.user.user_metadata.picture);
          const isAdmin = await authApi.validateToken().then((d) => d?.isAdmin);
          localStorage.setItem("is_admin", isAdmin ? "1" : "0");
          queryClient.invalidateQueries("validateToken");
          navigate("/");
          window.location.reload();
          return;
        }
      }

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        navigate("/sign-in?error=" + encodeURIComponent(error.message));
        return;
      }

      if (session) {
        localStorage.setItem("session_id", session.access_token);
        localStorage.setItem("user_id", session.user.id);
        if (session.user.email) localStorage.setItem("user_email", session.user.email);
        if (session.user.user_metadata?.name) localStorage.setItem("user_name", session.user.user_metadata.name);
        if (session.user.user_metadata?.picture) localStorage.setItem("user_image", session.user.user_metadata.picture);

        const isAdmin = await authApi.validateToken().then((d) => d?.isAdmin);
        localStorage.setItem("is_admin", isAdmin ? "1" : "0");

        queryClient.invalidateQueries("validateToken");
        navigate("/");
        window.location.reload();
      } else {
        navigate("/sign-in");
      }
    };

    handleCallback();
  }, [navigate, queryClient]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-crepe-purple" />
        <p className="text-gray-600">Completing sign-in...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
