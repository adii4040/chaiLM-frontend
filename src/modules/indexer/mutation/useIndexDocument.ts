import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IndexerRoutes, MUTATION_INDEX_DOCUMENT } from '../constants';
import type { IndexerPayload, IndexerResponse } from '../dto/indexerDto';
import { apiService } from '../../../services/api';
import { QUERY_KEY_WORKSPACE_DATA, QUERY_KEY_ALL_WORKSPACES } from '../../workspace/constants';

export const useIndexDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_INDEX_DOCUMENT],
    mutationFn: async (payload: IndexerPayload) => {
      const workspaceId = payload.workspaceId || payload.sessionId || '';

      if ('file' in payload) {
        // PDF File upload via FormData
        const formData = new FormData();
        formData.append('file', payload.file);
        formData.append('type', 'pdf');
        formData.append('workspaceId', workspaceId);

        return await apiService.post<FormData, IndexerResponse>(
          IndexerRoutes.INDEX,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // JSON payload for YouTube / Website indexing
        const body = {
          type: payload.type,
          url: payload.url,
          workspaceId: workspaceId,
        };

        return await apiService.post<typeof body, IndexerResponse>(
          IndexerRoutes.INDEX,
          body
        );
      }
    },
    onSuccess: (_, variables) => {
      const workspaceId = variables.workspaceId || variables.sessionId;
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_WORKSPACE_DATA, workspaceId] });
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ALL_WORKSPACES] });
    },
  });
};
