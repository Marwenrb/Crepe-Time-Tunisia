import { supabase } from "@/lib/supabase";
import { axiosInstance } from "@/lib/api-client";
import { API_BASE_URL, APP_BASE_URL, HAS_WORKING_API_URL } from "@/lib/runtime-config";

function storeSession(session: { access_token: string; user: { id: string; email?: string; user_metadata?: { name?: string; picture?: string } } }) {
  if (session?.access_token) {
    localStorage.setItem("session_id", session.access_token);
    localStorage.setItem("user_id", session.user.id);
    if (session.user.email) localStorage.setItem("user_email", session.user.email);
    if (session.user.user_metadata?.name) localStorage.setItem("user_name", session.user.user_metadata.name);
    if (session.user.user_metadata?.picture) localStorage.setItem("user_image", session.user.user_metadata.picture);
  }
}

export const signIn = async (data: { email: string; password: string }) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword(data);
  if (error) throw error;
  if (authData.session) {
    storeSession(authData.session);
    const isAdmin = await fetchIsAdmin(authData.session.access_token);
    localStorage.setItem("is_admin", isAdmin ? "1" : "0");
  }
  return { userId: authData.user?.id, isAdmin: localStorage.getItem("is_admin") === "1", user: authData.user };
};

export const signUp = async (data: { email: string; password: string; name: string; phone: string }) => {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { name: data.name, phone: data.phone } },
  });
  if (error) throw error;
  if (!authData.user?.id) {
    throw new Error("Registration failed. Please try again.");
  }

  const hasExistingIdentity = (authData.user.identities?.length || 0) > 0;
  if (!authData.session && !hasExistingIdentity) {
    throw new Error("This email is already registered. Please sign in.");
  }

  if (authData.session) {
    storeSession(authData.session);
    const isAdmin = await fetchIsAdmin(authData.session.access_token);
    localStorage.setItem("is_admin", isAdmin ? "1" : "0");
    if (HAS_WORKING_API_URL) {
      await axiosInstance.post("/api/my/user");
    }
    return {
      userId: authData.user.id,
      isAdmin,
      user: authData.user,
      hasSession: true,
      needsEmailVerification: false,
    };
  }
  return {
    userId: authData.user.id,
    isAdmin: false,
    user: authData.user,
    hasSession: false,
    needsEmailVerification: true,
  };
};

export const signInWithGoogle = () => {
  const redirectTo = `${APP_BASE_URL}/auth/callback`;
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
};

async function fetchIsAdmin(token: string): Promise<boolean> {
  if (!HAS_WORKING_API_URL) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return !!data?.isAdmin;
  } catch {
    return false;
  }
}

export const validateToken = async () => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token || localStorage.getItem("session_id");
  if (!token) return { userId: null, isAdmin: false };

  try {
    const res = await axiosInstance.get("/api/auth/validate-token");
    const data = res.data;
    if (data?.isAdmin !== undefined) {
      localStorage.setItem("is_admin", data.isAdmin ? "1" : "0");
    }
    return data;
  } catch {
    return { userId: null, isAdmin: false };
  }
};

export const signOut = async () => {
  await supabase.auth.signOut();
  await axiosInstance.post("/api/auth/logout").catch(() => {});
  ["session_id", "user_id", "user_email", "user_name", "user_image", "is_admin"].forEach((k) =>
    localStorage.removeItem(k)
  );
};
