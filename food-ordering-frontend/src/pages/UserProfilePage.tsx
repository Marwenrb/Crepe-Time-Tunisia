import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetMyUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

  if (isGetLoading) {
    return (
      <div
        className="relative min-h-screen w-full flex items-start justify-center py-10 px-4"
        style={{ background: "linear-gradient(160deg, #0F0A1F 0%, #1a0d3a 50%, #0F0A1F 100%)" }}
      >
        {/* Ambient orbs */}
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(109,40,217,0.8) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.08] blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 w-full max-w-2xl animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="h-8 w-40 rounded-xl bg-white/[0.07]" />
            <div className="h-3 w-60 rounded-full bg-white/[0.04]" />
          </div>

          {/* Avatar skeleton */}
          <div className="flex flex-col items-center mb-8 gap-3">
            <div className="w-28 h-28 rounded-full bg-white/[0.08] ring-4 ring-white/[0.05]" />
            <div className="h-2.5 w-36 rounded-full bg-white/[0.04]" />
            <div className="w-48 h-1.5 rounded-full bg-white/[0.06] mt-1" />
          </div>

          {/* Card skeleton */}
          <div
            className="rounded-[22px] p-[1px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(76,29,149,0.15) 50%, rgba(212,175,55,0.06) 100%)",
            }}
          >
            <div className="rounded-[20px] px-7 py-8 space-y-6" style={{ background: "rgba(15,10,31,0.94)" }}>
              {[100, 80, 90, 100].map((w, i) => (
                <div key={i} className="space-y-2">
                  <div className={`h-3 w-${w === 100 ? "24" : w === 80 ? "20" : "28"} rounded-full bg-white/[0.06]`} />
                  <div className="h-12 w-full rounded-[25px] bg-white/[0.05]" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-5">
                {[0, 1].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-16 rounded-full bg-white/[0.06]" />
                    <div className="h-12 w-full rounded-[25px] bg-white/[0.05]" />
                  </div>
                ))}
              </div>
              <div className="h-12 w-full rounded-xl bg-white/[0.07]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F0A1F" }}>
        <p className="text-white/40 text-sm">Impossible de charger le profil</p>
      </div>
    );
  }

  return (
    <UserProfileForm
      currentUser={currentUser}
      onSave={updateUser}
      isLoading={isUpdateLoading}
    />
  );
};

export default UserProfilePage;
