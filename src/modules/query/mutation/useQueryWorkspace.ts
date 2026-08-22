import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryRoutes, MUTATION_QUERY_WORKSPACE } from '../constants';
import type { QueryRequest, QueryResponse } from '../dto/queryDto';
import { apiService } from '../../../services/api';
import { QUERY_KEY_WORKSPACE_DATA } from '../../workspace/constants';

export const useQueryWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_QUERY_WORKSPACE],
    mutationFn: async (payload: QueryRequest) => {
      const workspaceId = payload.workspaceId || payload.sessionId || '';
      const requestPayload = {
        query: payload.query,
        workspaceId,
        selectedSourceIds: payload.selectedSourceIds,
      };

      return await apiService.post<typeof requestPayload, QueryResponse>(
        QueryRoutes.QUERY,
        requestPayload
      );
    },
    onSuccess: (_, variables) => {
      const workspaceId = variables.workspaceId || variables.sessionId;
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_WORKSPACE_DATA, workspaceId] });
      }
    },
  });
};
