import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/api-client";

export const useGetMyUser = () => {
  const getMyUserRequest = async (): Promise<User> => {
    const res = await axiosInstance.get("/api/my/user");
    // Keep localStorage avatar in sync with stored profile image
    if (res.data?.imageUrl) {
      localStorage.setItem("user_image", res.data.imageUrl);
    }
    return res.data;
  };

  const { data: currentUser, isLoading, error } = useQuery(
    "fetchCurrentUser",
    getMyUserRequest,
    { enabled: !!localStorage.getItem("session_id") }
  );

  if (error) {
    toast.error("Failed to fetch user");
  }

  return { currentUser, isLoading };
};

type UpdateMyUserRequest = {
  name: string;
  phone?: string;
  addressLine1: string;
  city: string;
  country: string;
};

export const useUpdateMyUser = () => {
  const queryClient = useQueryClient();

  const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
    const res = await axiosInstance.put("/api/my/user", formData);
    return res.data;
  };

  const { mutateAsync: updateUser, isLoading, isSuccess, error, reset } = useMutation(
    updateMyUserRequest,
    {
      onSuccess: (data) => {
        queryClient.setQueryData("fetchCurrentUser", data);
      },
    }
  );

  if (isSuccess) toast.success("Profil mis à jour !");
  if (error) {
    toast.error((error as Error).toString());
    reset();
  }

  return { updateUser, isLoading };
};

export const useUploadUserPhoto = () => {
  const queryClient = useQueryClient();

  const uploadPhotoRequest = async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("imageFile", file);
    const res = await axiosInstance.put("/api/my/user/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  const { mutateAsync: uploadPhoto, isLoading } = useMutation(uploadPhotoRequest, {
    onSuccess: (data) => {
      if (data?.imageUrl) {
        localStorage.setItem("user_image", data.imageUrl);
        queryClient.invalidateQueries("fetchCurrentUser");
      }
      toast.success("Photo de profil mise à jour !");
    },
    onError: () => {
      toast.error("Erreur lors du téléchargement de la photo");
    },
  });

  return { uploadPhoto, isLoading };
};
