import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StudioRoutes, QUERY_KEY_STUDIO_ARTIFACTS, MUTATION_DELETE_ARTIFACT } from '../constants';
import { apiService } from '../../../services/api';

export function useDeleteStudioArtifact(workspaceId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_DELETE_ARTIFACT],
    mutationFn: async (artifactId: string) => {
      return await apiService.delete<{ success: boolean; message: string; artifactId: string }>(
        StudioRoutes.DELETE(artifactId)
      );
    },
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_STUDIO_ARTIFACTS, workspaceId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_STUDIO_ARTIFACTS],
        });
      }
    },
  });
}
