import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkspaceRoutes, QUERY_KEY_ALL_WORKSPACES, MUTATION_DELETE_WORKSPACE } from '../constants';
import type { DeleteWorkspaceResponse } from '../dto/workspaceDto';
import { apiService } from '../../../services/api';

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_DELETE_WORKSPACE],
    mutationFn: async (workspaceId: string) => {
      return await apiService.delete<DeleteWorkspaceResponse>(
        WorkspaceRoutes.DELETE_WORKSPACE(workspaceId)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ALL_WORKSPACES] });
    },
  });
}
