import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Will, WillFormData } from "@shared/schema";

export function useUserWills() {
  return useQuery<{ wills: Will[] }>({
    queryKey: ["/api/wills"],
    retry: false,
  });
}

export function useWill(id: number | null) {
  return useQuery<{ will: Will }>({
    queryKey: ["/api/wills", id],
    enabled: id !== null,
    retry: false,
  });
}

export function useWillDraft() {
  const { data: willsData, isLoading: isLoadingWills } = useUserWills();
  const draftWill = willsData?.wills?.find((w) => w.status === "draft");

  const createWillMutation = useMutation({
    mutationFn: async (formData: WillFormData) => {
      const response = await apiRequest("POST", "/api/wills", {
        formData,
        status: "draft",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wills"] });
    },
  });

  const updateWillMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: Partial<WillFormData> }) => {
      const response = await apiRequest("PATCH", `/api/wills/${id}`, { formData });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/wills"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wills", variables.id] });
    },
  });

  const completeWillMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/wills/${id}`, {
        status: "completed",
        completedAt: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wills"] });
    },
  });

  const deleteWillMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/wills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wills"] });
    },
  });

  return {
    draftWill,
    isLoading: isLoadingWills,
    createWill: createWillMutation.mutateAsync,
    updateWill: updateWillMutation.mutateAsync,
    completeWill: completeWillMutation.mutateAsync,
    deleteWill: deleteWillMutation.mutateAsync,
    isCreating: createWillMutation.isPending,
    isUpdating: updateWillMutation.isPending,
    isCompleting: completeWillMutation.isPending,
    isDeleting: deleteWillMutation.isPending,
  };
}
