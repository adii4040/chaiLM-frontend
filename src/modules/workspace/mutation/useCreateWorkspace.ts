import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkspaceRoutes, QUERY_KEY_ALL_WORKSPACES, MUTATION_CREATE_WORKSPACE } from '../constants';
import type { CreateWorkspacePayload, CreateWorkspaceResponse } from '../dto/workspaceDto';
import { apiService } from '../../../services/api';

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_CREATE_WORKSPACE],
    mutationFn: async (payload: CreateWorkspacePayload) => {
      return await apiService.post<CreateWorkspacePayload, CreateWorkspaceResponse>(
        WorkspaceRoutes.WORKSPACE,
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ALL_WORKSPACES] });
    },
  });
}
